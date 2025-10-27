import { z } from 'zod';

export const createAccountValidator = z.object({
  name: z.string().min(1, 'Name is required'),

  tap: z
    .string()
    .min(1, 'Tap is required')
    .transform((val) => parseFloat(val))
    .refine((num) => !isNaN(num), { message: 'Enter a valid number' })
    .refine((num) => num > 0, { message: 'Tap must be positive' }),
  cap: z
    .string()
    .min(1, 'Cap is required')
    .transform((val) => parseFloat(val))
    .refine((num) => !isNaN(num), { message: 'Enter a valid number' })
    .refine((num) => num > 0, { message: 'Cap must be positive' }),
});

export type createAccountValidatorType = z.infer<typeof createAccountValidator>;
