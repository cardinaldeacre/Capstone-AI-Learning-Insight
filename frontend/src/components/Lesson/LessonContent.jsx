import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LessonContent({ lesson, modules, courseId }) {
  const allLessons = modules.flatMap(module => module.lessons);
  const currentIndex = allLessons.findIndex(l => l.id == lesson.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const renderContent = () => {
    switch (lesson.type) {
      case 'video':
        return (
          <div className="bg-black aspect-video rounded-lg overflow-hidden flex items-center justify-center">
            <p className="text-white text-lg">
              VIDEO PLAYER: {lesson.contentPath}
            </p>
          </div>
        );
      case 'text':
        return (
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold mb-4">{lesson.title}</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Kecerdasan buatan (AI) adalah simulasi proses kecerdasan manusia
              oleh mesin, khususnya sistem komputer. Proses-proses ini mencakup
              pembelajaran (perolehan informasi dan aturan untuk menggunakan
              informasi), penalaran (menggunakan aturan untuk mencapai
              kesimpulan perkiraan atau pasti), dan koreksi-diri. Aplikasi
              khusus AI termasuk sistem pakar, pengenalan suara, dan visi mesin.
            </p>
            <div className="mt-6"></div>
            <p className="mt-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              AI dapat diklasifikasikan menjadi beberapa jenis, termasuk AI
              lemah (*narrow AI*), yang dirancang untuk tugas tertentu, dan AI
              kuat (*general AI*), yang memiliki kemampuan kognitif seperti
              manusia. Sebagian besar AI yang kita gunakan saat ini adalah AI
              lemah, seperti asisten suara dan algoritma rekomendasi.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center space-x-4 border-b pb-4 dark:border-gray-700">
        <span className="text-sm font-medium text-muted-foreground">
          Kemajuan MOdule
        </span>
        <Progress
          value={15}
          className="h-2 w-48 bg-gray-300 dark:bg-gray-700 [&>div]:bg-teal-500"
        />
        <span className="text-sm font-medium text-teal-600">15% Selesai</span>
      </div>

      {renderContent()}

      <div className="flex justify-between pt-6 border-t dark:border-gray-700">
        <Button asChild variant="outline" disabled={!prevLesson}>
          <Link
            to={
              prevLesson ? `/courses/${courseId}/lesson/${prevLesson.id}` : '#'
            }
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Sebelumnya
          </Link>
        </Button>

        <Button asChild className="bg-teal-600 hover:bg-teal-700 text-white">
          {nextLesson ? (
            <Link
              to={`/courses/${courseId}/lesson/${nextLesson.id}`}
              className="flex items-center"
            >
              Selanjutnya
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          ) : (
            // Jika tidak ada pelajaran selanjutnya, tampilkan tombol Selesai
            <Link to={`/courses/${courseId}`} className="flex items-center">
              <Check className="h-4 w-4 mr-2" />
              Selesai Modul
            </Link>
          )}
        </Button>
      </div>
    </div>
  );
}
