import { SchoolRegistrationRepository } from '../repositories/SchoolRegistrationRepository.js';
import { SchoolRegistration } from '../entities/SchoolRegistration.js';
import { v4 as uuidv4 } from 'uuid';
import { dbManager } from '../database/dbClient.js'; 
import { SubscriptionPricingEngine } from './SubscriptionPricingEngine.js';
import { PaymentProviderFactory } from './payment/PaymentProvider.js';
import bcrypt from 'bcrypt';
import { logger } from '../telemetry/logger.js';

export class SchoolRegistrationService {
  private repository: SchoolRegistrationRepository;

  constructor() {
    this.repository = new SchoolRegistrationRepository('SYSTEM');
  }

  public async startRegistration(data: any): Promise<SchoolRegistration> {
    const schoolName = data.schoolName || data.institutionName || data.school_name || data.institution_name || '';
    if (!schoolName) {
      throw new Error('School/Institution name is required');
    }
    const existing = await this.repository.findByName(schoolName);

    // Sync names
    data.schoolName = schoolName;
    data.institutionName = schoolName;

    if (existing) {
      if (existing.status === 'DRAFT') {
        const updated = await this.repository.updateByRegistrationId(existing.registration_id, {
          ...data,
          updated_at: new Date()
        });
        if (!updated) {
          throw new Error('Failed to resume existing draft registration.');
        }
        return updated;
      }
      throw new Error('An institution with this name is already registered.');
    }

    const registration = await this.repository.insert({
      ...data,
      registration_id: uuidv4(),
      current_step: 1,
      progress: 20,
      status: 'DRAFT',
    });

    return registration;
  }

  public async updateDraft(registrationId: string, data: Partial<SchoolRegistration>): Promise<SchoolRegistration> {
    const d = data as any;
    const schoolName = d.schoolName || d.institutionName || d.school_name || d.institution_name;
    if (schoolName) {
      d.schoolName = schoolName;
      d.institutionName = schoolName;
    }
    const registration = await this.repository.updateByRegistrationId(registrationId, d);
    if (!registration) {
      throw new Error('Registration draft not found.');
    }
    return registration;
  }

  public async getRegistration(registrationId: string): Promise<SchoolRegistration> {
    const registration = await this.repository.findByRegistrationId(registrationId);
    if (!registration) {
      throw new Error('Registration draft not found.');
    }
    return registration;
  }

  /**
   * Prepares the payment, saving the plan details, calculating prices server-side,
   * creating a secure payment gateway order, and updating the registration record.
   */
  public async preparePayment(
    registrationId: string, 
    billingDetails: { planId: string; studentCapacity: number; billingCycle: string }
  ): Promise<any> {
    const draft = await this.repository.findByRegistrationId(registrationId);
    if (!draft) {
      throw new Error('Registration draft not found.');
    }

    const { planId, studentCapacity, billingCycle } = billingDetails;

    // Calculate official pricing server-side to prevent client-side spoofing
    const pricing = SubscriptionPricingEngine.calculate(planId, studentCapacity, billingCycle);

    // Get payment provider (mock or live)
    const provider = PaymentProviderFactory.getProvider();
    
    // Create secure gateway order
    const order = await provider.createOrder(registrationId, pricing.requiredInitialPayment, pricing.currency);

    // Save subscription and payment selections securely on draft
    const updatedDraft = await this.repository.updateByRegistrationId(registrationId, {
      selected_plan: planId,
      plan_id: planId,
      student_capacity: studentCapacity,
      billing_cycle: billingCycle,
      currency: pricing.currency,
      base_amount: pricing.baseAmount,
      setup_fee: pricing.setupFee,
      total_amount: pricing.totalAmount,
      required_initial_payment: pricing.requiredInitialPayment,
      remaining_amount: pricing.remainingAmount,
      gateway_order_id: order.id,
      payment_status: 'PENDING',
      current_step: 4,
      progress: 80
    });

    if (!updatedDraft) {
      throw new Error('Failed to update registration draft with billing details');
    }

    const keyId = order.keyId || process.env.VITE_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder';

    return {
      success: true,
      orderId: order.id,
      amount: pricing.requiredInitialPayment,
      currency: pricing.currency,
      keyId,
      pricing: {
        ...pricing,
        keyId
      }
    };
  }

  /**
   * Performs server-side payment verification, signature checking, transaction logging,
   * tenant database insertion, master user credential hashing, and registration completion.
   */
  public async verifyPayment(
    registrationId: string, 
    verification: { 
      orderId: string; 
      paymentId: string; 
      signature: string; 
      password?: string;
      paymentMethod?: string;
      transactionReference?: string;
      webhookVerified?: boolean;
    }
  ): Promise<any> {
    const draft = await this.repository.findByRegistrationId(registrationId);
    if (!draft) {
      throw new Error('Registration record not found.');
    }

    if (draft.status === 'COMPLETED' && draft.school_unique_id) {
      return {
        success: true,
        message: 'Registration and payment already verified & completed.',
        data: draft
      };
    }

    const planId = draft.plan_id || draft.selected_plan || 'silver';
    const studentCapacity = draft.student_capacity || 100;
    const billingCycle = draft.billing_cycle || 'annual';
    const requiredPayment = Number(draft.required_initial_payment) || 0;

    // 1. STRICT SERVER-SIDE VALIDATION CHECKS
    if (draft.gateway_order_id && draft.gateway_order_id !== verification.orderId) {
      throw new Error(`Order ID validation mismatch: Expected ${draft.gateway_order_id}, got ${verification.orderId}`);
    }

    if (draft.currency && draft.currency !== 'INR' && draft.currency !== 'USD') {
      throw new Error(`Currency validation error: Unsupported currency ${draft.currency}`);
    }

    // 2. Verify payment via the provider interface
    const provider = PaymentProviderFactory.getProvider();
    const verificationResult = await provider.verifyPayment(
      verification.orderId, 
      verification.paymentId, 
      verification.signature,
      requiredPayment
    );

    if (!verificationResult.success) {
      throw new Error(`Payment verification failed: ${verificationResult.message}`);
    }

    // Use transaction block to execute tenant, user, payment logs, and draft state updates atomically
    const client = await dbManager.getWriteClient();
    try {
      await client.query('BEGIN');

      // Check IDEMPOTENCY / PREVENT DUPLICATES (Primary check via schools table linked to registration)
      const existingSchoolCheck = await client.query(
        'SELECT id, tenant_id, school_unique_id FROM schools WHERE registration_id = $1',
        [registrationId]
      );

      if (existingSchoolCheck.rows.length > 0) {
        const schoolRow = existingSchoolCheck.rows[0];
        const userQuery = await client.query('SELECT id FROM universal_user WHERE tenant_id = $1', [schoolRow.tenant_id]);
        
        await client.query('COMMIT');
        logger.info('School registration activation already completed (Idempotency bypass: existing school detected)', { registrationId, schoolUniqueId: schoolRow.school_unique_id });
        
        return {
          success: true,
          message: 'School registration activated successfully (Idempotent bypass: existing record detected)',
          schoolUniqueId: schoolRow.school_unique_id,
          tenantId: schoolRow.tenant_id,
          schoolId: schoolRow.id,
          ownerUserId: userQuery.rows[0]?.id || null,
          registration: draft
        };
      }

      // Check IDEMPOTENCY (Secondary check via tenant registry with dynamic code resolution)
      const existingTenantCheck = await client.query(
        'SELECT id, tenant_code, tenant_name FROM tenant_registry WHERE tenant_code = (SELECT school_unique_id FROM school_registrations WHERE registration_id = $1)',
        [registrationId]
      );

      if (existingTenantCheck.rows.length > 0) {
        const tenantRow = existingTenantCheck.rows[0];
        const schoolQuery = await client.query('SELECT id FROM schools WHERE tenant_id = $1', [tenantRow.id]);
        const userQuery = await client.query('SELECT id FROM universal_user WHERE tenant_id = $1', [tenantRow.id]);
        
        await client.query('COMMIT');
        logger.info('School registration activation already completed (Idempotency bypass: existing tenant detected)', { registrationId, schoolUniqueId: tenantRow.tenant_code });
        
        return {
          success: true,
          message: 'School registration activated successfully (Idempotent bypass: existing record detected)',
          schoolUniqueId: tenantRow.tenant_code,
          tenantId: tenantRow.id,
          schoolId: schoolQuery.rows[0]?.id || null,
          ownerUserId: userQuery.rows[0]?.id || null,
          registration: draft
        };
      }

      // Generate a collision-free School Unique ID and Tenant UUIDs
      let schoolUniqueId = '';
      let isUnique = false;
      let attempts = 0;
      while (!isUnique && attempts < 10) {
        attempts++;
        schoolUniqueId = 'GAL-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        const dupCheck = await client.query('SELECT id FROM schools WHERE school_unique_id = $1', [schoolUniqueId]);
        if (dupCheck.rows.length === 0) {
          isUnique = true;
        }
      }
      
      const tenantId = uuidv4();
      const ownerUserId = uuidv4();
      const schoolId = uuidv4();
      const subscriptionId = uuidv4();

      logger.info('Generated new node identity parameters', { registrationId, schoolUniqueId, tenantId, schoolId, subscriptionId });

      const paymentMethod = verification.paymentMethod || 'gateway-default';
      const txnRef = verification.transactionReference || verification.paymentId;
      const isWebhook = !!verification.webhookVerified;

      // Check if an existing transaction record exists, otherwise insert it
      const txCheck = await client.query('SELECT id FROM payment_transactions WHERE gateway_order_id = $1', [verification.orderId]);
      
      if (txCheck.rows.length > 0) {
        await client.query(`
          UPDATE payment_transactions
          SET school_id = $1,
              school_unique_id = $2,
              tenant_id = $3,
              subscription_id = $4,
              payment_id = $5,
              gateway_payment_id = $5,
              gateway_signature = $6,
              payment_method = $7,
              amount = $8,
              paid_amount = $8,
              payment_status = 'PAID',
              status = 'CAPTURED',
              signature_verified = TRUE,
              webhook_verified = $9,
              paid_at = NOW(),
              transaction_reference = $10,
              updated_at = NOW()
          WHERE gateway_order_id = $11
        `, [
          schoolId,
          schoolUniqueId,
          tenantId,
          subscriptionId,
          verification.paymentId,
          verification.signature,
          paymentMethod,
          requiredPayment,
          isWebhook,
          txnRef,
          verification.orderId
        ]);
      } else {
        await client.query(`
          INSERT INTO payment_transactions (
            id, registration_id, school_id, school_unique_id, tenant_id, subscription_id, plan_id, student_capacity, billing_cycle, currency,
            base_amount, setup_fee, total_amount, required_initial_payment, paid_amount, amount, remaining_amount,
            payment_status, status, gateway, gateway_order_id, payment_order_id, gateway_payment_id, payment_id, gateway_signature,
            payment_method, signature_verified, webhook_verified, paid_at, transaction_reference, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $15, $16, $17, $18, $19, $20, $20, $21, $21, $22, $23, TRUE, $24, NOW(), $25, NOW(), NOW())
        `, [
          uuidv4(),
          registrationId,
          schoolId,
          schoolUniqueId,
          tenantId,
          subscriptionId,
          planId,
          studentCapacity,
          billingCycle,
          draft.currency || 'INR',
          draft.base_amount || 0,
          draft.setup_fee || 0,
          draft.total_amount || 0,
          requiredPayment,
          requiredPayment,
          draft.remaining_amount || 0,
          'PAID',
          'CAPTURED',
          draft.gateway || (process.env.PAYMENT_MODE === 'live' ? 'RAZORPAY' : 'MOCK'),
          verification.orderId,
          verification.paymentId,
          verification.signature,
          paymentMethod,
          isWebhook,
          txnRef
        ]);
      }

      // Write Audit Log: PAYMENT_VERIFIED
      await client.query(`
        INSERT INTO school_registration_audit_logs (tenant_id, school_id, registration_id, event_type, metadata)
        VALUES ($1, $2, $3, $4, $5)
      `, [tenantId, schoolUniqueId, registrationId, 'PAYMENT_VERIFIED', JSON.stringify({ amount: requiredPayment, transactionId: verification.paymentId })]);

      // Write Audit Log: SCHOOL_ID_GENERATED
      await client.query(`
        INSERT INTO school_registration_audit_logs (tenant_id, school_id, registration_id, event_type, metadata)
        VALUES ($1, $2, $3, $4, $5)
      `, [tenantId, schoolUniqueId, registrationId, 'SCHOOL_ID_GENERATED', JSON.stringify({ schoolUniqueId })]);

      // 2. Provision Tenant in multi-tenant registry with dynamic tier mapping
      await client.query(`
        INSERT INTO tenant_registry (id, tenant_code, tenant_name, status, subscription_tier)
        VALUES ($1, $2, $3, $4, $5)
      `, [
        tenantId, 
        schoolUniqueId, 
        draft.institution_name || draft.school_name || 'Galaxy School Instance', 
        'active', 
        planId
      ]);

      // Write Audit Log: TENANT_CREATED
      await client.query(`
        INSERT INTO school_registration_audit_logs (tenant_id, school_id, registration_id, event_type, metadata)
        VALUES ($1, $2, $3, $4, $5)
      `, [tenantId, schoolUniqueId, registrationId, 'TENANT_CREATED', JSON.stringify({ tenantId, tenant_code: schoolUniqueId })]);

      // 3. Create Authoritative School Record
      await client.query(`
        INSERT INTO schools (
          id, registration_id, tenant_id, school_unique_id, name, institution_type, board, affiliation_number,
          official_email, official_mobile, address, city, state, country, pin_code, logo, primary_color, secondary_color,
          created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, NOW(), NOW())
      `, [
        schoolId,
        registrationId,
        tenantId,
        schoolUniqueId,
        draft.institution_name || draft.school_name || 'Galaxy School Instance',
        draft.institution_type || draft.school_type || 'K-12',
        draft.board_type || draft.state || 'CBSE',
        draft.affiliation_number || '',
        draft.official_email || draft.admin_email || '',
        draft.owner_mobile || draft.official_phone || draft.admin_phone || '',
        draft.address || '',
        draft.city || '',
        draft.state || '',
        draft.country || 'India',
        draft.pincode || draft.postal_code || '',
        draft.logo_url || '',
        draft.primary_brand_color || '#4f46e5',
        draft.secondary_brand_color || '#06b6d4'
      ]);

      // Write Audit Log: SCHOOL_CREATED
      await client.query(`
        INSERT INTO school_registration_audit_logs (tenant_id, school_id, registration_id, event_type, metadata)
        VALUES ($1, $2, $3, $4, $5)
      `, [tenantId, schoolUniqueId, registrationId, 'SCHOOL_CREATED', JSON.stringify({ schoolId, name: draft.institution_name || draft.school_name })]);

      // 4. Hash administrative password securely using bcrypt
      const plainPassword = verification.password || draft.metadata?.admin_password || 'Admin@123';
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

      const adminEmail = draft.owner_email || draft.admin_email || 'owner@galaxy.edu';
      const adminPhone = draft.owner_mobile || draft.admin_phone || '';
      const adminName = draft.owner_name || draft.admin_name || 'School Principal';

      // Check if a universal_user already exists with this email
      const existingUserByEmail = await client.query(
        'SELECT id, phone, username FROM universal_user WHERE email = $1',
        [adminEmail]
      );

      let resolvedOwnerUserId = ownerUserId;

      if (existingUserByEmail.rows.length > 0) {
        resolvedOwnerUserId = existingUserByEmail.rows[0].id;
        
        // Handle phone conflict in case phone is already in use by another user
        let updatedPhone = adminPhone || null;
        if (updatedPhone) {
          const existingPhoneCheck = await client.query(
            'SELECT id FROM universal_user WHERE phone = $1 AND id != $2',
            [updatedPhone, resolvedOwnerUserId]
          );
          if (existingPhoneCheck.rows.length > 0) {
            updatedPhone = existingUserByEmail.rows[0].phone || null; // fallback to existing phone or null
          }
        }

        // Update existing Master Owner account to associate with the new tenant and password
        await client.query(`
          UPDATE universal_user 
          SET tenant_id = $1,
              phone = $2,
              username = $3,
              password_hash = $4,
              status = 'active',
              verification_status = 'verified',
              updated_at = NOW()
          WHERE id = $5
        `, [
          tenantId,
          updatedPhone,
          adminEmail, // Username matches email
          hashedPassword,
          resolvedOwnerUserId
        ]);
      } else {
        // If the user does not exist by email, we should still handle phone conflict for a new insert
        let finalPhone = adminPhone || null;
        if (finalPhone) {
          const existingPhoneCheck = await client.query(
            'SELECT id FROM universal_user WHERE phone = $1',
            [finalPhone]
          );
          if (existingPhoneCheck.rows.length > 0) {
            finalPhone = null; // phone is already in use, set to null to avoid constraint violation
          }
        }

        // Insert Master Owner account into public.universal_user
        await client.query(`
          INSERT INTO universal_user (
            id, tenant_id, email, phone, username, user_type, password_hash, status, verification_status
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `, [
          resolvedOwnerUserId,
          tenantId,
          adminEmail,
          finalPhone,
          adminEmail, // Username matches email by default
          'staff', // Staff type is fine for master owners/admins
          hashedPassword,
          'active',
          'verified'
        ]);
      }

      // Write Audit Log: OWNER_CREATED
      await client.query(`
        INSERT INTO school_registration_audit_logs (tenant_id, school_id, registration_id, user_id, event_type, metadata)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [tenantId, schoolUniqueId, registrationId, resolvedOwnerUserId, 'OWNER_CREATED', JSON.stringify({ name: adminName, email: adminEmail })]);

      // 5. Subscription Activation
      await client.query(`
        INSERT INTO school_subscriptions (
          id, tenant_id, school_id, registration_id, plan_id, plan, student_capacity, billing_cycle,
          base_amount, setup_fee, total_amount, paid_amount, remaining_amount, subscription_status, start_date,
          created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), NOW(), NOW())
      `, [
        subscriptionId,
        tenantId,
        schoolId,
        registrationId,
        planId,
        planId,
        studentCapacity,
        billingCycle,
        draft.base_amount || 0,
        draft.setup_fee || 0,
        draft.total_amount || 0,
        requiredPayment,
        draft.remaining_amount || 0,
        'ACTIVE'
      ]);

      // Write Audit Log: SUBSCRIPTION_ACTIVATED
      await client.query(`
        INSERT INTO school_registration_audit_logs (tenant_id, school_id, registration_id, user_id, event_type, metadata)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [tenantId, schoolUniqueId, registrationId, resolvedOwnerUserId, 'SUBSCRIPTION_ACTIVATED', JSON.stringify({ planId, capacity: studentCapacity, status: 'ACTIVE' })]);

      // Write Audit Log: CERTIFICATE_GENERATED
      await client.query(`
        INSERT INTO school_registration_audit_logs (tenant_id, school_id, registration_id, user_id, event_type, metadata)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [tenantId, schoolUniqueId, registrationId, resolvedOwnerUserId, 'CERTIFICATE_GENERATED', JSON.stringify({ docType: 'Registration Certificate' })]);

      // Write Audit Log: RECEIPT_GENERATED
      await client.query(`
        INSERT INTO school_registration_audit_logs (tenant_id, school_id, registration_id, user_id, event_type, metadata)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [tenantId, schoolUniqueId, registrationId, resolvedOwnerUserId, 'RECEIPT_GENERATED', JSON.stringify({ amount: requiredPayment })]);

      // 6. Upgrade the school registration draft row to PAID, activated, and completed
      const updated = await this.repository.updateByRegistrationId(registrationId, {
        payment_status: 'PAID',
        status: 'COMPLETED',
        progress: 100,
        current_step: 5,
        school_unique_id: schoolUniqueId,
        tenant_id: tenantId,
        owner_user_id: resolvedOwnerUserId,
        gateway_payment_id: verification.paymentId,
        gateway_signature: verification.signature,
        activated_at: new Date()
      });

      // Write Audit Log: REGISTRATION_COMPLETED
      await client.query(`
        INSERT INTO school_registration_audit_logs (tenant_id, school_id, registration_id, user_id, event_type, metadata)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [tenantId, schoolUniqueId, registrationId, resolvedOwnerUserId, 'REGISTRATION_COMPLETED', JSON.stringify({ completed: true })]);

      await client.query('COMMIT');
      logger.info('School activation transaction committed successfully', { schoolUniqueId, tenantId });

      return {
        success: true,
        message: 'School registration activated successfully',
        schoolUniqueId,
        tenantId,
        schoolId,
        ownerUserId: resolvedOwnerUserId,
        registration: updated
      };
    } catch (err: any) {
      await client.query('ROLLBACK');
      logger.error('Failed school activation transaction', { error: err.message });
      throw err;
    } finally {
      client.release();
    }
  }

  public async completeRegistration(registrationId: string, formData: any, password?: string): Promise<any> {
    const draft = await this.repository.findByRegistrationId(registrationId);
    if (!draft) {
      throw new Error('Registration draft not found.');
    }

    if (draft.status === 'COMPLETED' && draft.school_unique_id) {
      return {
        success: true,
        message: 'Registration already completed.',
        registration: draft
      };
    }

    // Generate Unique School ID
    const schoolUniqueId = 'GAL-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const client = await dbManager.getWriteClient();
    try {
      await client.query('BEGIN');
      
      const tenantId = uuidv4();
      
      await client.query(`
        INSERT INTO tenant_registry (id, tenant_code, tenant_name, status)
        VALUES ($1, $2, $3, $4)
      `, [tenantId, schoolUniqueId, formData.institutionName || formData.schoolName || formData.school_name || draft.institution_name || draft.school_name, 'active']);
      
      const updated = await this.repository.updateByRegistrationId(registrationId, {
        ...formData,
        status: 'COMPLETED',
        progress: 100,
        current_step: 5,
        school_unique_id: schoolUniqueId,
        tenant_id: tenantId
      });

      await client.query('COMMIT');

      return {
        success: true,
        message: 'Registration completed successfully.',
        registration: updated
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Processes a webhook notification from the payment gateway to complete registration asynchronously.
   */
  public async handlePaymentWebhook(orderId: string, paymentId: string, signature: string): Promise<any> {
    logger.info('[PaymentWebhook] Received payment webhook from gateway', { orderId, paymentId });

    // Find registration record linked to this gateway order id
    const result = await dbManager.query(
      'SELECT registration_id, status, metadata FROM school_registrations WHERE gateway_order_id = $1 AND deleted_at IS NULL LIMIT 1',
      [orderId]
    );

    if (result.rows.length === 0) {
      logger.error('[PaymentWebhook] No draft found for this payment order', { orderId });
      throw new Error(`Registration with payment order id ${orderId} not found.`);
    }

    const draft = result.rows[0];

    if (draft.status === 'COMPLETED') {
      logger.info('[PaymentWebhook] Registration already completed, webhook is idempotent.', { orderId, registrationId: draft.registration_id });
      return {
        success: true,
        message: 'Registration already completed.',
        registrationId: draft.registration_id
      };
    }

    logger.info('[PaymentWebhook] Automatically completing registration in the background', { registrationId: draft.registration_id });

    // Perform atomic verification and provisioning
    return await this.verifyPayment(draft.registration_id, {
      orderId,
      paymentId,
      signature: signature || `wh_sig_${Math.random().toString(36).substring(2, 10)}`,
      password: draft.metadata?.admin_password || 'Admin@123',
      webhookVerified: true
    });
  }
}
