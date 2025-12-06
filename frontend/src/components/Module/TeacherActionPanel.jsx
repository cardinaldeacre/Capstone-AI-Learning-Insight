import { useNavigate } from "react-router";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { ArrowRight, Clock, Edit, ListChecks, Trophy } from "lucide-react";

export default function TeacherActionPanel({ quizzes, courseId, onEditModule }) {
    const nav = useNavigate();

    return (
        <div className="mt-8 p-6 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <span className="bg-teal-100 p-1 rounded">👨‍🏫</span> Teacher Panel
                </h3>
                <Button variant="outline" size="sm" onClick={onEditModule} className="gap-2">
                    <Edit className="w-4 h-4" /> Edit Content
                </Button>
            </div>

            <hr className="border-slate-200" />

            <div className="space-y-3">
                <h4 className="text-sm font-medium text-slate-500">Quiz:</h4>
                {quizzes.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3">
                        {quizzes.map((quiz) => (
                            <Card key={quiz.id} className="p-3 flex justify-between items-center bg-white">
                                <div className="text-sm">
                                    <p className="font-semibold text-slate-700">{quiz.title}</p>
                                    <p className="text-xs text-slate-500 flex gap-2 mt-1">
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {quiz.timer}m</span>
                                        <span className="flex items-center gap-1"><Trophy className="w-3 h-3" /> min score: {quiz.min_score}</span>
                                    </p>
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="gap-2 text-slate-600 hover:text-teal-600 hover:border-teal-600"
                                    onClick={() => nav(`/courses/${courseId}/quiz/${quiz.id}`)}
                                >
                                    <ListChecks className="w-4 h-4" /> Manage Quiz
                                </Button>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-slate-400 italic">No any quiz yet</p>
                )}
            </div>
        </div>
    );
}