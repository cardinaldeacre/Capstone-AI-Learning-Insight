import { fetchClassProgress } from "@/lib/api/services/moduleProgressService";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { enrollClass } from "@/lib/api/services/classEnrolmentService";
import { useNavigate } from "react-router";
import { Loader2, BookOpen, CheckCircle } from "lucide-react";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { fetchModulesByClass } from "@/lib/api/services/moduleService";
import { ScrollArea } from "../ui/scroll-area";

const CardAction = ({ children }) => <div className="ml-auto">{children}</div>;

export default function GetCourseCard({ course }) {
  const navigate = useNavigate();
  const [progressStats, setProgressStats] = useState({
    percentage: 0,
    completed: 0,
    total: 0
  });
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingModules, setLoadingModules] = useState(false);
  const [modules, setModules] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { id, title, description, teacher_name } = course;
  const classId = course.id || course.class_id;

  useEffect(() => {
    let isMounted = true;

    const loadProgress = async () => {
      if (!classId) return;

      try {
        const progress = await fetchClassProgress(classId);
        if (isMounted && progress.stats) {
          setProgressStats(progress.stats);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProgress();


    return () => { isMounted = false; };
  }, [classId]);

  useEffect(() => {
    if (isOpen && classId && modules.length === 0) {
      const loadModules = async () => {
        setLoadingModules(true);
        try {
          const data = await fetchModulesByClass(classId);
          setModules(Array.isArray(data) ? data : data.data || [])
        } catch (error) {
          console.error("Gagal mengambil modul:", error);
        } finally {
          setLoadingModules(false);
        }
      }

      loadModules();
    }
  }, [isOpen, classId, modules.length]);

  const handleJoinClass = async () => {
    setIsEnrolling(true);
    try {
      await enrollClass(id);
      navigate(`/courses/${id}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsEnrolling(false);
    }
  }

  const isCompleted = progressStats.percentage === 100;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Card className="flex flex-col h-full hover:shadow-lg transition-all cursor-pointer bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 group">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold leading-snug group-hover:text-teal-600 transition-colors line-clamp-2">
              {title}
            </CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <span className="text-xs font-semibold uppercase text-gray-400">Mentor:</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{teacher_name}</span>
            </CardDescription>
          </CardHeader>

          <CardContent className="grow">
            <p className="text-sm text-gray-500 line-clamp-3">
              {description || "Tidak ada deskripsi."}
            </p>
          </CardContent>

          <CardFooter className="pt-2 border-t bg-gray-50/50 dark:bg-gray-800/50">
            <div className="w-full flex justify-between items-center text-xs text-gray-500">
              <span>Klik untuk detail</span>
              <BookOpen className="w-4 h-4 text-teal-500" />
            </div>
          </CardFooter>
        </Card>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-teal-700">{title}</DialogTitle>
          <DialogDescription className="text-md mt-2">
            Mentor: <span className="font-semibold text-foreground">{teacher_name}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {description}
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="text-sm font-medium leading-none mb-3">Materi yang akan dipelajari:</h4>

            {loadingModules ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-teal-500" />
              </div>
            ) : modules.length > 0 ? (
              <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                <ul className="space-y-3">
                  {modules.map((modul, index) => (
                    <li key={modul.id} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {index + 1}. {modul.title}
                      </span>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            ) : (
              <p className="text-sm text-muted-foreground italic">Belum ada modul di kelas ini.</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isEnrolling}>
            Batal
          </Button>
          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white"
            onClick={handleJoinClass}
            disabled={isEnrolling}
          >
            {isEnrolling ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Mendaftar...
              </>
            ) : (
              "Join Class Sekarang"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}