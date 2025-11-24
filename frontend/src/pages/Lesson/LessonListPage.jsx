import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchCourseDetail, fetchLessonDetail } from '@/data/courseMocks'; // Membutuhkan fetchCourseDetail untuk data sidebar
import LessonSidebar from '@/components/Lesson/LessonSidebar';
import LessonContent from '@/components/Lesson/LessonContent';
import { Skeleton } from '@/components/ui/skeleton';

export default function LessonListPage() {
  const { courseId, lessonId } = useParams();
  const [courseModules, setCourseModules] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const start = () => {
      setIsLoading(true);
      setError(null);
    };
    start();

    const lessonPromise = fetchLessonDetail(courseId, lessonId);
    const modulesPromise = fetchCourseDetail(courseId).then(
      data => data.modules
    );

    // fetch kedua endpooint
    Promise.all([lessonPromise, modulesPromise])
      .then(([lessonData, modulesData]) => {
        setCurrentLesson(lessonData);
        setCourseModules(modulesData);
      })
      .catch(err => {
        console.error('Error fetching lesson data:', err);
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [courseId, lessonId]);

  if (isLoading) {
    return (
      <div className="p-8">
        <Skeleton className="h-screen w-full" />
      </div>
    );
  }

  if (error || !currentLesson) {
    return <div className="p-8">Gagal memuat materi: {error}</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-80 shrink-0 border-r dark:border-gray-700 bg-white dark:bg-gray-900 overflow-y-auto">
        <LessonSidebar
          modules={courseModules}
          courseId={courseId}
          activeLessonId={lessonId}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        <LessonContent
          lesson={currentLesson}
          modules={courseModules}
          courseId={courseId}
        />
      </div>
    </div>
  );
}
