import { Request, Response } from 'express';

// TODO(AI/Backend): Return active ASTRAscend service opportunities
export async function getOpportunitiesStub(
  _req: Request,
  res: Response
): Promise<void> {
  res.status(501).json({
    error: 'GET /astrascend/opportunities not implemented',
    opportunities: [],
  });
}
