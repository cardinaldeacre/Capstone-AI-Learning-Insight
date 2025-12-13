import React, { useState, useEffect } from 'react';
import {
  FileUp,
  Clock,
  CheckCircle,
  UploadCloud,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  fetchGetAllMySubmissions,
  fetchPostSubmission
} from '@/lib/api/services/submissionService';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

const StudentSubmissionPanel = ({ assignmentModule }) => {
  const assignmentId = assignmentModule.assignmentId;
  const [submission, setSubmission] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [_, setPendingSubmit] = useState(null);

  useEffect(() => {
    const loadMySubmission = async () => {
      try {
        const response = await fetchGetAllMySubmissions(Number(assignmentId));

        let submissionData = null;
        if (response && typeof response === 'object' && response.id) {
          submissionData = response;
        } else if (Array.isArray(response) && response.length > 0) {
          submissionData = response[0];
        }
        setSubmission(submissionData);
        console.log('fetchGetAllMySubmissions', response);
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
      toast.error('Required file format .zip');
      setFile(null);
    }
  };

  const tryUpload = e => {
    e.preventDefault();

    if (submission?.file_url) {
      setPendingSubmit(true);
      setShowDialog(true);
      return;
    }

    handleUpload();
  };

  const handleUpload = async () => {
    if (!file) {
      toast.warning('Choose file .zip first!');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('assignment_id', assignmentId);
    // console.log('formData: ', formData);

    try {
      const response = await fetchPostSubmission(formData);
      setSubmission(response.submission);
      toast.success('Submission succesfully uploaded');
    } catch (error) {
      console.error('Upload submission gagal: ', error);
      throw error;
    } finally {
      setLoading(false);
      setShowDialog(false);
      setPendingSubmit(null);
    }
  };

  const BASE = import.meta.env.VITE_BASE_URL_BACKEND || 'http://localhost:3000';
  const handleDownload = () => {
    // console.log('handleDOwnload', submission, submission.file_url);
    if (!submission || !submission.file_url) {
      console.error('Submission tidak ditemukan:', submission);
      return;
    }

    const baseUrl =
      import.meta.env.VITE_BASE_URL_BACKEND || 'http://localhost:3000';

    const fileUrl = submission.file_url.startsWith('/')
      ? `${baseUrl}${submission.file_url}`
      : `${baseUrl}/${submission.file_url}`;

    window.open(fileUrl, '_blank');
  };

  //   logic status
  const isSubmitted = !!submission;
  const isGraded = isSubmitted && submission.score !== null;

  const renderStatusBadge = () => {
    if (isGraded) {
      const status =
        submission.score >= assignmentModule.min_score
          ? 'PASSED'
          : submission.score === 0
            ? 'NOT EVALUATED'
            : 'NOT PASSED';
      const color =
        status === 'PASSED'
          ? 'bg-teal-600 hover:bg-teal-700'
          : status === 'NOT EVALUATED'
            ? 'text-yellow-600 border-yellow-600 bg-yellow-50/50'
            : 'bg-red-500 hover:bg-red-600';

      const Icon = status === 'NOT EVALUATED' ? Clock : CheckCircle;

      const label =
        status === 'NOT EVALUATED'
          ? status
          : `Evaluated: ${submission.score}/${assignmentModule.min_score} (${status})`;
      return (
        <Badge className={`mt-2 text-white ${color}`}>
          <Icon className="w-5 h-5 mr-1" />
          {label}
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
          NOT EVALUATED
        </Badge>
      );
    }
    return (
      <Badge className="mt-2 bg-gray-400 text-white">
        <FileUp className="w-4 h-4 mr-1" />
        Not uploaded yet
      </Badge>
    );
  };

  const renderSubmissionForm = () => (
    <form onSubmit={tryUpload} className="space-y-4">
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
        <p className="text-sm text-gray-500">
          Choosen file: <span className="font-bold">{file.name}</span>
        </p>
      )}
    </form>
  );

  return (
    <>
      <Card className="shadow-lg border-2 border-teal-500/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <h3 className="text-xl font-semibold text-teal-800">
            {assignmentModule.title}
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
              <p className="font-medium text-teal-800">Current Submission:</p>
              <p className="text-sm text-gray-600">
                Uploaded at:{' '}
                {new Date(submission.submitted_at).toLocaleString()}
              </p>
              <p className="text-sm  text-gray-700 mt-5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  title="Download ZIP Submission"
                >
                  <Download className="w-4 h-4 mr-1" />
                </Button>

                <span className="pl-2">Download Submission</span>
              </p>
            </div>
          )}

          <p className="text-sm text-gray-500 mb-2">
            Upload your .zip file here
          </p>
          {renderSubmissionForm()}
        </CardContent>
      </Card>

      {/* alertDialog */}
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Overwrite Submission?</AlertDialogTitle>
            <AlertDialogDescription>
              Current submission exist, overwrite current submission?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={() => {
                handleUpload();
              }}
            >
              Overwrite
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default StudentSubmissionPanel;
