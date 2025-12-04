import React, { useState, useEffect } from 'react';
import { fetchCourseStudentList } from '@/lib/api/services/courseService';
import CourseCard from '@/components/Course/CourseCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import useAuth from '@/hooks/useAuth'; 
import TeacherClassesPage from './TeacherClassesPage';

export default function CourseListPage() {
  const { auth } = useAuth(); 
  const userRole = auth.user?.role;
  const isStudent = userRole === 'student' || !userRole;

  const [courses, setCourses] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadCourses = async () => {
      if (isStudent) {
        setIsLoading(true);
        setError(null);
        try {
          const data = await fetchCourseStudentList(); 
          setCourses(Array.isArray(data) ? data : data.data || []);
        } catch (err) {
          setError(err.message);
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadCourses();
  }, [isStudent]);

  if (!isStudent) {
    return <TeacherClassesPage />;
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Gagal memuat kursus: {error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-2">
      <header className="pb-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Courses
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Welcome back, continue your learning today
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses && courses.length > 0 ? (
          courses.map(course => <CourseCard key={course.id || course.class_id} course={course} />)
        ) : (
          <div className="col-span-full py-10 text-center">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-300">
              Kursus Tidak Ditemukan
            </h3>
            <p className="text-muted-foreground mt-2">
              Anda belum terdaftar di kelas manapun.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}