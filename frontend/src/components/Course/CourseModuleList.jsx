import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BookOpen, FileText, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function CourseModuleList({ modules }) {
  if (!modules || modules.length === 0) {
    return (
      <Card className="border-dashed border-2 shadow-none bg-gray-50">
        <CardContent className="flex flex-col items-center justify-center h-32 text-gray-400">
          <p>Belum ada materi tersedia.</p>
        </CardContent>
      </Card>
    );
  }

  // supaya urut
  const sortedModules = [...modules].sort(
    (a, b) => a.order_number - b.order_number
  );

  return (
    <Card className="border-none shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-800">
          Materi Pembelajaran
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Accordion type="single" collapsible className="w-full">
          {sortedModules.map((module, index) => (
            <AccordionItem
              key={module.id}
              value={`item-${module.id}`}
              className="px-4 hover:bg-gray-50/50 transition-colors border-b last:border-b-0"
            >
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-4 text-left w-full">
                  {/* Nomor Urur/ Icon */}
                  <div className="shrink-0 w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm">
                    {index + 1}
                  </div>

                  {/* Judul Modul */}
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-800">
                      {module.title}
                    </h3>
                  </div>

                  {/* Badge samping */}
                  <Badge
                    variant="outline"
                    className="hidden sm:flex border-teal-200 text-teal-700 font-normal ml-2"
                  >
                    <BookOpen className="w-3 h-3 mr-1" />
                    Bacaan
                  </Badge>
                </div>
              </AccordionTrigger>

              <AccordionContent className="pl-14 pr-4 pb-4 text-gray-600 leading-relaxed">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="flex items-start gap-2 mb-2">
                    <FileText className="w-4 h-4 text-gray-400 mt-1" />
                    <span className="font-semibold text-gray-700">
                      Deskripsi:
                    </span>
                  </div>
                  {module.content.slice(0, 150)}.....
                  {/* <div className="mt-4">
                    <button className="text-sm text-teal-600 font-medium hover:underline">
                      Lihat Materi Lengkap &rarr;
                    </button>
                  </div> */}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
