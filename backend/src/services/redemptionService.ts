import { NotImplementedError } from '../lib/errors.js';

// TODO(AI/Backend): Redeem perk points and generate a voucher record
export async function redeemPerk(
  memberId: string,
  perkId: string
): Promise<any> {
  void memberId;
  void perkId;
  throw new NotImplementedError('redeemPerk is not implemented');
}

// TODO(AI/Backend): Fetch all vouchers issued to a specific member
export async function getMemberVouchers(memberId: string): Promise<any[]> {
  void memberId;
  throw new NotImplementedError('getMemberVouchers is not implemented');
}

// TODO(AI/Backend): Retrieve voucher details and validation status by ID
export async function getVoucherById(voucherId: string): Promise<any> {
  void voucherId;
  throw new NotImplementedError('getVoucherById is not implemented');
}
