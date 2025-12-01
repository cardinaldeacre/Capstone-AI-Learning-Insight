import React from 'react';
import { PlayCircle, CheckCircle, Lock, FileText } from 'lucide-react';

const ModuleSidebar = ({ modules, currentIndex, onSelect, progressStats }) => {
  return (
    <aside className="fixed top-0 left-0 w-80 bg-white border-r border-gray-200 h-screen flex-col shadow-sm z-10 hidden md:flex">
      {/* header */}
      <div className="p-6 border-b border-gray-100 bg-white shrink-0">
        <h2 className="text-lg font-bold text-gray-800 tracking-tight">
          Daftar Modul
        </h2>

        {/* Statistik Progress */}
        <div className="flex justify-between items-end mt-1">
          <p className="text-xs text-gray-500 font-medium">
            {progressStats?.completed || 0} dari{' '}
            {progressStats?.total || modules.length} Materi Selesai
          </p>
          <span className="text-xs font-bold text-teal-600">
            {progressStats?.percentage || 0}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-100 rounded-full h-2 mt-3 overflow-hidden">
          <div
            className="bg-teal-500 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressStats?.percentage || 0}%` }}
          />
        </div>
      </div>

      {/* List Materi */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        <div className="space-y-1">
          {modules.map((modul, index) => {
            const isActive = index === currentIndex;
            const isCompleted = modul.isCompleted;
            const isStarted = modul.isStarted;

            const isLocked =
              index > 0 &&
              !modules[index - 1].isCompleted &&
              !isCompleted &&
              !isActive;

            return (
              <button
                key={modul.id}
                onClick={() => !isLocked && onSelect(index)}
                disabled={isLocked}
                className={`
                  w-full text-left px-4 py-3 rounded-lg flex items-start gap-3 transition-all duration-200 group border
                  ${
                    isActive
                      ? 'bg-teal-50 text-teal-700 border-teal-100 ring-1 ring-teal-200'
                      : isLocked
                      ? 'bg-gray-50 text-gray-400 border-transparent cursor-not-allowed opacity-70'
                      : 'bg-white text-gray-600 border-transparent hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                {/* icon */}
                <div
                  className={`mt-0.5 shrink-0 transition-colors ${
                    isActive
                      ? 'text-teal-600'
                      : isCompleted
                      ? 'text-teal-500'
                      : 'text-gray-400 group-hover:text-gray-600'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle
                      size={18}
                      className="fill-teal-100 stroke-teal-600"
                    />
                  ) : isActive ? (
                    <PlayCircle
                      size={18}
                      fill="currentColor"
                      className="text-teal-100 stroke-teal-600"
                    />
                  ) : isLocked ? (
                    <Lock size={18} className="text-gray-300" />
                  ) : isStarted ? (
                    <PlayCircle size={18} className="text-amber-500" />
                  ) : (
                    <FileText size={18} />
                  )}
                </div>

                <div className="overflow-hidden">
                  <p
                    className={`text-[10px] font-bold mb-0.5 uppercase tracking-wider ${
                      isActive ? 'text-teal-600' : 'text-gray-400'
                    }`}
                  >
                    Materi {modul.order_number}
                  </p>
                  <h3
                    className={`text-sm font-medium leading-snug truncate ${
                      isActive ? 'text-gray-900' : 'text-gray-600'
                    }`}
                  >
                    {modul.title}
                  </h3>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default ModuleSidebar;
