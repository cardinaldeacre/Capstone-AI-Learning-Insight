import { Link } from 'react-router';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function CourseCard({ course }) {
  const { id, title, moduleTitle, instructor, progress } = course;
  const isCompleted = progress === 100;

  return (
    <Link to={`/courses/${id}`} className="group block h-full">
      <Card
        className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300 ease-in-out 
                   bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
      >
        {/* card header */}
        <CardHeader className="grow pb-2">
          <CardDescription className="text-teal-500 font-semibold uppercase text-xs mb-1 dark:text-teal-400">
            {moduleTitle}
          </CardDescription>

          <CardTitle className="text-lg font-bold leading-snug group-hover:text-teal-600 transition-colors">
            {title}
          </CardTitle>
        </CardHeader>

        {/* card content */}
        <CardContent className="pt-0 pb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {instructor}
          </p>
        </CardContent>

        {/* progress */}
        <CardFooter className="pt-5">
          <div className="w-full">
            <p className="text-xs text-gray-500 mb-1">
              Progress{isCompleted ? ' (Completed)' : ''}: {progress}%
            </p>
            <Progress
              value={progress}
              className="h-2 bg-gray-200 dark:bg-gray-700 [&>div]:bg-teal-500"
            />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
