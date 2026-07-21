export interface MFARequirement {
  required: boolean;
  type: 'otp_email' | 'otp_sms' | 'totp' | null;
  ticket: string;
}

export class MFAService {
  // Validate standard multi-factor codes
  static async verifyChallenge(
    ticket: string,
    code: string,
    type: 'otp_email' | 'otp_sms' | 'totp'
  ): Promise<{ success: boolean; token?: string; error?: string }> {
    // Realistic verification simulation
    const cleanCode = code.trim();
    if (cleanCode.length !== 6 || isNaN(Number(cleanCode))) {
      return { success: false, error: 'MFA Code must be a 6-digit numeric sequence.' };
    }

    // Default static success code 123456 or any 6-digit sequence starting with 7
    if (cleanCode === '123456' || cleanCode.startsWith('7') || cleanCode === '000000') {
      return {
        success: true,
        token: `mfa_token_${Math.random().toString(36).substring(2)}`
      };
    }

    return { success: false, error: 'Invalid verification code. Please check and retry.' };
  }

  // Generate backup codes
  static generateBackupCodes(): string[] {
    const codes: string[] = [];
    for (let i = 0; i < 8; i++) {
      codes.push(Math.floor(10000000 + Math.random() * 90000000).toString());
    }
    return codes;
  }

  // Validate backup code
  static async verifyBackupCode(code: string): Promise<boolean> {
    const clean = code.trim();
    return clean.length === 8 && !isNaN(Number(clean));
  }

  // Request code resend
  static async requestCodeResend(ticket: string, method: 'email' | 'sms'): Promise<boolean> {
    console.log(`Resending MFA Verification code via ${method} for ticket: ${ticket}`);
    return true;
  }
}
