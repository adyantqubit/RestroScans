import { firebaseApp } from './firebase';
import firebaseConfig, { phoneCountryCode } from './config/firebaseConfig';

let verifier = null;
let confirmationResult = null;
let sending = null;

// export function toE164(contactNumber) {
//   const digits = String(contactNumber || '').replace(/\D/g, '');
//   if (digits.length < 10) return '';
//   return `+${phoneCountryCode}${digits.slice(-10)}`;
// }



export function toE164(contactNumber) {
  const raw = String(contactNumber || '').trim();
  const digits = raw.replace(/\D/g, '');

  if (raw.startsWith('+') && digits.length >= 10 && digits.length <= 15) {
    return `+${digits}`;
  }

  if (digits.length === 10) {
    return `+${phoneCountryCode}${digits}`;
  }

  if (digits.length === 12 && digits.startsWith('91')) {
    return `+${digits}`;
  }

  return '';
}


export function phoneAuthMessage(err) {
  const code = err && err.code;
  if (code === 'auth/invalid-phone-number') return 'Enter a valid 10-digit mobile number.';
  if (code === 'auth/too-many-requests') return 'Too many OTP requests. Try again later.';
  if (code === 'auth/invalid-verification-code') return 'OTP is wrong. Please try again.';
  if (code === 'auth/code-expired' || code === 'auth/missing-verification-code') return 'OTP expired. Request a new one.';
  if (code === 'auth/unauthorized-domain') return 'Add this website under Firebase Authentication authorized domains.';
  if (code === 'auth/operation-not-allowed') {
    const project = firebaseConfig.projectId || 'the Firebase project this site uses';
    if (/region/i.test(String(err.message || ''))) {
      return `Phone sign-in is on for ${project}, but India is blocked. Open Authentication, then Settings, then SMS region policy, and allow India (IN).`;
    }
    return `Phone sign-in is off for ${project}. Open that project, then Authentication, Sign-in method, and enable Phone. A different Firebase project does not count.`;
  }
  if (code === 'auth/billing-not-enabled' || code === 'auth/quota-exceeded') return 'Firebase could not send the SMS. Check the project billing and SMS quota.';
  if (code === 'auth/captcha-check-failed') return 'The security check failed. Please try again.';
  if (code === 'auth/not-configured') return 'Phone verification is not configured.';
  return 'Please retry. Something went wrong.';
}

function clearVerifier() {
  if (!verifier) return;
  try {
    verifier.clear();
  } catch (err) {
    // A failed send already invalidates the widget.
  }
  verifier = null;
}

export function sendPhoneCode(contactNumber) {
  if (sending) return sending;
  sending = deliverPhoneCode(contactNumber).finally(() => {
    sending = null;
  });
  return sending;
}

async function deliverPhoneCode(contactNumber) {
  const e164 = toE164(contactNumber);
  if (!e164) {
    const err = new Error('invalid phone');
    err.code = 'auth/invalid-phone-number';
    throw err;
  }
  const app = firebaseApp();
  if (!app) {
    const err = new Error('not configured');
    err.code = 'auth/not-configured';
    throw err;
  }
  const { getAuth, RecaptchaVerifier, signInWithPhoneNumber } = await import('firebase/auth');
  const auth = getAuth(app);
  clearVerifier();
  confirmationResult = null;
  verifier = new RecaptchaVerifier('sign-in-button', { size: 'invisible' }, auth);
  try {
    confirmationResult = await signInWithPhoneNumber(auth, e164, verifier);
  } catch (err) {
    clearVerifier();
    throw err;
  }
}

export async function confirmPhoneCode(code) {
  if (!confirmationResult) {
    const err = new Error('missing code');
    err.code = 'auth/code-expired';
    throw err;
  }
  const credential = await confirmationResult.confirm(String(code || '').trim());
  return credential.user.getIdToken();
}
