import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2, Edit, Upload, ArrowLeft } from 'lucide-react';
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
    if (!window.confirm(`delete assignment "${title}" ?`)) return;

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
            Asignment list - {course?.title}
          </CardTitle>

          <div className="flex items-center gap-2">
            {/* Tombol kembali ke daftar modul guru */}
            <Button
              variant="outline"
              asChild
              className="text-gray-600 hover:text-gray-900"
            >
              <Link to={`/courses/${courseId}/modules/teacher`}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Link>
            </Button>
            {/* Tombol Tambah Assignment dengan rounded-xl */}
            <Button
              variant="default"
              asChild
              className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl"
            >
              <Link to={`/courses/${courseId}/assigments/create`}>
                <PlusCircle className="h-4 w-4 mr-1" />
                Add Assignment
              </Link>
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {loading && <p className="text-gray-500">Loading data assignment…</p>}

          {!loading && assignments.length === 0 && (
            <p className="text-gray-600 italic">
              No assignments found. Please add an assignment.
            </p>
          )}

          {/* List */}
          <div className="mt-4 space-y-3">
            {assignments.map(item => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition" // Border lebih netral
              >
                <div>
                  <h3 className="font-semibold text-gray-800">{item.title}</h3>
                  <p className="text-gray-500 text-sm">
                    Min Score: {item.min_score ?? '-'}
                  </p>
                </div>

                <div className="flex items-center gap-1">

                  <Button
                    variant="ghost"
                    asChild
                    className="text-teal-600 hover:bg-teal-100/50"
                    title="Lihat Submission"
                  >
                    <Link
                      to={`/courses/${courseId}/assigments/${item.id}/submission/list`}
                    >
                      <Upload className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    asChild
                    className="text-teal-600 hover:bg-teal-100/50"
                    title="Edit Assignment"
                  >
                    <Link to={`/courses/${courseId}/assigments/${item.id}`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>

                  <Button
                    variant="ghost"
                    className="text-red-500 hover:bg-red-50"
                    onClick={() => handleDelete(item.id, item.title)}
                    title='Hapus Assignment'
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