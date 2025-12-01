import React from 'react';
import { PlayCircle, CheckCircle, Lock, FileText } from 'lucide-react';

const ModuleSidebar = ({ modules, currentIndex, onSelect }) => {
  return (
    <aside className="fixed top-0 left-0 w-80 bg-white border-r border-gray-200 h-screen flex-col shadow-sm z-10 hidden md:flex">
      {/* header */}
      <div className="p-6 border-b border-gray-100 bg-white shrink-0">
        <h2 className="text-lg font-bold text-gray-800 tracking-tight">
          Daftar Modul
        </h2>
        <p className="text-xs text-gray-500 mt-1 font-medium">
          {currentIndex + 1} dari {modules.length} Materi Selesai
        </p>
        {/* progressr */}
        <div className="w-full bg-gray-100 rounded-full h-1.5 mt-3">
          <div
            className="bg-teal-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / modules.length) * 100}%` }}
          />
        </div>
      </div>

      {/* list materi*/}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        <div className="space-y-1">
          {modules.map((modul, index) => {
            const isActive = index === currentIndex;
            const isCompleted = index < currentIndex;

            return (
              <button
                key={modul.id}
                onClick={() => onSelect(index)}
                className={`
                  w-full text-left px-4 py-3 rounded-lg flex items-start gap-3 transition-all duration-200 group
                  ${
                    isActive
                      ? 'bg-teal-50 text-teal-700 ring-1 ring-teal-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                {/* Icon Logic */}
                <div
                  className={`mt-0.5 shrink-0 transition-colors ${
                    isActive
                      ? 'text-teal-600'
                      : 'text-gray-400 group-hover:text-gray-600'
                  }`}
                >
                  {isActive ? (
                    <PlayCircle
                      size={18}
                      fill="currentColor"
                      className="text-teal-100 stroke-teal-600"
                    />
                  ) : isCompleted ? (
                    <CheckCircle size={18} className="text-teal-500" />
                  ) : (
                    <FileText size={18} />
                  )}
                </div>

                <div className="overflow-hidden">
                  <p
                    className={`text-xs font-semibold mb-0.5 uppercase tracking-wider ${
                      isActive ? 'text-teal-600' : 'text-gray-400'
                    }`}
                  >
                    Materi {index + 1}
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
