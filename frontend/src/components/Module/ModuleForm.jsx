// src/components/Module/ModuleForm.jsx
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { moduleFormSchema } from '@/schema/moduleSchema';

import ModuleRTE from './ModuleRTE';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';

export default function ModuleForm({
  initialData = null,
  onSubmit,
  isLoading = false
}) {
  const [editorInstance, setEditorInstance] = useState(null);

  const form = useForm({
    resolver: zodResolver(moduleFormSchema),
    defaultValues: initialData || {
      title: '',
      content: ''
    }
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    getValues
  } = form;

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData]);

  const handleFormSubmit = formData => {
    // if RHF content is empty but editor has content => sync first
    const currentContent = getValues('content');
    const editorHtml = editorInstance?.getHTML() || '';

    if (!currentContent && editorHtml) {
      // sinkronkan RHF value (ini tidak memicu validation pada handleSubmit karena sudah lulus)
      setValue('content', editorHtml, { shouldValidate: false });
      formData = { ...formData, content: editorHtml };
    }

    // Jika content tetap kosong, zod akan menangani dan menolak submit
    onSubmit({
      ...formData,
      content: formData.content || editorHtml
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Modul' : 'Buat Modul Baru'}</CardTitle>
        <CardDescription>
          {initialData
            ? 'Perbarui judul dan konten modul.'
            : 'Masukkan judul dan isi modul menggunakan editor di bawah ini.'}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Judul */}
          <div className="space-y-2">
            <Label>Judul Modul</Label>
            <Input
              placeholder="Contoh: Dasar Pemrograman"
              {...register('title')}
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          {/* Editor */}
          <div className="space-y-2">
            <Label>Konten Modul</Label>

            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <ModuleRTE
                  initialContent={field.value || ''}
                  onEditorReady={editor => setEditorInstance(editor)}
                  onContentBlur={html => {
                    // update RHF hanya saat editor blur (selesai editing)
                    field.onChange(html);
                  }}
                />
              )}
            />

            {errors.content && (
              <p className="text-red-500 text-sm">{errors.content.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading
              ? 'Menyimpan...'
              : initialData
              ? 'Simpan Perubahan'
              : 'Buat Modul'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
