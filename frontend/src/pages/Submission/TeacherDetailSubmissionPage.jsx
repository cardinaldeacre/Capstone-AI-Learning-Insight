import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import SubmissionListTable from '@/components/Assignment/SubmissionListTable';
import { fetchCourseStudentDetail } from '@/lib/api/services/courseService';

export default function TeacherDetailSubmissionPage() {
  const { courseId, assigmentId } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    fetchCourseStudentDetail(courseId).then(res => setCourse(res));
  }, [courseId]);

  return (
    <div className="p-6 md:p-10 space-y-8">
      {/* Bagian Daftar Submission */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-teal-800 border-b pb-2">
          Daftar Submission Siswa - {course?.title}
        </h2>
        <SubmissionListTable assignmentId={assigmentId} />
      </div>
    </div>
  );
}
