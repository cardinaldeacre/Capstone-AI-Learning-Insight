import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';
import { assigmentSchema } from '@/schema/assigmentSchema';

export default function AssigmentForm({ initialData, onSubmit, loading }) {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  const handleChange = e => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: name === 'min_score' ? (value === '' ? 0 : Number(value)) : value
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log('SUBMITTED');
    setErrors({});

    const validation = assigmentSchema.safeParse(formData);
    console.log('Data yang divalidasi oleh Zod:', formData);
    if (!validation.success) {
      console.error('ZOD VALIDATION FAILED:', validation.error.issues);
      const fieldErrors = {};

      const zodErrors = validation.error?.issues ?? [];
      zodErrors.forEach(err => {
        if (err.path && err.path.length > 0) {
          fieldErrors[err.path[0]] = err.message;
        }
      });

      setErrors(fieldErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}
      <div>
        <label className="font-medium text-teal-600">Title</label>
        <Input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Masukkan judul assignment"
          className="mt-1"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title}</p>
        )}
      </div>

      {/* Content */}
      <div>
        <label className="font-medium text-teal-600">Content</label>
        <Textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Masukkan deskripsi assignment"
          className="mt-1"
        />
        {errors.content && (
          <p className="text-red-500 text-sm mt-1">{errors.content}</p>
        )}
      </div>

      {/* Min Score */}
      <div>
        <label className="font-medium text-teal-600">Min Score</label>
        <Input
          name="min_score"
          type="number"
          min="0"
          value={formData.min_score}
          onChange={handleChange}
          className="mt-1"
        />
        {errors.min_score && (
          <p className="text-red-500 text-sm mt-1">{errors.min_score}</p>
        )}
      </div>

      <Button
        disabled={loading}
        className="bg-teal-600 text-white hover:bg-teal-700 flex items-center"
      >
        <Save className="h-4 w-4 mr-2" />
        {loading ? 'Menyimpan...' : 'Simpan'}
      </Button>
    </form>
  );
}
