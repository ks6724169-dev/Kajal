import { z } from 'zod';

export const LoginSchema = z.object({
  identity: z.string().min(3),
  password: z.string().min(8),
  device_identifier: z.string().optional()
});

export const RegistrationSchema = z.object({
  identity_type: z.enum(['USERNAME', 'EMAIL', 'MOBILE', 'SCHOOL_ID', 'EMPLOYEE_ID', 'STUDENT_ID']),
  identity_value: z.string(),
  password: z.string().min(8)
});

export const PasswordChangeSchema = z.object({
  old_password: z.string(),
  new_password: z.string().min(8)
});

export const MFAVerifySchema = z.object({
  user_id: z.string().uuid(),
  code: z.string().length(6)
});

export const OTPSchema = z.object({
  identity: z.string(),
  otp: z.string()
});

export const SSOLoginSchema = z.object({
  provider: z.string(),
  token: z.string()
});

export const DeviceTrustSchema = z.object({
  device_identifier: z.string(),
  device_name: z.string().optional()
});
