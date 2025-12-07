import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, RefreshCw, ChevronRight } from 'lucide-react';
import { fetchGetAllAssigments } from '@/lib/api/services/assigmentService';

export default function TeacherListAssigmentPage() {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const loadAssigments = async () => {
      setLoading(true);
      try {
        const data = await fetchGetAllAssigments(courseId);
        setAssignments(data);
      } catch (error) {
        console.error('gagal fetch assigment: ', error);
      } finally {
        setLoading(false);
      }
    };

    loadAssigments();
  }, [courseId]);

  return (
    <div className="p-6">
      {/* Wrapper Card */}
      <Card className="bg-white border-teal-600/20 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-teal-600">Daftar Assignment</CardTitle>

          <div className="flex items-center gap-2">
            {/* <Button
              variant="outline"
              onClick={loadAssigments}
              disabled={loading}
              className="border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button> */}

            <Button
              variant="outline"
              asChild
              className="border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white"
            >
              <Link to={`/courses/${courseId}/assigments/create`}>
                <PlusCircle className="h-4 w-4 mr-1" />
                Tambah
              </Link>
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* Loading State */}
          {loading && <p className="text-gray-500">Memuat data assignment…</p>}

          {/* Empty State */}
          {!loading && assignments.length === 0 && (
            <p className="text-gray-600 italic">
              Belum ada assignment untuk kelas ini.
            </p>
          )}

          {/* List */}
          <div className="mt-4 space-y-3">
            {assignments.map(item => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border border-teal-600/20 rounded-xl hover:bg-teal-50 transition"
              >
                <div>
                  <h3 className="font-semibold text-teal-600">{item.title}</h3>
                  <p className="text-gray-500 text-sm">
                    Deadline: {item.deadline ?? '-'}
                  </p>
                </div>

                <Button
                  variant="outline"
                  asChild
                  className="border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white"
                >
                  <Link to={`/courses/${courseId}/assigments/${item.id}`}>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
