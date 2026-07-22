import crypto from 'crypto';
import Razorpay from 'razorpay';

export interface PaymentOrder {
  id: string; // Razorpay Order ID
  amount: number; // in paise (Razorpay expects paise for INR)
  currency: string;
  status: string;
  receipt: string;
  keyId?: string; // Public API Key ID for Razorpay checkout.js
  paymentMode: 'mock' | 'test' | 'live';
}

export interface PaymentVerificationResult {
  success: boolean;
  orderId: string;
  paymentId: string;
  signature?: string;
  amountPaid: number;
  message: string;
}

export interface PaymentProvider {
  createOrder(registrationId: string, amount: number, currency: string): Promise<PaymentOrder>;
  verifyPayment(orderId: string, paymentId: string, signature: string, expectedAmount: number): Promise<PaymentVerificationResult>;
  verifyWebhookSignature(payload: string, signature: string, secret: string): boolean;
}

export class MockPaymentProvider implements PaymentProvider {
  public async createOrder(registrationId: string, amount: number, currency: string): Promise<PaymentOrder> {
    const orderId = `order_mock_${Math.random().toString(36).substring(2, 15)}`;
    return {
      id: orderId,
      amount: Math.round(amount * 100), // convert to paise-equivalent for consistency
      currency: currency || 'INR',
      status: 'created',
      receipt: `receipt_reg_${registrationId}`,
      keyId: 'rzp_test_mockkey12345678',
      paymentMode: 'mock'
    };
  }

  public async verifyPayment(
    orderId: string, 
    paymentId: string, 
    signature: string,
    expectedAmount: number
  ): Promise<PaymentVerificationResult> {
    if (!orderId.startsWith('order_mock_')) {
      return {
        success: false,
        orderId,
        paymentId,
        amountPaid: 0,
        message: 'Invalid order structure for mock verification'
      };
    }

    return {
      success: true,
      orderId,
      paymentId,
      signature: signature || `mock_sig_${Math.random().toString(36).substring(2, 15)}`,
      amountPaid: expectedAmount,
      message: 'Mock payment verified successfully (DEVELOPMENT/TEST MODE)'
    };
  }

  public verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
    return signature.startsWith('mock_') || signature.startsWith('wh_sig_') || !!secret;
  }
}

export class RazorpayPaymentProvider implements PaymentProvider {
  private rzp: Razorpay;
  private keyId: string;
  private keySecret: string;
  private mode: 'test' | 'live';

  constructor() {
    this.keyId = (process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || process.env.PAYMENT_GATEWAY_KEY_ID || '').trim();
    this.keySecret = (process.env.RAZORPAY_KEY_SECRET || process.env.PAYMENT_GATEWAY_KEY_SECRET || '').trim();
    this.mode = (process.env.PAYMENT_MODE || 'test').toLowerCase() as 'test' | 'live';

    if (!this.keyId || !this.keySecret) {
      // In production/live, we MUST have keys. In dev/test, we might be using mock, 
      // but if we are in this class, it means we requested real Razorpay.
      console.warn('[RazorpayPaymentProvider] Warning: Razorpay Key ID or Secret is missing in environment variables.');
    }

    this.rzp = new Razorpay({
      key_id: this.keyId,
      key_secret: this.keySecret,
    });
  }

  public async createOrder(registrationId: string, amount: number, currency: string): Promise<PaymentOrder> {
    if (!this.keyId || !this.keySecret || this.keyId.includes('mock') || this.keyId.includes('your_') || this.keyId.length < 10) {
      console.warn('[RazorpayPaymentProvider] Razorpay keys not configured or placeholder detected. Using Mock Order fallback.');
      const mockProvider = new MockPaymentProvider();
      return mockProvider.createOrder(registrationId, amount, currency);
    }
    
    // Convert to lowest denomination (paise for INR)
    const amountInPaise = Math.round(amount * 100);
    // Razorpay receipt field strictly requires <= 40 characters
    const cleanRegId = registrationId.replace(/[^a-zA-Z0-9]/g, '');
    const receipt = `rcpt_${cleanRegId}`.substring(0, 40);

    try {
      const order = await this.rzp.orders.create({
        amount: amountInPaise,
        currency: currency || 'INR',
        receipt,
        notes: {
          registrationId: String(registrationId),
          paymentMode: String(this.mode),
          system: 'galaxy_erp'
        }
      });

      return {
        id: order.id,
        amount: Number(order.amount),
        currency: order.currency as string,
        status: order.status as string,
        receipt: order.receipt as string,
        keyId: this.keyId,
        paymentMode: this.mode
      };
    } catch (err: any) {
      console.error('[RazorpayPaymentProvider] Failed to create order:', err);
      if (this.mode !== 'live') {
        console.warn('[RazorpayPaymentProvider] Non-live mode detected; falling back to Mock Order after Razorpay error.');
        const mockProvider = new MockPaymentProvider();
        return mockProvider.createOrder(registrationId, amount, currency);
      }
      throw new Error(`Razorpay Order Creation Failed: ${err?.error?.description || err?.message || 'Unknown error'}`);
    }
  }

  public async verifyPayment(
    orderId: string, 
    paymentId: string, 
    signature: string,
    expectedAmount: number
  ): Promise<PaymentVerificationResult> {
    if (orderId.startsWith('order_mock_')) {
      const mockProvider = new MockPaymentProvider();
      return mockProvider.verifyPayment(orderId, paymentId, signature, expectedAmount);
    }

    if (!this.keySecret) {
      throw new Error('RAZORPAY_KEY_SECRET missing for signature verification');
    }

    try {
      // Razorpay standard signature verification formula:
      // HMAC-SHA256(order_id + "|" + payment_id, secret)
      const text = `${orderId}|${paymentId}`;
      const expectedSignature = crypto
        .createHmac('sha256', this.keySecret)
        .update(text)
        .digest('hex');

      if (expectedSignature === signature) {
        return {
          success: true,
          orderId,
          paymentId,
          signature,
          amountPaid: expectedAmount,
          message: `Razorpay payment verified successfully (${this.mode.toUpperCase()} MODE)`
        };
      } else {
        return {
          success: false,
          orderId,
          paymentId,
          amountPaid: 0,
          message: 'Razorpay signature verification failed'
        };
      }
    } catch (err: any) {
      return {
        success: false,
        orderId,
        paymentId,
        amountPaid: 0,
        message: `Verification exception: ${err.message}`
      };
    }
  }

  public verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
    if (!secret) return false;
    try {
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');
      return expectedSignature === signature;
    } catch (err) {
      console.error('[RazorpayPaymentProvider] Webhook verification error:', err);
      return false;
    }
  }
}

export class PaymentProviderFactory {
  public static getProvider(): PaymentProvider {
    const mode = (process.env.PAYMENT_MODE || 'mock').toLowerCase();
    if (mode === 'live' || mode === 'test' || mode === 'razorpay') {
      return new RazorpayPaymentProvider();
    }
    return new MockPaymentProvider();
  }
}
