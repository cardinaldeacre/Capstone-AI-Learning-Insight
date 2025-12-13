import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  fetchCourseStudentDetail,
  fetchCourseModules,
  fetchGetModuleProgress
} from '@/lib/api/services/courseService';
import CourseHeader from '@/components/Course/CourseHeader';
import CourseModuleList from '@/components/Course/CourseModuleList';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Trophy, PartyPopper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateCertificate } from '@/utils/certificate';
import useAuth from '@/hooks/useAuth';
import { getBase64FromUrl } from '@/utils/base64';
import logoWhite from '../../assets/logo-white.png';

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState(null);
  const [progressStats, setProgressStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { auth } = useAuth();
  const username = auth.user?.name;


  useEffect(() => {
    const loadDetailCourse = async () => {
      try {
        setLoading(true);
        const [courseData, modulesData, progressData] = await Promise.all([
          fetchCourseStudentDetail(courseId),
          fetchCourseModules(courseId),
          fetchGetModuleProgress(courseId)
        ]);
        setCourse(courseData);
        setModules(modulesData);
        setProgressStats(progressData.stats);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      loadDetailCourse();
    }
  }, [courseId]);
  if (loading) {
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

  const isCompleted = progressStats?.percentage === 100;

  return (
    <div className="space-y-6 pb-20">
      <CourseHeader course={course} />

      <section className="px-4 md:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <CourseModuleList modules={modules} />
          </div>

          {/* content tambahan */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Card Status Belajar */}
              <div
                className={`rounded-xl shadow-sm border p-6 transition-all duration-300 ${isCompleted
                  ? 'bg-teal-50 border-teal-100'
                  : 'bg-white border-gray-100'
                  }`}
              >
                <h3
                  className={`font-bold mb-4 flex items-center gap-2 ${isCompleted ? 'text-teal-800' : 'text-gray-800'
                    }`}
                >
                  {isCompleted ? (
                    <Trophy className="text-yellow-500" size={20} />
                  ) : null}
                  Learning Progress
                </h3>

                {/* Progress Bar Visual */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1 font-medium">
                    <span
                      className={
                        isCompleted ? 'text-teal-700' : 'text-gray-500'
                      }
                    >
                      Progress
                    </span>
                    <span className="text-teal-600 font-bold">
                      {progressStats?.percentage || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-2.5 rounded-full transition-all duration-1000 bg-teal-600"
                      style={{ width: `${progressStats?.percentage || 0}%` }}
                    ></div>
                  </div>
                </div>

                {isCompleted ? (
                  <div className="text-center animate-in zoom-in duration-300">
                    <div className="bg-white/80 p-3 rounded-lg border border-teal-100 mb-3 shadow-sm">
                      <PartyPopper className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                      <p className="text-sm font-bold text-teal-800">
                        Congratulations! You Passed.
                      </p>
                      <p className="text-xs text-teal-600 mt-1">
                        You've completed all the materials in this course.
                      </p>
                    </div>

                    <Button
                      onClick={async () => {
                        const courseName = course?.title;
                        const completedDate = new Date().toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric"
                        });
                        const certId = self.crypto.randomUUID().slice(0, 12).toUpperCase();
                        const validUntil = "31 Desember 2028";

                        const summary = {
                          description: course?.description || "Tidak ada deskripsi.",
                          modules: modules?.map(m => ({
                            title: m.title,
                            duration: m.duration || "-"
                          }))
                        };

                        let logoBase64 = null;
                        try {
                          logoBase64 = await getBase64FromUrl(logoWhite);
                        } catch (e) {
                          console.error("Gagal load logo", e);
                        }

                        generateCertificate({
                          name: username,
                          courseName,
                          completedAt: completedDate,
                          validUntil,
                          certId,
                          summary,
                          logo: logoBase64
                        });
                      }}
                    >
                      Download Certificate
                    </Button>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Finish{' '}
                      <b>
                        {progressStats?.total - progressStats?.completed} more modules
                      </b>{' '}
                      to complete this class and receive your certificate.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
