import React from 'react';
import { ChevronLeft, ChevronRight, BookOpen, PlayCircle } from 'lucide-react';

const ModuleContent = ({
  module,
  currentIndex,
  totalModules,
  onNext,
  onPrev
}) => {
  return (
    <div className="w-full animate-in fade-in duration-500">
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
        <BookOpen size={16} />
        <span>Modul Pembelajaran</span>
        <span>/</span>
        <span className="text-teal-600 font-medium">
          Materi {module.order_number}
        </span>
      </div>

      {/* main card */}
      <div className="bg-white w-full rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        {/* Header Section */}
        <div className="p-6 md:p-8 border-b border-gray-100">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            {module.title}
          </h1>
          <div className="flex items-center gap-3">
            <span className="bg-teal-100 text-teal-700 text-xs font-bold px-3 py-1 rounded-full">
              Materi {module.order_number}
            </span>
            <span className="text-gray-400 text-sm">
              Estimasi Baca: 10 menit
            </span>
          </div>
        </div>

        {/* konten */}
        <div className="p-6 md:p-8">
          {/* gambar */}
          {/* <div className="w-full h-64 md:h-80 bg-slate-900 rounded-xl mb-8 relative group overflow-hidden shadow-md">
            <img
              src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
              alt="Ilustrasi Materi"
              className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 cursor-pointer hover:bg-white/30 transition-all">
                <PlayCircle className="text-white w-8 h-8 fill-current" />
              </div>
            </div>
          </div> */}

          {/* content */}
          <article className="prose prose-lg max-w-none prose-slate prose-headings:font-bold prose-a:text-teal-600 text-gray-600">
            <p className="leading-relaxed">{module.content}</p>
          </article>
        </div>

        {/* action prev dan next */}
        <div className="bg-gray-50 p-6 border-t border-gray-100 flex justify-between items-center mt-auto">
          <button
            onClick={onPrev}
            disabled={currentIndex === 0}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all
              ${
                currentIndex === 0
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm'
              }`}
          >
            <ChevronLeft size={18} />
            Sebelumnya
          </button>

          <button
            onClick={onNext}
            disabled={currentIndex === totalModules - 1}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm
              ${
                currentIndex === totalModules - 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-teal-600 text-white hover:bg-teal-700 hover:shadow-md'
              }`}
          >
            {currentIndex === totalModules - 1 ? 'Selesai' : 'Selanjutnya'}
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModuleContent;
