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
    const currentContent = getValues('content');
    const editorHtml = editorInstance?.getHTML() || '';

    if (!currentContent && editorHtml) {
      setValue('content', editorHtml, { shouldValidate: false });
      formData = { ...formData, content: editorHtml };
    }

    onSubmit({
      ...formData,
      content: formData.content || editorHtml
    });
  };

  return (
    <Card className="w-full mx-auto">
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
                    field.onChange(html);
                  }}
                />
              )}
            />

            {errors.content && (
              <p className="text-red-500 text-sm">{errors.content.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700"
            disabled={isLoading}
          >
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
