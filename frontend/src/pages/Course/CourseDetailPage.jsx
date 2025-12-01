import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// import { fetchCourseDetail } from '@/data/courseMocks';
import {
  fetchCourseStudentDetail,
  fetchCourseModules
} from '@/lib/api/services/courseService';
import CourseHeader from '@/components/Course/CourseHeader';
import CourseModuleList from '@/components/Course/CourseModuleList';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDetailCourse = async () => {
      try {
        setLoading(true);
        const [courseData, modulesData] = await Promise.all([
          fetchCourseStudentDetail(courseId),
          fetchCourseModules(courseId)
        ]);
        setCourse(courseData);
        setModules(modulesData);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      loadDetailCourse();
    }
  }, [courseId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-3/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-8 w-40" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error || `Kursus dengan ID ${courseId} tidak ditemukan.`}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-2">
      <CourseHeader course={course} />

      <section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CourseModuleList modules={modules} />
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-2">Info Tambahan</h3>
              <p className="text-sm text-gray-500">
                Selesaikan semua modul untuk mendapatkan sertifikat.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
