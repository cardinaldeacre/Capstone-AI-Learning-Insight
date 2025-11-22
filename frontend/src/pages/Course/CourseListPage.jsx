import React, { useState, useEffect } from 'react';
import { fetchCourseList } from '@/data/courseMocks';
import CourseCard from '@/components/Course/CourseCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

export default function CourseListPage() {
  const [courses, setCourses] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchCourseList()
      .then(data => {
        setCourses(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setError(err.message);
        setIsLoading(true);
      });
  }, []);

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
        {courses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
