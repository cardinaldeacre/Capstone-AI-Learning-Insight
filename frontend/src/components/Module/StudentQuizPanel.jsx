import { PlayCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { Card } from "../ui/card";
import { Button } from "../ui/button";

export default function StudentQuizPanel({ quizzes, courseId }) {
    const nav = useNavigate();

    if (quizzes.length === 0) {
        return null;
    }

    return (
        <div className="p-8 mt-8 space-y-4">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <PlayCircle className="w-6 h-6 text-teal-600" />
                Quiz
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2">
                {quizzes.map((quiz) => (
                    <Card key={quiz.id} className="px-4 border-l-4 border-l-teal-500 hover:shadow-md ">
                        <h4 className="font-bold text-lg text-gray-800">{quiz.title}</h4>
                        <p className="text-sm text-gray-500">
                            Waktu: {quiz.timer} Menit • Minimal Nilai: {quiz.min_score}
                        </p>

                        <Button
                            className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                            onClick={() => nav(`/courses/${courseId}/quiz/${quiz.id}/take`)} // 
                        >
                            Mulai Mengerjakan
                        </Button>
                    </Card>
                ))}
            </div>
        </div>
    );
}