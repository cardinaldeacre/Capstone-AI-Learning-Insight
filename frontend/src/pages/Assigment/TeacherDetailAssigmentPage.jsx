import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import AssigmentForm from '@/components/Assignment/AssigmentForm';
import {
  fetchGetAssigmentById,
  fetchPutAssigmentById
} from '@/lib/api/services/assigmentService';

export default function TeacherDetailAssigmentPage() {
  const { courseId, assigmentId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    const loadDetail = async () => {
      setLoading(true);
      try {
        const data = await fetchGetAssigmentById(assigmentId);
        setDetail(data);
      } catch (err) {
        console.error('gagal fetch ke assigment detail', err);
        throw err;
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [assigmentId]);

  const handleUpdate = async updatedData => {
    console.log('HANDLE UPDATE DIPANGGIL:', updatedData);
    try {
      setLoading(true);
      await fetchPutAssigmentById(assigmentId, updatedData);
      navigate(`/courses/${courseId}/assigments`);
    } catch (err) {
      console.error('gagal update data: ', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  if (loading && !detail) {
    return <p className="p-6">Loadin Detail...</p>;
  }

  return (
    <div className="p-6">
      <Card className="bg-white border-teal-600/20 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-teal-600">
            Detail & Edit Assignment
          </CardTitle>

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
          {detail && (
            <AssigmentForm
              initialData={{
                id: detail.id,
                class_id: detail.class_id,
                title: detail.title,
                content: detail.content,
                min_score: detail.min_score
              }}
              onSubmit={handleUpdate}
              loading={loading}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
