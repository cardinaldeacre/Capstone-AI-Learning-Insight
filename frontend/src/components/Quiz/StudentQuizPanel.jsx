import StudentQuizItem from './StudentQuizItem';

export default function StudentQuizPanel({ quizzes, courseId }) {
  // console.log("quizzes", quizzes, "courseId:", courseId)
  if (!quizzes || quizzes.length === 0) {
    return null;
  }

  return (
    <div className="p-8 mt-8 space-y-4">
      {quizzes.map(quiz => (
        <StudentQuizItem key={quiz.id} quiz={quiz} courseId={courseId} />
      ))}
    </div>
  );
}
