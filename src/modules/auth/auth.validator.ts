import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const otpRequestSchema = z.object({
  body: z.object({
    phone: z
      .string()
      .regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number'),
    purpose: z.enum(['login', 'reset_password', 'mfa']),
  }),
});

export const otpVerifySchema = z.object({
  body: z.object({
    phone: z.string().min(1),
    otp: z.string().length(6, 'OTP must be 6 digits'),
    purpose: z.enum(['login', 'reset_password', 'mfa']),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain an uppercase letter')
      .regex(/[0-9]/, 'Must contain a number')
      .regex(/[^A-Za-z0-9]/, 'Must contain a special character'),
  }),
});

export type LoginInput = z.infer<typeof loginSchema>['body'];
export type OtpRequestInput = z.infer<typeof otpRequestSchema>['body'];
export type OtpVerifyInput = z.infer<typeof otpVerifySchema>['body'];
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>['body'];
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>['body'];
