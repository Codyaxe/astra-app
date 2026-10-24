import { Request, Response } from 'express';

// TODO(AI/Backend): Return active partner perks available for redemption
export async function getPerksStub(_req: Request, res: Response): Promise<void> {
  res.status(501).json({ error: 'GET /perks not implemented', perks: [] });
}

// TODO(AI/Backend): Deduct points and issue voucher for specified perk
export async function redeemPerkStub(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  void id;
  res.status(501).json({ error: 'POST /perks/:id/redeem not implemented', voucher: null });
}

// TODO(AI/Backend): Return list of vouchers claimed by current member
export async function getVouchersMeStub(_req: Request, res: Response): Promise<void> {
  res.status(501).json({ error: 'GET /vouchers/me not implemented', vouchers: [] });
}

// TODO(AI/Backend): Return details, QR token, and status for single voucher
export async function getVoucherByIdStub(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  void id;
  res.status(501).json({ error: 'GET /vouchers/:id not implemented', voucher: null });
}
