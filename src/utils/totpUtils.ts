import { authenticator } from 'otplib';
import { supabase } from './supaBaseClient';

export const generateTOTP = async (email: string) => {
  const secret = authenticator.generateSecret();
  const serviceName = 'YourAppName';
  const issuer = 'YourCompany';
  
  const otpauth = authenticator.keyuri(email, issuer, secret);
  
  return {
    secret,
    qrCodeUrl: `https://chart.googleapis.com/chart?chs=200x200&chld=M|0&cht=qr&chl=${encodeURIComponent(otpauth)}`,
  };
};

export const verifyTOTP = (secret: string, token: string) => {
  return authenticator.check(token, secret);
};

export const disableTOTP = async (userId: string) => {
  const { error } = await supabase
    .from('user_totp')
    .delete()
    .eq('user_id', userId);

  return !error;
};