import { z } from 'zod';

export const serviceRequestSchema = z.object({
  service: z.string().min(1),
  contact: z
    .object({
      name: z.string().trim().min(1),
      email: z.string().trim().email(),
    })
    .passthrough(),
  consent: z.literal(true),
  details: z.record(z.string(), z.unknown()).default({}),
});
