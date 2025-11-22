import { Star, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function CourseHeader({ course }) {
  const firstLesson = course.Header?.[0]?.lesson?.[0];

  return (
    <header className="space-y-6">
      <div className="max-w-4xl space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          {course.title}
        </h1>
        <p className="text-lg text-muted-foreground">
          oleh {course.instructor}
        </p>
        {firstLesson && (
          <Button
            asChild
            size="lg"
            className="bg-teal-600 hover:bg-teal-700 text-white shadow-lg whitespace-nowrap"
          >
            <Link to={`/courses/${course.id}/lessson/${firstLesson.id}`}>
              <Play className="mr-2 h-5 w-5" />
              Mulai Belajar Sekarang
            </Link>
          </Button>
        )}
      </div>

      <div className="flex items-center space-x-3 text-lg">
        <div className="flex text-yellow-500">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${
                i < Math.floor(course.rating)
                  ? 'fill-yellow-500'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="font-semibold">
          {course.rating ? course.rating.toLocaleString() : 0}
        </span>
        <span className="text-muted-foreground">
          ({course.reviewCount ? course.reviewCount.toLocaleString() : 0})
        </span>
      </div>
    </header>
  );
}
