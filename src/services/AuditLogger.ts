import { supabase } from './supabase';

export type SecurityAuditEventType =
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILURE'
  | 'LOGOUT'
  | 'PASSWORD_RESET_REQUESTED'
  | 'PASSWORD_CHANGED'
  | 'ACCOUNT_BLOCKED'
  | 'ACCOUNT_REACTIVATED'
  | 'SESSION_REVOKED'
  | 'MFA_REQUIRED'
  | 'MFA_ENROLLMENT_STARTED'
  | 'MFA_ENROLLMENT_FAILED'
  | 'MFA_CHALLENGE_STARTED'
  | 'MFA_VERIFICATION_SUCCESS'
  | 'MFA_VERIFICATION_FAILED'
  | 'MFA_FACTOR_REMOVED'
  | 'MOBILE_LOGIN_STARTED'
  | 'MOBILE_LOOKUP_SUCCESS'
  | 'MOBILE_LOOKUP_FAILED'
  | 'MULTIPLE_INSTITUTIONS_FOUND'
  | 'INSTITUTION_SELECTED_FOR_LOGIN'
  | 'OTP_SMS_REQUESTED'
  | 'OTP_WHATSAPP_REQUESTED'
  | 'OTP_SENT'
  | 'OTP_VERIFICATION_SUCCESS'
  | 'OTP_VERIFICATION_FAILED'
  | 'OTP_EXPIRED'
  | 'TENANT_RESOLUTION_SUCCESS'
  | 'TENANT_RESOLUTION_FAILED'
  | 'ROLE_RESOLUTION_SUCCESS'
  | 'ROLE_RESOLUTION_FAILED'
  | 'MOBILE_LOGIN_SUCCESS'
  | 'MOBILE_LOGIN_FAILED'
  | 'UNAUTHORIZED_TENANT_ACCESS_ATTEMPT'
  | 'OTP_REQUEST_FAILED';

export interface AuditLogEntry {
  eventType: SecurityAuditEventType;
  userId?: string;
  email?: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

export class AuditLogger {
  /**
   * General log method wrapper for MFA and security events
   */
  public static log(data: { event_type: SecurityAuditEventType; details?: any; userId?: string; email?: string }): void {
    this.logEvent(data.event_type, {
      userId: data.userId,
      email: data.email,
      details: typeof data.details === 'string' ? data.details : JSON.stringify(data.details || {})
    });
  }

  /**
   * Log a security event safely without exposing passwords, tokens, or secrets.
   */
  public static async logEvent(
    eventType: SecurityAuditEventType,
    metadata?: { userId?: string; email?: string; details?: string }
  ): Promise<void> {
    const entry: AuditLogEntry = {
      eventType,
      userId: metadata?.userId,
      email: metadata?.email,
      details: metadata?.details,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
      timestamp: new Date().toISOString()
    };

    // Safe dev log
    console.log(`[SECURITY AUDIT] [${entry.eventType}]`, {
      userId: entry.userId,
      email: entry.email,
      details: entry.details,
      timestamp: entry.timestamp
    });

    // Try saving to database table 'security_audit_logs' if present
    try {
      await supabase.from('security_audit_logs').insert([{
        event_type: entry.eventType,
        user_id: entry.userId,
        email: entry.email,
        details: entry.details,
        user_agent: entry.userAgent,
        created_at: entry.timestamp
      }]);
    } catch (e) {
      // Table might not exist yet, catch silently without breaking user experience
    }
  }
}
