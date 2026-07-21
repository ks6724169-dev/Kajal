export class SubscriptionPricingEngine {
  public static readonly PRICES: Record<string, Record<number, number>> = {
    silver: {
      100: 499,
      200: 899,
      500: 1999,
      1000: 3499,
      2000: 5999,
      3000: 7999,
      4000: 9999,
      5000: 11999
    },
    gold: {
      100: 999,
      200: 1799,
      500: 3999,
      1000: 6999,
      2000: 11999,
      3000: 15999,
      4000: 19999,
      5000: 23999
    },
    platinum: {
      100: 1999,
      200: 3499,
      500: 7999,
      1000: 12999,
      2000: 19999,
      3000: 26999,
      4000: 32999,
      5000: 38999
    }
  };

  public static readonly SETUP_FEES: Record<number, number> = {
    100: 2000,
    200: 2500,
    500: 3500,
    1000: 5000,
    2000: 10000,
    3000: 13000,
    4000: 16000,
    5000: 20000
  };

  /**
   * Calculates subscription prices, setup fees, initial mandatory payments, and remaining balances.
   * @param planId 'silver' | 'gold' | 'platinum'
   * @param capacity student capacity tier
   * @param billingCycle 'monthly' | 'annual'
   */
  public static calculate(planId: string, capacity: number, billingCycle: string) {
    const normPlan = planId.toLowerCase();
    const planPrices = this.PRICES[normPlan];
    
    if (!planPrices) {
      throw new Error(`Invalid plan identifier: ${planId}`);
    }

    const monthlyRate = planPrices[capacity];
    if (monthlyRate === undefined) {
      throw new Error(`Invalid student capacity tier: ${capacity}`);
    }

    // Billing cycle calculation
    // Annual billing gives 2 months free, paying for 10 months instead of 12.
    const isAnnual = billingCycle.toLowerCase() === 'annual' || billingCycle.toLowerCase() === 'yearly';
    const baseAmount = isAnnual ? (monthlyRate * 10) : monthlyRate;

    const setupFee = this.SETUP_FEES[capacity] || 0;
    const totalAmount = baseAmount + setupFee;
    
    // Initial mandatory payment is exactly 25% of the total amount (subscription + setup fee)
    const requiredInitialPayment = Math.round(totalAmount * 0.25);
    const remainingAmount = totalAmount - requiredInitialPayment;

    return {
      planId: normPlan,
      studentCapacity: capacity,
      billingCycle: isAnnual ? 'annual' : 'monthly',
      monthlyRate,
      baseAmount,
      setupFee,
      totalAmount,
      requiredInitialPayment,
      remainingAmount,
      currency: 'INR'
    };
  }
}
