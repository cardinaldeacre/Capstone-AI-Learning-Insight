import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchCourseModules } from '@/lib/api/services/courseService';
import ModuleSidebar from '@/components/Module/ModuleSIdebar';
import ModuleContent from '@/components/Module/ModuleContent';
import { useLayout } from '@/hooks/useLayout';

const LearningPage = () => {
  const { courseId } = useParams();
  const { toggleSidebar } = useLayout();
  const [modules, setModules] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    toggleSidebar(false);
    return () => {
      toggleSidebar(true);
    };
  }, [toggleSidebar]);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true);
        const data = await fetchCourseModules(courseId);
        const sortedData = data.sort((a, b) => a.order_number - b.order_number);
        setModules(sortedData);
      } catch (err) {
        console.error('Gagal memuat modul', err);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchModules();
    }
  }, [courseId]);

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

  if (loading) return <div className="p-10 text-center">Memuat materi...</div>;
  if (modules.length === 0)
    return <div className="p-10 text-center">Belum ada modul tersedia.</div>;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <ModuleSidebar
        modules={modules}
        currentIndex={currentIndex}
        onSelect={handleSelectModule}
      />

      <main className="flex-1 ml-80 h-screen overflow-y-auto relative bg-gray-50">
        <div className="w-full p-4 md:p-6 pb-20">
          <ModuleContent
            module={modules[currentIndex]}
            currentIndex={currentIndex}
            totalModules={modules.length}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        </div>
      </main>
    </div>
  );
};

export default LearningPage;
