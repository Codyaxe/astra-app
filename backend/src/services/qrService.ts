import { NotImplementedError } from '../lib/errors.js';

// TODO(AI/Backend): Implement digital ID QR signed token generation
export async function generateMemberQrToken(memberId: string): Promise<string> {
  void memberId;
  throw new NotImplementedError('generateMemberQrToken is not implemented');
}

// TODO(AI/Backend): Implement QR token cryptographic verification and expiration check
export async function verifyQrToken(token: string): Promise<any> {
  void token;
  throw new NotImplementedError('verifyQrToken is not implemented');
}
