import React from 'react';
import { Calendar, User, BookOpen, Clock, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function CourseHeader({ course }) {
  const formatDate = dateString => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <Card className="w-full mb-6 overflow-hidden border-none shadow-md bg-white">
      <div className="h-32 bg-linear-to-r from-teal-600 to-teal-800 relative">
        <div className="absolute -bottom-10 right-10 opacity-10">
          <BookOpen size={150} color="white" />
        </div>
      </div>

      <CardContent className="pt-6 relative">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="space-y-3 flex-1">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              {course.title}
            </h1>

            <p className="text-gray-600 leading-relaxed text-base">
              {course.description}
            </p>

            <Separator className="my-4" />

            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                <User className="w-4 h-4 text-teal-600" />
                <span className="font-medium text-gray-700">
                  {course.teacher_name}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>Diperbarui: {formatDate(course.updated_at)}</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 mt-2 md:mt-0 w-full md:w-auto">
            <Button
              size="lg"
              className="w-full md:w-auto bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-600/20 rounded-full font-semibold transition-all hover:scale-105"
              onClick={() => console.log('Mulai Course Clicked')}
            >
              <PlayCircle className="mr-2 h-5 w-5" />
              Mulai Belajar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
