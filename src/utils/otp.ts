import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { env } from '../config/env';

/** Generates a numeric OTP of configured length */
export const generateOtp = (): string => {
  const length = env.OTP_LENGTH;
  const max = Math.pow(10, length);
  const otp = crypto.randomInt(0, max);
  return otp.toString().padStart(length, '0');
};

/** Bcrypt-hash the OTP before storing — compare hash, never plaintext */
export const hashOtp = async (otp: string): Promise<string> => {
  return bcrypt.hash(otp, 10);
};

/** Verify raw OTP against stored hash */
export const verifyOtp = async (otp: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(otp, hash);
};

/** OTP expiry date from now */
export const otpExpiresAt = (): Date => {
  const d = new Date();
  d.setMinutes(d.getMinutes() + env.OTP_EXPIRES_IN_MINUTES);
  return d;
};
