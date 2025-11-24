import { Link } from 'react-router-dom';
import {
  PlayCircle,
  FileText,
  CheckCircle,
  ChevronRight,
  Zap
} from 'lucide-react';

const getIcon = (type, isCompleted) => {
  if (isCompleted) {
    return <CheckCircle className="h-4 w-4 text-teal-500" />;
  }
  switch (type) {
    case 'video':
      return <PlayCircle className="h-4 w-4 text-blue-500" />;
    case 'text':
      return <FileText className="h-4 w-4 text-gray-500" />;
    case 'quiz':
      return <Zap className="h-4 w-4 text-orange-500" />;
    default:
      return <FileText className="h-4 w-4 text-gray-500" />;
  }
};

export default function LessonSidebar({ modules, courseId, activeLessonId }) {
  return (
    <nav className="p-4 space-y-4">
      {modules.map(module => (
        <div key={module.id} className="space-y-1">
          <div className="text-sm font-semibold uppercase text-teal-600 dark:text-teal-400">
            {module.title}
          </div>

          {module.lessons.map(lesson => {
            const isActive = lesson.id === activeLessonId;
            const isCompleted = lesson.isCompleted;

            return (
              <Link
                key={lesson.id}
                to={`/courses/${courseId}/lesson/${lesson.id}`}
                className={`flex items-center justify-between p-2 rounded-lg 
                    transition-colors duration-200 
                    ${
                      isActive
                        ? 'bg-blue-500 text-white font-medium shadow-md'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
              >
                <div className="flex items-center gap-3">
                  <div className={isActive ? 'text-white' : ''}>
                    {getIcon(lesson.type, isCompleted && !isActive)}
                  </div>
                  <span className={`text-sm ${isActive ? 'text-white' : ''}`}>
                    {lesson.title}
                  </span>
                </div>
                <ChevronRight
                  className={`h-4 w-4 ${
                    isActive ? 'text-white' : 'text-muted-foreground'
                  }`}
                />
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
