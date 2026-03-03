import { z } from 'zod';

export const brewMethods = ['espresso', 'pourover', 'clever', 'aeropress'] as const;

export const brewLogSchema = z.object({
  method: z.enum(brewMethods),
  grinder_setting: z.string().min(1, 'Grinder setting required'),
  dose_g: z.coerce.number().positive('Dose must be > 0'),
  yield_g: z.coerce.number().positive().optional(),
  water_temp_c: z.coerce.number().min(70).max(100),
  brew_time_s: z.coerce.number().int().positive(),
  rating: z.coerce.number().int().min(1).max(5),
  notes: z.string().max(1000).optional(),
});

export type BrewLogInput = z.infer<typeof brewLogSchema>;
