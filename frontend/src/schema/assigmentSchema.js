import { z } from 'zod';

export const assigmentSchema = z.object({
  class_id: z.number().min(1, 'Class ID wajib diisi'),
  title: z.string().min(3, 'Judul minimal 3 karakter'),
  content: z.string().min(5, 'Konten minimal 5 karakter'),
  min_score: z.number().min(0, 'Minimum score tidak boleh negatif')
});
