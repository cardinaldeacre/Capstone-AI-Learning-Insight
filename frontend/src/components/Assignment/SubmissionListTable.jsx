import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, Edit3, Loader2, CheckCircle } from 'lucide-react';
import { fetchGetAllSubmissionsForTeacher } from '@/lib/api/services/submissionService';
import GradeSubmissionDialog from './GradeSubmissionDialog';
import { toast } from 'sonner';

const SubmissionListTable = ({ assignmentId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const loadSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchGetAllSubmissionsForTeacher(assignmentId);
      console.log(response);
      setSubmissions(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('gagal memmuat submissions: ', error);
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  }, [assignmentId]);

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  const handleOpenGrade = submission => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  const BASE = import.meta.env.VITE_BASE_URL_BACKEND || 'http://localhost:3000';

  const handleDownload = submissionId => {
    const sub = submissions.find(s => String(s.id) === String(submissionId));
    if (!sub) {
      return toast('Submission tidak ditemukan');
    }

    const base = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE;
    const fileUrl = sub.file_url.startsWith('/')
      ? `${base}${sub.file_url}`
      : `${base}/${sub.file_url}`;
    window.open(fileUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="p-10 text-center">
        <Loader2 className="w-6 h-6 animate-spin text-teal-600 mx-auto" />
        <p className="mt-2 text-gray-500">Memuat data submissions...</p>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="p-10 text-center border rounded-lg bg-white shadow-sm">
        <p className="text-gray-600 font-medium">
          Belum ada siswa yang mensubmit tugas ini.
        </p>
      </div>
    );
  }

  console.log(submissions);

  return (
    <>
      <div className="w-full overflow-x-auto lg:overflow-visible">
        <Table className="hidden lg:table min-w-full">
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Siswa</TableHead>
              <TableHead>Tanggal Submit</TableHead>
              <TableHead>Status Nilai</TableHead>
              <TableHead>Min. Nilai</TableHead>
              <TableHead>Nilai</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="bg-white">
            {submissions.map(sub => (
              <TableRow key={sub.id} className="hover:bg-teal-50/50">
                <TableCell className="font-medium">{sub.student_id}</TableCell>
                <TableCell className="font-medium">
                  {sub.student_name}
                </TableCell>
                <TableCell>
                  {new Date(sub.submitted_at).toLocaleString()}
                </TableCell>
                <TableCell>
                  {sub.score !== 0 ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <span className="text-yellow-600">Belum Dinilai</span>
                  )}
                </TableCell>
                <TableCell className="font-bold text-lg">
                  {sub.min_score !== 0 ? sub.min_score : '-'}
                </TableCell>
                <TableCell className="font-bold text-lg">
                  {sub.score !== 0 ? sub.score : '-'}
                </TableCell>
                <TableCell className="flex justify-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(sub.id)}
                    title="Download ZIP Submission"
                  >
                    <Download className="w-4 h-4 mr-1" />
                  </Button>
                  <Button
                    size="sm"
                    className="bg-teal-600 hover:bg-teal-700"
                    onClick={() => handleOpenGrade(sub)}
                    title="Beri Nilai"
                  >
                    <Edit3 className="w-4 h-4 mr-1" />
                    Nilai
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="space-y-4 lg:hidden">
          {submissions.map(sub => (
            <div
              key={sub.id}
              className="border rounded-xl p-4 bg-white shadow-sm space-y-2"
            >
              <div className="text-sm text-gray-500">ID: {sub.student_id}</div>
              <div className="font-medium text-lg">{sub.student_name}</div>

              <div className="text-sm">
                <span className="text-gray-500">Tanggal Submit: </span>
                {new Date(sub.submitted_at).toLocaleString()}
              </div>

              <div className="text-sm">
                <span className="text-gray-500">Status Nilai: </span>
                {sub.score !== 0 ? (
                  <CheckCircle className="w-5 h-5 inline text-green-600" />
                ) : (
                  <span className="text-yellow-600">Belum Dinilai</span>
                )}
              </div>

              <div className="text-sm">
                <span className="text-gray-500">Min. Nilai: </span>
                {sub.min_score !== 0 ? sub.min_score : '-'}
              </div>

              <div className="text-sm">
                <span className="text-gray-500">Nilai: </span>
                {sub.score !== 0 ? sub.score : '-'}
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(sub.id)}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
                <Button
                  size="sm"
                  className="bg-teal-600 hover:bg-teal-700"
                  onClick={() => handleOpenGrade(sub)}
                >
                  <Edit3 className="w-4 h-4 mr-1" />
                  Nilai
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && selectedSubmission && (
        <GradeSubmissionDialog
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          submissionData={selectedSubmission}
          onGradeSuccess={loadSubmissions}
        />
      )}
    </>
  );
};

export default SubmissionListTable;
