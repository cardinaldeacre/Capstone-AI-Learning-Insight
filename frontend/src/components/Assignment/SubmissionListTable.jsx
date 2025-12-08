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

const SubmissionListTable = ({ assignmentId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const loadSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchGetAllSubmissionsForTeacher(assignmentId);
      setSubmissions(response.data || []);
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

  //   nanti fetch ke download
  const handleDownload = submissionId => {
    alert(`Mendownload Submission ID: ${submissionId}`);
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

  return (
    <>
      <div className="overflow-x-auto rounded-lg border shadow-sm">
        <Table className="min-w-full">
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Siswa</TableHead>
              <TableHead>Tanggal Submit</TableHead>
              <TableHead>Status Nilai</TableHead>
              <TableHead>Nilai</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white">
            {submissions.map(sub => (
              <TableRow key={sub.id} className="hover:bg-teal-50/50">
                <TableCell className="font-medium">
                  {sub.studentName || `Siswa ID ${sub.student_id}`}
                </TableCell>
                <TableCell>
                  {new Date(sub.submitted_at).toLocaleString()}
                </TableCell>
                <TableCell>
                  {sub.score !== null ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <span className="text-yellow-600">Belum Dinilai</span>
                  )}
                </TableCell>
                <TableCell className="font-bold text-lg">
                  {sub.score !== null ? sub.score : '-'}
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
      </div>

      {isModalOpen && selectedSubmission && (
        <GradeSubmissionDialog
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          submissionData={selectedSubmission}
          onGradeSuccess={loadSubmissions} // Callback untuk me-refresh list
        />
      )}
    </>
  );
};

export default SubmissionListTable;
