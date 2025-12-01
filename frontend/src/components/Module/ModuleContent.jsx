import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  CheckCircle,
  Loader2
} from 'lucide-react';

const ModuleContent = ({
  module,
  currentIndex,
  totalModules,
  onNext,
  onPrev,
  onComplete
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // handle tombol supaya aman
  const handleFinishClick = async () => {
    try {
      setIsSubmitting(true);
      await onComplete(); //props tunggu sampe selesai
    } catch (error) {
      console.error('Error completing module', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cek apakah ini modul terakhir
  const isLastModule = currentIndex === totalModules - 1;

  return (
    <div className="w-full animate-in fade-in duration-500 pb-10">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
        <BookOpen size={16} />
        <span>Modul Pembelajaran</span>
        <span>/</span>
        <span className="text-teal-600 font-medium">
          Materi {module.order_number}
        </span>
      </div>

      {/* main  */}
      <div className="bg-white w-full rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col min-h-[500px]">
        {/* header */}
        <div className="p-6 md:p-8 border-b border-gray-100 relative">
          <div className="flex justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-teal-50 text-teal-700 border border-teal-100 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Materi {module.order_number}
                </span>
                {module.isCompleted && (
                  <span className="flex items-center gap-1.5 text-green-600 text-xs font-bold bg-green-50 px-3 py-1 rounded-full border border-green-100">
                    <CheckCircle size={14} /> Selesai
                  </span>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                {module.title}
              </h1>
            </div>
          </div>
        </div>

        {/* banner sukses jika sudah selesai*/}
        {module.isCompleted && (
          <div className="bg-green-50 px-8 py-3 border-b border-green-100 flex items-center gap-3 text-green-800 text-sm">
            <CheckCircle size={18} className="text-green-600" />
            <span>
              Modul ini sudah Anda selesaikan pada{' '}
              <b>
                {new Date(module.completed_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </b>
              .
            </span>
          </div>
        )}

        {/* content body */}
        <div className="p-6 md:p-8 flex-1">
          <article className="prose prose-lg max-w-none prose-slate prose-headings:font-bold prose-a:text-teal-600 text-gray-600 leading-relaxed">
            <div className="whitespace-pre-wrap">{module.content}</div>
          </article>
        </div>

        {/* tombol action */}
        <div className="bg-gray-50 p-6 border-t border-gray-100 flex justify-between items-center sticky bottom-0 z-10">
          {/* prev */}
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
            Sebelumnya
          </button>

          {/* next) */}
          <div className="flex gap-3">
            {module.isCompleted ? (
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
                {isLastModule ? 'Materi Habis' : 'Materi Selanjutnya'}
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
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    {isLastModule
                      ? 'Selesai & Tutup'
                      : 'Tandai Selesai & Lanjut'}
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
