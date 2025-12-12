import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import AssigmentForm from '@/components/Assignment/AssigmentForm';
import { fetchPostAssigmentById } from '@/lib/api/services/assigmentService';
import { useState } from 'react';

export default function TeacherCreateAssignmentPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreate = async payload => {
    try {
      setLoading(true);
      await fetchPostAssigmentById(payload);
      navigate(`/courses/${courseId}/assigments`);
    } catch (error) {
      console.error('gagal membuat assigment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Card className="bg-white border-teal-600/20 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-teal-600">Create New Assignment</CardTitle>

          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Return
          </Button>
        </CardHeader>

        <CardContent>
          <AssigmentForm
            initialData={{
              class_id: Number(courseId),
              title: '',
              content: '',
              min_score: 0
            }}
            onSubmit={handleCreate}
            loading={loading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
