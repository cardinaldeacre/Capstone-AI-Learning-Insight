import React from 'react';
import {
  PlayCircle,
  CheckCircle,
  Lock,
  FileText,
  ClipboardList
} from 'lucide-react';

const ModuleSidebar = ({ modules, currentIndex, onSelect, progressStats }) => {
  const isAssignmentLockedByModules = !modules
    .filter(m => m.type !== 'assignment')
    .every(m => m.isCompleted);

  return (
    <aside className="fixed top-0 left-0 w-80 bg-white border-r border-gray-200 h-screen flex-col shadow-lg z-10 hidden md:flex">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 bg-white shrink-0">
        <h2 className="text-lg font-extrabold text-gray-800 tracking-tight">
          Daftar Modul
        </h2>

        <div className="flex justify-between items-end mt-2">
          <p className="text-xs text-gray-500 font-medium">
            {progressStats?.completed || 0} dari{' '}
            {progressStats?.total || modules.length} Modul Selesai
          </p>
          <span className="text-xs font-bold text-teal-600">
            {progressStats?.percentage || 0}
            %
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mt-3 overflow-hidden">
          <div
            className="bg-teal-500 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressStats?.percentage || 0}%` }}
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        <div className="space-y-1">
          {modules.map((modul, index) => {
            const isActive = index === currentIndex;
            const isCompleted = modul.isCompleted;
            const isStarted = modul.isStarted;
            const isAssignment = modul.type === 'assignment';

            const previousModuleIncomplete =
              index > 0 &&
              !modules[index - 1].isCompleted &&
              !isCompleted &&
              !isActive;

            const isLocked = isAssignment
              ? isAssignmentLockedByModules
              : previousModuleIncomplete;

            const uniqueKey = modul.navigationId || modul.id;
            return (
              <button
                key={uniqueKey}
                onClick={() => !isLocked && onSelect(index)}
                disabled={isLocked}
                className={`
                  w-full text-left px-4 py-3 rounded-lg flex items-start gap-3 transition-all duration-200 group border
                  ${
                    isActive
                      ? 'bg-teal-600 text-white border-teal-600 shadow-md' // Gaya aktif baru: solid teal, teks putih
                      : isLocked
                      ? 'bg-gray-50 text-gray-400 border-transparent cursor-not-allowed opacity-70'
                      : 'bg-white text-gray-700 border-transparent hover:bg-gray-50 hover:text-gray-900' // Gaya default: teks lebih gelap
                  }
                `}
              >
                {/* ICON */}
                <div
                  className={`
                    mt-0.5 shrink-0 transition-colors 
                    ${
                      isActive
                        ? 'text-white' // Ikon putih saat aktif
                        : isCompleted
                        ? 'text-teal-500'
                        : 'text-gray-400 group-hover:text-gray-600'
                    }
                  `}
                >
                  {isAssignment ? (
                    isLocked ? (
                      <Lock size={18} className="text-gray-300" />
                    ) : (
                      <ClipboardList size={18} className="text-teal-600" />
                    )
                  ) : isCompleted ? (
                    <CheckCircle
                      size={18}
                      className="fill-teal-100 stroke-teal-600"
                    />
                  ) : isActive ? (
                    // Ikon PlayCircle putih saat aktif
                    <PlayCircle
                      size={18}
                      className="fill-white stroke-white"
                    />
                  ) : previousModuleIncomplete ? (
                    <Lock size={18} className="text-gray-300" />
                  ) : isStarted ? (
                    <PlayCircle size={18} className="text-amber-500" />
                  ) : (
                    <FileText size={18} />
                  )}
                </div>

                <div className="overflow-hidden">
                  <p
                    className={`
                      text-[10px] font-bold mb-0.5 uppercase tracking-wider
                      ${isActive ? 'text-teal-200' : 'text-gray-400'} // Text sekunder lebih cerah
                    `}
                  >
                    {isAssignment
                      ? 'Assignment'
                      : `Chapter ${modul.order_number}`}
                  </p>

                  <h3
                    className={`
                      text-sm font-medium leading-snug truncate
                      ${isActive ? 'text-white' : 'text-gray-700'} // Text utama putih
                    `}
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