import React, { useEffect, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  CheckCircle,
  Loader2
} from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import { fetchQuizByModule } from '@/lib/api/services/quizService';
import TeacherActionPanel from './TeacherActionPanel';
import StudentQuizPanel from '../Quiz/StudentQuizPanel';
import StudentSubmissionPanel from '../Assignment/StudentSubmissionPanel';

const ModuleContent = ({
  module,
  currentIndex,
  totalModules,
  onNext,
  onPrev,
  onComplete,
  courseId
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizzes, setQuizzes] = useState([]);

  const { auth } = useAuth();
  const userRole = auth.user?.role;
  const isTeacher = userRole === 'teacher';

  const isAssignment = module.type === 'assignment';
  const assignmentIsSubmitted = isAssignment && module.isSubmitted;
  const assignmentIsGraded = isAssignment && module.isGraded;

  const isNavigationBlocked =
    isAssignment && (!assignmentIsSubmitted || !assignmentIsGraded);

  useEffect(() => {
    const loadQuizzes = async () => {
      // HANYA panggil quiz jika memiliki ID dan BUKAN assignment
      if (module?.id && !isAssignment) {
        const data = await fetchQuizByModule(module.id);
        setQuizzes(data || []);
      } else {
        setQuizzes([]);
      }
    };
    loadQuizzes();
  }, [module, isAssignment]);

  const handleFinishClick = async () => {
    if (isAssignment) return;
    try {
      setIsSubmitting(true);
      await onComplete();
    } catch (error) {
      console.error('Error completing module', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditModule = () => {};

  const isLastModule = currentIndex === totalModules - 1;

  // console.log('module: ', module);

  return (
    <div className="w-full animate-in fade-in duration-500 pb-10">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
        <BookOpen size={16} />
        <span>Learning Modules</span>
        <span>/</span>
        <span className="text-teal-600 font-medium">
          {module.type === 'assignment'
            ? 'Assignment'
            : `Chapter ${module.order_number}`}
        </span>
      </div>

      <div className="bg-white w-full rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col min-h-[500px]">
        <div className="p-6 md:p-8 border-b border-gray-100 relative">
          <div className="flex justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-teal-50 text-teal-700 border border-teal-100 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {module.type === 'assignment'
                    ? 'Assignment'
                    : `Chapter ${module.order_number}`}
                </span>
                {module.isCompleted && (
                  <span className="flex items-center gap-1.5 text-green-600 text-xs font-bold bg-green-50 px-3 py-1 rounded-full border border-green-100">
                    <CheckCircle size={14} /> Done
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {module.isCompleted && (
          <div className="bg-green-50 px-8 py-3 border-b border-green-100 flex items-center gap-3 text-green-800 text-sm">
            <CheckCircle size={18} className="text-green-600" />
            <span>
              This module had been finished at{' '}
              <b>
                {new Date(module.completed_at).toLocaleDateString('en-EN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </b>
              .
            </span>
          </div>
        )}

        {/* konten */}
        {module.type !== 'assignment' && (
          <div
            className="p-6 md:p-6 prose max-w-none"
            dangerouslySetInnerHTML={{ __html: module.content }}
          />
        )}

        {!isTeacher && module.type === 'assignment' && (
          <div>
            <StudentSubmissionPanel assignmentModule={module} />
          </div>
        )}

        {isTeacher ? (
          <TeacherActionPanel
            quizzes={quizzes}
            courseId={courseId}
            onEditModule={handleEditModule}
          />
        ) : (
          !isAssignment && (
            <StudentQuizPanel quizzes={quizzes} courseId={courseId} />
          )
        )}

        <div className="bg-gray-50 p-6 border-t border-gray-100 flex justify-between items-center sticky bottom-0 z-10">
          {currentIndex > 0 && (
            <button
              onClick={onPrev}
              disabled={currentIndex === 0 || isSubmitting}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all
              ${
                currentIndex === 0
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300 shadow-sm'
              }`}
            >
              <ChevronLeft size={18} />
              Previous
            </button>
          )}

          <div className="flex gap-3">
            {isAssignment ? (
              <button
                onClick={onNext}
                disabled={isLastModule || isNavigationBlocked}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm
                ${
                  isLastModule || isNavigationBlocked
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-teal-600 text-white hover:bg-teal-700'
                }`}
              >
                {isNavigationBlocked
                  ? assignmentIsSubmitted
                    ? 'Menunggu Nilai Guru'
                    : 'Submit Tugas Dahulu'
                  : isLastModule
                  ? 'End of modules'
                  : 'Next Chapter'}

                {!isLastModule && !isNavigationBlocked && (
                  <ChevronRight size={18} />
                )}
              </button>
            ) : module.isCompleted ? (
              <button
                onClick={onNext}
                disabled={isLastModule}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm
                ${
                  isLastModule
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white border border-teal-200 text-teal-700 hover:bg-teal-50 hover:border-teal-300'
                }`}
              >
                {isLastModule ? 'End of modules' : 'Next Chapter'}
                {!isLastModule && <ChevronRight size={18} />}
              </button>
            ) : (
              <button
                onClick={handleFinishClick}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md bg-teal-600 text-white hover:bg-teal-700 hover:shadow-lg disabled:opacity-70 disabled:cursor-wait"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    {isLastModule
                      ? 'Finish & Close'
                      : 'Mark as done & continue'}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleContent;
