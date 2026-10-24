import { NotImplementedError } from '../lib/errors.js';

// TODO(AI/Backend): Implement Data Connect points calculation for member
export async function getMemberPoints(memberId: string): Promise<number> {
  void memberId;
  throw new NotImplementedError('getMemberPoints is not implemented');
}

// TODO(AI/Backend): Query PointsLedger entries for member
export async function getPointsHistory(memberId: string): Promise<any[]> {
  void memberId;
  throw new NotImplementedError('getPointsHistory is not implemented');
}

// TODO(AI/Backend): Validate officer permission and insert PointsLedger entry
export async function grantPoints(
  memberId: string,
  amount: number,
  reason: string,
  officerId: string
): Promise<any> {
  void memberId;
  void amount;
  void reason;
  void officerId;
  throw new NotImplementedError('grantPoints is not implemented');
}
