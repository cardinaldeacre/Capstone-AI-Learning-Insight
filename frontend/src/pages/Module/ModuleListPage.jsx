import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  fetchCourseModules,
  fetchGetModuleProgress,
  fetchStartModuleProgress,
  fetchCompleteModuleProgress
} from '@/lib/api/services/courseService';
import ModuleSidebar from '@/components/Module/ModuleSIdebar';
import ModuleContent from '@/components/Module/ModuleContent';
import { useLayout } from '@/hooks/useLayout';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const LearningPage = () => {
  const { courseId } = useParams();
  const { toggleSidebar } = useLayout();

  const [modules, setModules] = useState([]);
  const [progressStats, setProgressStats] = useState({
    total: 0,
    completed: 0,
    percentage: 0
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    toggleSidebar(false);
    return () => {
      toggleSidebar(true);
    };
  }, [toggleSidebar]);

  useEffect(() => {
    const fetchData = async () => {
      if (!courseId) return;

      try {
        setLoading(true);

        const [modulesData, progressResponse] = await Promise.all([
          fetchCourseModules(courseId),
          fetchGetModuleProgress(courseId)
        ]);

        const progressList = progressResponse.data || []; //response dari fetchGetModuleProgress

        // matching data module dan data progress
        const mergedModules = modulesData.map(mod => {
          const progress = progressList.find(
            p => String(p.module_id) === String(mod.id)
          );

          return {
            ...mod,
            started_at: progress?.started_at || null,
            completed_at: progress?.completed_at || null,
            isCompleted: !!progress?.completed_at,
            isStarted: !!progress?.started_at
          };
        });

        const sortedModules = mergedModules.sort(
          (a, b) => a.order_number - b.order_number
        );
        setModules(sortedModules);
        setProgressStats(
          progressResponse.stats || { total: 0, completed: 0, percentage: 0 }
        );

        // mulai module yg isCompleted == false
        const firstUnfinishedIndex = sortedModules.findIndex(
          m => !m.isCompleted
        );
        if (firstUnfinishedIndex !== -1) setCurrentIndex(firstUnfinishedIndex);
      } catch (err) {
        console.error('gagal memuat data module dan progress', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  // cek untuk pertama kali start module
  useEffect(() => {
    const markAsStarted = async () => {
      const currentModule = modules[currentIndex];

      if (currentModule && !currentModule.isStarted) {
        try {
          await fetchStartModuleProgress(currentModule.id);

          setModules(prevModules =>
            prevModules.map((mod, idx) =>
              idx === currentIndex
                ? {
                    ...mod,
                    isStarted: true,
                    started_at: new Date().toISOString()
                  }
                : mod
            )
          );
        } catch (err) {
          console.error('gagal menandai modul dimulai ', err);
        }
      }
    };

    if (modules.length > 0) {
      markAsStarted();
    }
  }, [currentIndex, modules]);

  const handleNext = () => {
    if (currentIndex < modules.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSelectModule = index => {
    setCurrentIndex(index);
  };

  //menandai module yg selesai
  const handleMarkAsComplete = async () => {
    const currentModule = modules[currentIndex];
    if (!currentModule) return;

    try {
      await fetchCompleteModuleProgress(currentModule.id);

      setModules(prevModules => {
        return prevModules.map((mod, idx) =>
          idx === currentIndex
            ? {
                ...mod,
                isCompleted: true,
                completed_at: new Date().toISOString()
              }
            : mod
        );
      });

      setProgressStats(prev => {
        const newCompletedCount = prev.completed + 1;
        return {
          ...prev,
          completed: newCompletedCount,
          percentage: Math.round((newCompletedCount / prev.total) * 100)
        };
      });

      handleNext();
    } catch (err) {
      console.error('ERROR LENGKAP:', err);
      console.error('Response Server:', err.response?.data);

      alert('Gagal menyimpan progress. Silakan coba lagi.');
    }
  };

  if (loading) return <div className="p-10 text-center">Memuat materi...</div>;
  if (modules.length === 0)
    return <div className="p-10 text-center">Belum ada modul tersedia.</div>;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <ModuleSidebar
        modules={modules}
        currentIndex={currentIndex}
        onSelect={handleSelectModule}
        progressStats={progressStats}
      />

      <main className="flex-1 ml-80 h-screen overflow-y-auto relative bg-gray-50">
        {/* Navbar  atas modulecontent*/}
        <nav className="fixed top-0 left-80 right-0 h-14 bg-white border-b shadow-sm z-50 flex items-center px-4">
          <Link
            to={`/courses/${courseId}`}
            className="flex items-center text-teal-600 hover:text-teal-700 font-medium"
          >
            ← Kembali ke Kelas
          </Link>
        </nav>

        {/* module content */}
        <div className="w-full p-4 md:p-6 pb-20 pt-16 mt-5">
          <ModuleContent
            key={modules[currentIndex]?.id}
            module={modules[currentIndex]}
            currentIndex={currentIndex}
            totalModules={modules.length}
            onNext={handleNext}
            onPrev={handlePrev}
            onComplete={handleMarkAsComplete}
            courseId={courseId}
          />
        </div>
      </main>
    </div>
  );
};

export default LearningPage;
