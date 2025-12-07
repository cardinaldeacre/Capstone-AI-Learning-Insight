import * as z from 'zod';

export const moduleFormSchema = z.object({
  title: z
    .string()
    .min(1, {
      message: 'Judul Modul wajib diisi.'
    })
    .max(255, {
      message: 'Judul tidak boleh melebihi 255 karakter.'
    }),
  content: z.string().min(1, {
    message: 'Konten Modul wajib diisi.'
  })
});
