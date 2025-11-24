// src/data/courseMocks.js

// --- 1. Struktur Data Pelajaran (Lesson) ---
// Digunakan di dalam setiap Module
const lessonMocks = {
  // Pelajaran untuk Bab 1
  bab1_lessons: [
    {
      id: 'L101',
      title: 'Apa itu UI/UX?',
      type: 'video', // Untuk rendering komponen VideoPlayer
      duration: '10 menit',
      isCompleted: true, // Untuk ceklis hijau
      contentPath: '/video/intro-uiux.mp4'
    },
    {
      id: 'L102',
      title: 'Prinsip Dasar Desain',
      type: 'text', // Untuk rendering komponen TextContent
      duration: '15 menit',
      isCompleted: true,
      contentPath: '/text/prinsip-dasar-desain.html'
    }
  ],
  // Pelajaran untuk Bab 2 (hanya satu yang completed)
  bab2_lessons: [
    {
      id: 'L201',
      title: 'Metode Kualitatif vs Kuantitatif',
      type: 'video',
      duration: '20 menit',
      isCompleted: true, // Progres 50%
      contentPath: '/video/riset-kualitatif.mp4'
    },
    {
      id: 'L202',
      title: 'Membuat Persona Pengguna',
      type: 'text',
      duration: '15 menit',
      isCompleted: false,
      contentPath: '/text/persona-pengguna.html'
    }
  ],
  // Pelajaran untuk Bab 3 & 4 (belum completed)
  bab3_lessons: [
    {
      id: 'L301',
      title: 'Low-Fidelity Wireframing',
      type: 'text',
      duration: '25 menit',
      isCompleted: false,
      contentPath: '/text/wireframe.html'
    },
    {
      id: 'L302',
      title: 'Prototyping Interaktif',
      type: 'video',
      duration: '30 menit',
      isCompleted: false,
      contentPath: '/video/prototype.mp4'
    }
  ],
  bab4_lessons: [
    {
      id: 'L401',
      title: 'Analisis Studi Kasus E-commerce',
      type: 'text',
      duration: '45 menit',
      isCompleted: false,
      contentPath: '/text/case-study.html'
    }
  ]
};

// --- 2. Data Detail Kursus Lengkap (Untuk Halaman Detail) ---
export const courseDetailMock = {
  id: 'UIUX01',
  title: 'Desain UI/UX Fundamental untuk Pemula',
  instructor: 'Budi Prasetyo',
  rating: 4.5,
  reviewCount: 2130,
  shortDescription:
    'Kursus ini dirancang untuk pemula yang ingin memahami dasar-dasar desain antarmuka pengguna (UI) dan pengalaman pengguna (UX).',
  longDescription:
    'Anda akan belajar tentang riset pengguna, membuat wireframe, prototipe, dan menerapkan prinsip-prinsip desain untuk menciptakan produk digital yang efektif dan ramah pengguna. Materi mencakup dasar-dasar desain visual, *user flows*, hingga pengujian kegunaan.',

  // Progres keseluruhan kursus (berdasarkan Bab 1: 100%, Bab 2: 50%, Bab 3 & 4: 0%)
  overallProgress: 37, // Simulasi 37% selesai

  // Modul (Bab)
  modules: [
    {
      id: 'M01',
      title: 'Bab 1: Pengenalan Desain UI/UX',
      moduleProgress: 100, // 100% selesai
      lessons: lessonMocks.bab1_lessons
    },
    {
      id: 'M02',
      title: 'Bab 2: Riset Pengguna',
      moduleProgress: 50, // 50% selesai (1 dari 2 pelajaran)
      lessons: lessonMocks.bab2_lessons
    },
    {
      id: 'M03',
      title: 'Bab 3: Wireframing dan Prototyping',
      moduleProgress: 0,
      lessons: lessonMocks.bab3_lessons
    },
    {
      id: 'M04',
      title: 'Bab 4: Studi Kasus',
      moduleProgress: 0,
      lessons: lessonMocks.bab4_lessons
    }
  ]
};

// --- 3. Data Daftar Kursus (Untuk Halaman List/Dashboard) ---
export const courseListMocks = [
  {
    id: 'ML01',
    title: 'Introduction to Machine Learning',
    moduleTitle: 'Module 1',
    instructor: 'Dr. Evelyn Reed',
    progress: 75
  },
  {
    id: 'DS02',
    title: 'Data Science with Python',
    moduleTitle: 'Module 2',
    instructor: 'Dr. Alex Chen',
    progress: 45
  },
  {
    id: 'DL03',
    title: 'Deep Learning Fundamentals',
    moduleTitle: 'Module 3',
    instructor: 'Prof. Sarah Jones',
    progress: 20
  },
  {
    id: 'NLP04',
    title: 'Natural Language Processing',
    moduleTitle: 'Module 4',
    instructor: 'Dr. Ben Carter',
    progress: 90
  },
  {
    id: 'CV05',
    title: 'Computer Vision Basics',
    moduleTitle: 'Module 5',
    instructor: 'Dr. Olivia Martinez',
    progress: 15
  },
  {
    id: 'RL06',
    title: 'Reinforcement Learning',
    moduleTitle: 'Module 6',
    instructor: 'Prof. Leo Kim',
    progress: 0
  },
  // Tambahkan kursus UI/UX ke daftar agar bisa diakses
  {
    id: 'UIUX01',
    title: 'Desain UI/UX Fundamental untuk Pemula',
    moduleTitle: 'Bab 1',
    instructor: 'Budi Prasetyo',
    progress: courseDetailMock.overallProgress // Mengambil progres dari detail
  }
];

// --- 4. Fungsi Simulasi Fetch (Untuk digunakan di komponen React) ---

/**
 * Simulasi mengambil daftar kursus (untuk Course List Page).
 * @returns {Promise<Array>} Daftar kursus.
 */
export const fetchCourseList = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(courseListMocks);
    }, 500); // Simulasi latency 500ms
  });
};

/**
 * Simulasi mengambil detail kursus berdasarkan ID.
 * @param {string} courseId ID kursus yang dicari.
 * @returns {Promise<Object>} Detail kursus lengkap.
 */
export const fetchCourseDetail = courseId => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Hanya mengembalikan mock UIUX saat ini,
      // di implementasi nyata, Anda akan mencari data berdasarkan courseId
      if (courseId === 'UIUX01') {
        resolve(courseDetailMock);
      } else {
        // Coba cari di list mocks
        const listFound = courseListMocks.find(c => c.id === courseId);
        if (listFound) {
          // Mengembalikan data sederhana jika detail spesifik belum dibuat
          resolve({
            ...listFound,
            overallProgress: listFound.progress,
            modules: []
          });
        } else {
          reject(new Error(`Course with ID ${courseId} not found.`));
        }
      }
    }, 700);
  });
};

/**
 * Simulasi mengambil detail pelajaran spesifik.
 * @param {string} courseId
 * @param {string} lessonId
 * @returns {Promise<Object>} Detail pelajaran.
 */
export const fetchLessonDetail = (courseId, lessonId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (courseId === 'UIUX01') {
        const allLessons = courseDetailMock.modules.flatMap(m => m.lessons);
        const lesson = allLessons.find(l => l.id === lessonId);

        if (lesson) {
          resolve(lesson);
        } else {
          reject(
            new Error(`Lesson ${lessonId} not found in course ${courseId}.`)
          );
        }
      } else {
        reject(
          new Error(`Course ${courseId} detail structure not mocked yet.`)
        );
      }
    }, 300);
  });
};
