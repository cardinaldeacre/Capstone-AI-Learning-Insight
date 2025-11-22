import { Link } from 'react-router-dom';
import { CheckCircle, Circle, ChevronDown } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';

export default function CourseModuleList({ modules, courseId }) {
  return (
    <Accordion type="single" collapsible className="w-full space-y-4">
      {/* {console.log('hai', modules)} */}
      {modules.map(module => (
        <AccordionItem
          key={module.id}
          value={`module-${module.id}`}
          className="rounded-lg border bg-white shadow-sm dark:bg-gray-800"
        >
          <AccordionTrigger
            className="flex justify-between items-center p-4 text-left 
                       hover:no-underline font-semibold text-gray-900 dark:text-white"
          >
            <div className="flex flex-col items-start">
              <span className="text-base">{module.title}</span>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <span className="mr-2">Progress: {module.moduleProgress}%</span>
                <Progress
                  value={module.moduleProgress}
                  className="h-2 w-32 bg-gray-300 dark:bg-gray-700 [&>div]:bg-teal-500"
                />
              </div>
            </div>
            <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-200" />
          </AccordionTrigger>

          {/*  konten module */}
          <AccordionContent className="p-0 border-t dark:border-gray-700">
            {module.lessons.map(lesson => (
              <div
                key={lesson.id}
                className="flex items-center justify-between p-4 pl-8 border-b last:border-b-0 
                           hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <Link
                  to={`/courses/${courseId}/lesson/${lesson.id}`}
                  className="flex items-center grow text-gray-700 dark:text-gray-200"
                >
                  {lesson.isCompleted ? (
                    <CheckCircle className="h-5 w-5 mr-3 text-teal-500 fill-teal-500/10" />
                  ) : (
                    <CheckCircle className="h-5 w-5 mr-3 text-muted-foreground" />
                  )}
                  <span
                    className={
                      lesson.isCompleted
                        ? 'line-through text-muted-foreground'
                        : ''
                    }
                  >
                    {lesson.title}
                  </span>
                </Link>

                <span className="text-sm text-muted-foreground">
                  {lesson.duration}
                </span>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
