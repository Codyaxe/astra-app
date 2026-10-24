import { NotImplementedError } from '../lib/errors.js';

// TODO(AI/Backend): Implement Google Sheets API lookup for member registration
export async function fetchMemberFromSheet(studentId: string): Promise<any> {
  void studentId;
  throw new NotImplementedError('fetchMemberFromSheet is not implemented');
}

// TODO(AI/Backend): Implement Google Sheets API lookup for membership payment dues
export async function fetchPaidStatus(studentId: string): Promise<boolean> {
  void studentId;
  throw new NotImplementedError('fetchPaidStatus is not implemented');
}
