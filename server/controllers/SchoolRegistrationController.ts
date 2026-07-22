import { Request, Response } from 'express';
import { SchoolRegistrationService } from '../services/SchoolRegistrationService.js';
import { startRegistrationSchema } from '../validators/schoolRegistrationValidator.js';
import { SubscriptionPricingEngine } from '../services/SubscriptionPricingEngine.js';
import { logger } from '../telemetry/logger.js';
import { dbManager } from '../database/dbClient.js';
import { PaymentProviderFactory } from '../services/payment/PaymentProvider.js';

const registrationService = new SchoolRegistrationService();

export class SchoolRegistrationController {
  public static async start(req: Request, res: Response) {
    try {
      const validatedData = startRegistrationSchema.parse(req.body);
      const registration = await registrationService.startRegistration(validatedData);
      
      logger.info('School registration started/resumed', { registration_id: registration.registration_id });
      
      const isNew = registration.created_at.getTime() === registration.updated_at.getTime();
      const status = isNew ? 201 : 200;
      
      res.status(status).json({
        success: true,
        data: registration,
        message: 'Registration draft saved successfully'
      });
    } catch (error: any) {
      logger.error('Failed to start school registration', { error: error.message });
      const status = error.message.includes('already registered') ? 409 : 400;
      res.status(status).json({
        success: false,
        data: null,
        message: error.message || 'Validation failed'
      });
    }
  }

  public static async get(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const registration = await registrationService.getRegistration(id);
      res.status(200).json({
        success: true,
        data: registration,
        message: 'Registration fetched successfully'
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        data: null,
        message: error.message
      });
    }
  }

  public static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updated = await registrationService.updateDraft(id, req.body);
      res.status(200).json({
        success: true,
        data: updated,
        message: 'Registration draft updated successfully'
      });
    } catch (error: any) {
      logger.error('Failed to update registration draft', { error: error.message });
      res.status(400).json({
        success: false,
        message: error.message || 'Update failed'
      });
    }
  }

  /**
   * Action to calculate subscription pricing dynamically server-side
   */
  public static async calculate(req: Request, res: Response) {
    try {
      const { planId, studentCapacity, billingCycle } = req.body;
      if (!planId || !studentCapacity || !billingCycle) {
        return res.status(400).json({
          success: false,
          message: 'planId, studentCapacity, and billingCycle are required parameters.'
        });
      }

      const pricing = SubscriptionPricingEngine.calculate(planId, Number(studentCapacity), billingCycle);
      res.status(200).json({
        success: true,
        data: pricing,
        message: 'Pricing calculated successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to calculate pricing'
      });
    }
  }

  /**
   * Action to save plan/capacity selections and prepare checkout gateway order
   */
  public static async preparePayment(req: Request, res: Response) {
    try {
      const { registrationId, planId, studentCapacity, billingCycle } = req.body;
      if (!registrationId || !planId || !studentCapacity || !billingCycle) {
        return res.status(400).json({
          success: false,
          message: 'registrationId, planId, studentCapacity, and billingCycle are required parameters.'
        });
      }

      const orderData = await registrationService.preparePayment(registrationId, {
        planId,
        studentCapacity: Number(studentCapacity),
        billingCycle
      });

      res.status(200).json(orderData);
    } catch (error: any) {
      logger.error('Failed to prepare school registration payment order', { error: error.message });
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to prepare payment order'
      });
    }
  }

  /**
   * Action to verify payment signature and activate the school tenant + owner account
   */
  public static async verifyPayment(req: Request, res: Response) {
    try {
      const { registrationId, orderId, paymentId, signature, password } = req.body;
      if (!registrationId || !orderId || !paymentId) {
        return res.status(400).json({
          success: false,
          message: 'registrationId, orderId, and paymentId are required parameters.'
        });
      }

      const result = await registrationService.verifyPayment(registrationId, {
        orderId,
        paymentId,
        signature,
        password
      });

      res.status(200).json(result);
    } catch (error: any) {
      logger.error('Failed to verify payment and activate school', { error: error.message });
      res.status(400).json({
        success: false,
        message: error.message || 'Payment verification or school activation failed'
      });
    }
  }

  public static async activate(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { orderId, paymentId, signature, password } = req.body;
      if (!id || !orderId || !paymentId) {
        return res.status(400).json({
          success: false,
          message: 'registrationId (in URL path), orderId, and paymentId are required parameters.'
        });
      }

      const result = await registrationService.verifyPayment(id, {
        orderId,
        paymentId,
        signature,
        password
      });

      res.status(200).json(result);
    } catch (error: any) {
      logger.error('Failed to activate school registration via endpoint', { error: error.message });
      res.status(400).json({
        success: false,
        message: error.message || 'Activation failed'
      });
    }
  }

  public static async status(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const registration = await registrationService.getRegistration(id);
      res.status(200).json({
        success: true,
        status: registration.status,
        paymentStatus: registration.payment_status,
        currentStep: registration.current_step,
        progress: registration.progress,
        schoolUniqueId: registration.school_unique_id,
        tenantId: registration.tenant_id
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Registration not found'
      });
    }
  }

  public static async certificate(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const registration = await registrationService.getRegistration(id);
      
      const schoolResult = await dbManager.query('SELECT * FROM schools WHERE registration_id = $1', [id]);
      const subResult = await dbManager.query('SELECT * FROM school_subscriptions WHERE registration_id = $1', [id]);
      
      res.status(200).json({
        success: true,
        registration,
        school: schoolResult.rows[0] || null,
        subscription: subResult.rows[0] || null
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Certificate record fetching failed'
      });
    }
  }

  public static async receipt(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const registration = await registrationService.getRegistration(id);
      
      const paymentResult = await dbManager.query('SELECT * FROM payment_transactions WHERE registration_id = $1 ORDER BY created_at DESC LIMIT 1', [id]);
      const schoolResult = await dbManager.query('SELECT * FROM schools WHERE registration_id = $1', [id]);

      res.status(200).json({
        success: true,
        registration,
        school: schoolResult.rows[0] || null,
        payment: paymentResult.rows[0] || null
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Receipt record fetching failed'
      });
    }
  }

  public static async complete(req: Request, res: Response) {
    try {
      const { registrationId, formData, password } = req.body;
      if (!registrationId) throw new Error('Registration ID is required');
      
      const result = await registrationService.completeRegistration(registrationId, formData, password);
      
      logger.info('School registration completed', { registration_id: registrationId });
      
      res.status(200).json({
        success: true,
        data: result.registration,
        message: result.message
      });
    } catch (error: any) {
      logger.error('Failed to complete school registration', { error: error.message });
      res.status(400).json({
        success: false,
        data: null,
        message: error.message
      });
    }
  }

  /**
   * Handler for incoming payment gateway webhook events
   */
  public static async paymentWebhook(req: Request, res: Response) {
    try {
      // Razorpay webhooks often send the whole event object
      const event = req.body;
      const mode = (process.env.PAYMENT_MODE || 'mock').toLowerCase();
      const webhookSecret = process.env.PAYMENT_WEBHOOK_SECRET;

      let orderId = '';
      let paymentId = '';
      let signature = '';

      if (mode !== 'mock' && webhookSecret) {
        // Validate Webhook Signature
        const rzpSignature = req.headers['x-razorpay-signature'] as string;
        if (!rzpSignature) {
          return res.status(400).json({ success: false, message: 'Webhook signature missing' });
        }

        const provider = PaymentProviderFactory.getProvider();
        // Razorpay expects the raw body for signature verification
        // If express.json() is used, we might need the raw body. 
        // Assuming body is already parsed and we use JSON.stringify as a fallback if not raw.
        const payload = JSON.stringify(req.body);
        const isValid = provider.verifyWebhookSignature(payload, rzpSignature, webhookSecret);
        
        if (!isValid) {
          logger.warn('[PaymentWebhook] Invalid webhook signature detected');
          return res.status(400).json({ success: false, message: 'Signature mismatch' });
        }

        // Extract IDs from Razorpay event object
        if (event.event === 'payment.captured') {
          orderId = event.payload.payment.entity.order_id;
          paymentId = event.payload.payment.entity.id;
        } else if (event.event === 'order.paid') {
          orderId = event.payload.order.entity.id;
          // For order.paid, we might not have a specific payment_id in the same way, 
          // but handlePaymentWebhook expects it. Usually payment.captured is better for activation.
        }
      } else {
        // Mock or simple payload handling
        orderId = req.body.orderId || req.body.order_id;
        paymentId = req.body.paymentId || req.body.payment_id;
        signature = req.body.signature;
      }

      if (!orderId) {
        return res.status(200).json({ success: true, message: 'Event ignored (not a payment success event)' });
      }

      const result = await registrationService.handlePaymentWebhook(orderId, paymentId, signature || '');
      res.status(200).json({
        success: true,
        message: 'Webhook processed successfully',
        data: result
      });
    } catch (error: any) {
      logger.error('[PaymentWebhook] Failed to process webhook', { error: error.message });
      res.status(400).json({
        success: false,
        message: error.message || 'Webhook processing failed'
      });
    }
  }

  /**
   * Admin: Get all school registrations with pagination/audit capacity
   */
  public static async getAllRegistrations(req: Request, res: Response) {
    try {
      const result = await dbManager.query(
        'SELECT * FROM school_registrations ORDER BY created_at DESC'
      );
      res.status(200).json({
        success: true,
        data: result.rows,
        message: 'Registrations fetched successfully'
      });
    } catch (error: any) {
      logger.error('Failed to fetch registrations for admin', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'A database exception occurred. Failed to fetch registrations.'
      });
    }
  }

  /**
   * Admin: Get all registration audit logs
   */
  public static async getAuditLogs(req: Request, res: Response) {
    try {
      const result = await dbManager.query(
        'SELECT * FROM school_registration_audit_logs ORDER BY timestamp DESC'
      );
      res.status(200).json({
        success: true,
        data: result.rows,
        message: 'Audit logs fetched successfully'
      });
    } catch (error: any) {
      logger.error('Failed to fetch audit logs for admin', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'A database exception occurred. Failed to fetch audit logs.'
      });
    }
  }
}
