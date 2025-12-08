import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2, ChevronRight } from 'lucide-react';
import {
  fetchDeleteAssigmentById,
  fetchGetAllAssigments
} from '@/lib/api/services/assigmentService';
import { fetchCourseStudentDetail } from '@/lib/api/services/courseService';

export default function TeacherListAssigmentPage() {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [course, setCourse] = useState(null);

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

  useEffect(() => {
    fetchCourseStudentDetail(courseId).then(res => setCourse(res));
  }, [courseId]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Hapus assigment "${title}" ?`)) return;

    try {
      setLoading(true);
      await fetchDeleteAssigmentById(id);
      setAssignments(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error('gagal menghapus assigment: ', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Wrapper Card */}
      <Card className="bg-white border-teal-600/20 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-teal-600">
            Daftar Assignment - {course?.title}
          </CardTitle>

          <div className="flex items-center gap-2">
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
          {loading && <p className="text-gray-500">Memuat data assignment…</p>}

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

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    asChild
                    className="border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white"
                  >
                    <Link to={`/courses/${courseId}/assigments/${item.id}`}>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>

                  <Button
                    variant="destructive"
                    className="border-red-600 text-slate-300 hover:bg-red-600 hover:text-white"
                    onClick={() => handleDelete(item.id, item.title)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
