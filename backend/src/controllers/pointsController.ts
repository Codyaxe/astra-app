import { Request, Response } from 'express';

// TODO(AI/Backend): Return current member aggregated points balance
export async function getPointsMeStub(_req: Request, res: Response): Promise<void> {
  res.status(501).json({
    error: 'GET /points/me not implemented',
    points: 0,
  });
}

// TODO(AI/Backend): Return member points history ledger transactions
export async function getPointsHistoryStub(_req: Request, res: Response): Promise<void> {
  res.status(501).json({
    error: 'GET /points/me/history not implemented',
    history: [],
  });
}

// TODO(AI/Backend): Validate officer permissions and insert points grant ledger entry
export async function grantPointsStub(req: Request, res: Response): Promise<void> {
  void req.body;
  res.status(501).json({
    error: 'POST /points/grant not implemented',
    success: false,
  });
}
