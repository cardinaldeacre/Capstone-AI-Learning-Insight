import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchCourseDetail } from '@/data/courseMocks';
import CourseHeader from '@/components/Course/CourseHeader';
import CourseModuleList from '@/components/Course/CourseModuleList';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsloading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // setIsloading(true);
    fetchCourseDetail(courseId)
      .then(data => {
        setCourse(data);
        // console.log('module data: ', data.modules);
        setIsloading(false);
      })
      .catch(err => {
        console.log(err);
        setError(err.message);
      })
      .finally(() => {
        setIsloading(false);
      });
  }, [courseId]);

  if (isLoading) {
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
        <h2 className="text-2xl font-bold tracking-tight mb-6">
          Materi Pembelajaran
        </h2>

        <CourseModuleList modules={course.modules} courseId={course.id} />
      </section>
    </div>
  );
}
