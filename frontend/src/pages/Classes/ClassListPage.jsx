import React, { useState, useEffect } from 'react';
import { fetchCourseList } from '@/lib/api/services/courseService';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import GetCourseCard from '@/components/Course/getCourseCard';

export default function ClassListPage() {
  const [courses, setCourses] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadCourses = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchCourseList();
        if (data && data.data) {
          setCourses(data.data);
        } else if (Array.isArray(data)) {
          setCourses(data);
        } else {
          setCourses([]);
        }
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourses();
  }, []);

  console.log('Rendering Check: courses type:', typeof courses);
  console.log('Rendering Check: courses length:', courses?.length);
  console.log('Rendering Check: Actual courses data:', courses);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to fetch data: {error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-2">
      <header className="pb-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Get Courses
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          More knowledge to discover!
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses && courses.length > 0 ? (
          courses.map(course => <GetCourseCard key={course.id} course={course} />)
        ) : (
          <div className="col-span-full py-10 text-center">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-300">
              Clas
            </h3>
            <p className="text-muted-foreground mt-2">
              Tidak ada kursus yang tersedia untuk Anda saat ini. Silakan cek
              kembali nanti.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
