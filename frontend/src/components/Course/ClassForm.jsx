

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createClass, updateClass } from '@/lib/api/services/courseService';
import { Loader2 } from 'lucide-react';

export default function ClassForm({
  initialData, 
  onSuccess,
  onClose,
  isEdit = false
}) {
 
  const data = initialData || {};

  const [formData, setFormData] = useState({
    title: data.title || '',
    description: data.description || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEdit) {
        await updateClass(initialData.id, formData);
      } else {
        await createClass(formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="text-red-500 text-sm p-3 bg-red-50 border border-red-100 rounded">
          Error: {error}
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Judul Kelas</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Deskripsi</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          disabled={loading}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={loading}
        >
          Batal
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : isEdit ? (
            'Simpan Perubahan'
          ) : (
            'Buat Kelas'
          )}
        </Button>
      </div>
    </form>
  );
}