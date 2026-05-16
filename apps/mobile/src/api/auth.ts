import { z } from 'zod';
import { apiClient } from './client';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const registerSchema = z
  .object({
    fullName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    role: z.enum(['TENANT', 'LANDLORD']),
    houseCode: z.string().optional(),
    houseName: z.string().optional(),
    houseAddress: z.string().optional(),
  })
  .refine((value) => value.password === value.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });

export const authApi = {
  login: (payload: z.infer<typeof loginSchema>) => apiClient.post('/auth/login', payload),
  register: (payload: z.infer<typeof registerSchema>) => {
    const { confirmPassword, ...body } = payload;
    return apiClient.post('/auth/register', body);
  },
  me: () => apiClient.get('/auth/me'),
  logout: (refreshToken: string | null) => apiClient.post('/auth/logout', { refreshToken }),
};
