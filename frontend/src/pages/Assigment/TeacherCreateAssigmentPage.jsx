import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
// import { assigmentSchema } from '@/lib/schema/assigmentSchema';
import { assigmentSchema } from '@/schema/assigmentSchema';
import { fetchPostAssigmentById } from '@/lib/api/services/assigmentService';
import { ArrowLeft, Save } from 'lucide-react';

export default function TeacherCreateAssignmentPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    class_id: Number(courseId),
    title: '',
    content: '',
    min_score: 0
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: name === 'min_score' ? Number(value) : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setErrors({});

    const result = assigmentSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach(err => {
        fieldErrors[err.path[0]] = err.message;
      });

      setErrors(fieldErrors);
      return;
    }

    try {
      setLoading(true);
      await fetchPostAssigmentById(formData);
      navigate(`/courses/${courseId}/assigments`);
    } catch (error) {
      console.error('gagal membuat assigment: ', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Card className="bg-white border-teal-600/20 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-teal-600">Buat Assignment Baru</CardTitle>

          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Kembali
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label className="font-medium text-teal-600">Judul</label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1"
                placeholder="Masukkan judul assignment"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Content */}
            <div>
              <label className="font-medium text-teal-600">Konten</label>
              <Textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                className="mt-1"
                placeholder="Masukkan deskripsi assignment"
              />
              {errors.content && (
                <p className="text-red-500 text-sm mt-1">{errors.content}</p>
              )}
            </div>

            {/* Min Score */}
            <div>
              <label className="font-medium text-teal-600">Minimum Score</label>
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

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="bg-teal-600 text-white hover:bg-teal-700 flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
