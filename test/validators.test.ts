import { describe, expect, it } from 'vitest';
import { authSchema } from '@/lib/validators/auth';
import { brewLogSchema } from '@/lib/validators/brewLog';

describe('authSchema', () => {
  it('rejects bad email', () => {
    const parsed = authSchema.safeParse({ email: 'bad', password: '123456' });
    expect(parsed.success).toBe(false);
  });
});

describe('brewLogSchema', () => {
  it('accepts valid brew log', () => {
    const parsed = brewLogSchema.safeParse({
      method: 'espresso',
      grinder_setting: '2.1',
      dose_g: 18,
      yield_g: 36,
      water_temp_c: 94,
      brew_time_s: 30,
      rating: 4,
      notes: 'Sweet and balanced',
    });
    expect(parsed.success).toBe(true);
  });
});
