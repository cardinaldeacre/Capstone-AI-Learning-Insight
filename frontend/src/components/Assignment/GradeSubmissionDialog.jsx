import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { fetchPutGradeSubmission } from '@/lib/api/services/submissionService';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const GradeSubmissionDialog = ({
  isOpen,
  onClose,
  submissionData,
  onGradeSuccess
}) => {
  const [score, setScore] = useState(submissionData?.score || '');
  const [feedback, setFeedback] = useState(submissionData?.feedback || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!score || score < 0) {
      toast.error('Score cannot be null or negatif');
      return;
    }

    setLoading(true);
    try {
      const payload = { score: parseInt(score), feedback };
      await fetchPutGradeSubmission(submissionData.id, payload);

      toast.success('Score saved succesfully');
      onGradeSuccess();
      onClose();
    } catch (error) {
      console.error('Gagal fetch grade submission: ', error);
      toast.error('Failed to save score');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-teal-600">Submission Score</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            Score for student:{' '}
            <span className="font-bold">{submissionData?.student_name}</span>
          </p>
          <div>
            <label className="text-sm font-medium">Score</label>
            <Input
              type="number"
              value={score}
              onChange={e => setScore(e.target.value)}
              placeholder="0-100"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Feedback</label>
            <Textarea
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              placeholder="Berikan komentar atau saran..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-teal-600 hover:bg-teal-700 gap-2"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Confirm & Save'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GradeSubmissionDialog;
