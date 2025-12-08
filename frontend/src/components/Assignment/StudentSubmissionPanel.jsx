import React, { useState, useEffect } from 'react';
import { FileUp, Clock, CheckCircle, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  fetchGetAllMySubmissions,
  fetchPostSubmission
} from '@/lib/api/services/submissionService';
import { toast } from 'sonner';

const StudentSubmissionPanel = ({ assignmentModule }) => {
  // if (!assignmentModule) {
  //   return (
  //     <p className="p-4 text-red-500">Error: Assignment data is missing</p>
  //   );
  // }
  console.log('assignmentModule', assignmentModule);

  const assignmentId = assignmentModule.assignmentId;
  const [submission, setSubmission] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadMySubmission = async () => {
      try {
        const response = await fetchGetAllMySubmissions(assignmentId);
        setSubmission(
          Array.isArray(response.data) ? response.data[0] : response.data
        );
      } catch (error) {
        console.error('gagal fetch getAllSubmission: ', error);
        setSubmission(null);
        throw error;
      }
    };
    loadMySubmission();
  }, [assignmentId]);

  const handleFileChange = async e => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.name.endsWith('.zip')) {
      setFile(selectedFile);
    } else {
      toast.error('Pilih harus dalam format .zip');
      setFile(null);
    }
  };

  const handleUpload = async e => {
    e.preventDefault();
    if (!file) {
      toast.warning('Pilih file .zip terlebih dahulu');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('assignment_id', assignmentId);

    try {
      const response = await fetchPostSubmission(formData);
      setSubmission(response.data);
      toast.success('Submission berhasil diunggah');
    } catch (error) {
      console.error('Upload submission gagal: ', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  //   logic status
  const isSubmitted = !!submission;
  const isGraded = isSubmitted && submission.score !== null;

  const renderStatusBadge = () => {
    if (isGraded) {
      const status =
        submission.score >= assignmentModule.min_score
          ? 'LULUS'
          : 'TIDAK LULUS';
      const color =
        status === 'LULUS'
          ? 'bg-teal-600 hover:bg-teal-700'
          : 'bg-red-500 hover:bg-red-600';
      return (
        <Badge className={`mt-2 text-white ${color}`}>
          <CheckCircle className="w-4 h-4 mr-1" />
          Dinilai: {submission.score}/{assignmentModule.min_score} ({status})
        </Badge>
      );
    }
    if (isSubmitted) {
      return (
        <Badge
          variant="outline"
          className="mt-2 text-yellow-600 border-yellow-600 bg-yellow-50/50"
        >
          <Clock className="w-4 h-4 mr-1" />
          Menunggu Penilaian
        </Badge>
      );
    }
    return (
      <Badge className="mt-2 bg-gray-400 text-white">
        <FileUp className="w-4 h-4 mr-1" />
        Belum Mengunggah
      </Badge>
    );
  };

  const renderSubmissionForm = () => (
    <form onSubmit={handleUpload} className="space-y-4">
      <div className="flex items-center space-x-2">
        <Input
          id="file"
          type="file"
          accept=".zip"
          onChange={handleFileChange}
          disabled={loading}
          className="flex-1"
        />
        <Button
          type="submit"
          className="bg-teal-600 hover:bg-teal-700 text-white gap-2"
          disabled={loading || !file}
        >
          {loading ? 'Mengunggah...' : 'Upload'}
          <UploadCloud className="w-4 h-4" />
        </Button>
      </div>
      {file && (
        <p className="text-sm text-gray-500">File terpilih: **{file.name}**</p>
      )}
    </form>
  );

  return (
    <Card className="shadow-lg border-2 border-teal-500/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <h3 className="text-xl font-semibold text-teal-800">
          {assignmentModule.title} (Assignment)
        </h3>
        {renderStatusBadge()}
      </CardHeader>
      <CardContent>
        <div
          className="prose max-w-none mb-6 p-4 border rounded-lg bg-gray-50"
          dangerouslySetInnerHTML={{ __html: assignmentModule.content }}
        />

        <h4 className="text-lg font-medium mb-3 border-b pb-1 text-gray-700">
          Submission Area
        </h4>

        {isSubmitted && (
          <div className="p-4 bg-teal-50/50 border border-teal-200 rounded-lg mb-4">
            <p className="font-medium text-teal-800">Submission Terakhir:</p>
            <p className="text-sm text-gray-600">
              Diunggah pada:{' '}
              {new Date(submission.submitted_at).toLocaleString()}
            </p>
            {isGraded && (
              <p className="text-sm mt-2 text-gray-700">
                **Feedback Guru:**{' '}
                {submission.feedback || 'Tidak ada feedback.'}
              </p>
            )}
          </div>
        )}

        {/* Siswa diizinkan upload ulang bahkan jika sudah dinilai, atau jika belum dinilai */}
        <p className="text-sm text-gray-500 mb-2">
          Unggah file ZIP tugas Anda di sini. (Mengunggah baru akan menimpa
          submission sebelumnya).
        </p>
        {renderSubmissionForm()}
      </CardContent>
    </Card>
  );
};

export default StudentSubmissionPanel;
