import React from 'react';
import { useParams } from 'react-router';
import SubmissionListTable from '@/components/Assignment/SubmissionListTable';

export const TeacherDetailSubmissionPage = () => {
  const { assigmentId } = useParams;

  return (
    <div className="p-6 md:p-10 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">
        Detail Tugas ID: {assigmentId}
      </h1>

      {/* Bagian Detail Tugas (Judul, Deskripsi, dll.) */}
      <div className="bg-white p-6 rounded-xl shadow-md border">
        {/* Konten detail tugas di sini */}
        <p>Min Score: ...</p>
      </div>

      {/* Bagian Daftar Submission */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-teal-800 border-b pb-2">
          Daftar Submission Siswa
        </h2>
        <SubmissionListTable assignmentId={assigmentId} />
      </div>
    </div>
  );
};
