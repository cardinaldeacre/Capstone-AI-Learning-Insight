import * as z from 'zod';

export const moduleFormSchema = z.object({
  // Judul Modul harus berupa string dan tidak boleh kosong
  title: z
    .string()
    .min(1, {
      message: 'Judul Modul wajib diisi.'
    })
    .max(255, {
      message: 'Judul tidak boleh melebihi 255 karakter.'
    }),

  // Konten Modul (HTML dari RTE) harus berupa string dan tidak boleh kosong
  // Meskipun konten bisa sangat panjang, kita tidak membatasi maksimum secara ketat.
  content: z.string().min(1, {
    message: 'Konten Modul wajib diisi.'
  })

  // (Opsional) Tambahkan field lain jika diperlukan, contohnya:
  // courseId: z.string().uuid(),
  // order: z.number().int().positive().optional(),
});
