import crypto from 'crypto';

export interface PaymentOrder {
  id: string; // Razorpay Order ID
  amount: number; // in paise (Razorpay expects paise for INR)
  currency: string;
  status: string;
  receipt: string;
  keyId?: string; // Public API Key ID for Razorpay checkout.js
  paymentMode: 'mock' | 'live';
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

export class LivePaymentProvider implements PaymentProvider {
  private keyId: string | undefined;
  private keySecret: string | undefined;

  constructor() {
    this.keyId = process.env.PAYMENT_GATEWAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
    this.keySecret = process.env.PAYMENT_GATEWAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET;
  }

  public async createOrder(registrationId: string, amount: number, currency: string): Promise<PaymentOrder> {
    if (!this.keyId || !this.keySecret) {
      throw new Error("PAYMENT_GATEWAY_CONFIG_PENDING: Live Payment Gateway keys are not configured. Please define PAYMENT_GATEWAY_KEY_ID and PAYMENT_GATEWAY_KEY_SECRET in server environment variables.");
    }
    
    console.log(`[LivePaymentProvider] Creating authentic Razorpay order for amount: ${amount} ${currency}`);
    
    // Convert to lowest denomination (paise for INR)
    const amountInPaise = Math.round(amount * 100);
    const auth = Buffer.from(`${this.keyId}:${this.keySecret}`).toString('base64');

    try {
      const res = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: currency || 'INR',
          receipt: `receipt_reg_${registrationId}`,
          notes: {
            registrationId,
            system: 'galaxy_erp'
          }
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Razorpay API responded with status ${res.status}: ${errText}`);
      }

      const orderData = await res.json();
      return {
        id: orderData.id,
        amount: orderData.amount,
        currency: orderData.currency,
        status: orderData.status,
        receipt: orderData.receipt,
        keyId: this.keyId,
        paymentMode: 'live'
      };
    } catch (err: any) {
      console.error('[LivePaymentProvider] Failed to create order via Razorpay REST API:', err);
      throw new Error(`Failed to create Live Gateway Order: ${err.message}`);
    }
  }

  public async verifyPayment(
    orderId: string, 
    paymentId: string, 
    signature: string,
    expectedAmount: number
  ): Promise<PaymentVerificationResult> {
    if (!this.keyId || !this.keySecret) {
      return {
        success: false,
        orderId,
        paymentId,
        amountPaid: 0,
        message: 'Live environment credentials not configured for signature verification'
      };
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
        console.log(`[LivePaymentProvider] Signature verified successfully for Order: ${orderId}, Payment: ${paymentId}`);
        return {
          success: true,
          orderId,
          paymentId,
          signature,
          amountPaid: expectedAmount,
          message: 'Live payment signature verified successfully via HMAC-SHA256'
        };
      } else {
        console.warn(`[LivePaymentProvider] Signature verification failed. Expected: ${expectedSignature}, Received: ${signature}`);
        return {
          success: false,
          orderId,
          paymentId,
          amountPaid: 0,
          message: 'Signature verification mismatch'
        };
      }
    } catch (err: any) {
      return {
        success: false,
        orderId,
        paymentId,
        amountPaid: 0,
        message: `Signature verification exception: ${err.message}`
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
      console.error('[LivePaymentProvider] Error verifying webhook signature:', err);
      return false;
    }
  }
}

export class PaymentProviderFactory {
  public static getProvider(): PaymentProvider {
    const mode = (process.env.PAYMENT_MODE || 'mock').toLowerCase();
    if (mode === 'live') {
      return new LivePaymentProvider();
    }
    return new MockPaymentProvider();
  }
}
