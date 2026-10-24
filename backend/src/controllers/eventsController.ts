import { Request, Response } from 'express';

// TODO(AI/Backend): Return list of upcoming and past events from Data Connect
export async function getEventsStub(_req: Request, res: Response): Promise<void> {
  res.status(501).json({
    error: 'GET /events not implemented',
    events: [],
  });
}

// TODO(AI/Backend): Record member attendance check-in and award event points
export async function checkInEventStub(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  void id;
  res.status(501).json({
    error: 'POST /events/:id/checkin not implemented',
    checkedIn: false,
  });
}
