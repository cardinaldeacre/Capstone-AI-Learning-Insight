import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlayCircle, Clock, Trophy, History, CheckCircle, XCircle } from 'lucide-react';
import { fetchQuizHistory } from '@/lib/api/services/quizService';

const StudentQuizItem = ({ quiz, courseId }) => {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    console.log("quiz", quiz)

    useEffect(() => {
        const loadHistory = async () => {
            if (quiz?.id) {
                const data = await fetchQuizHistory(quiz.id);
                setHistory(data || []);
                setLoading(false);
            }
        };
        loadHistory();
    }, [quiz]);

    const bestScore = history.length > 0
        ? Math.max(...history.map(h => h.score))
        : 0;

    const isPassed = bestScore >= quiz.min_score;

    return (
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <PlayCircle className="w-6 h-6 text-teal-600" />
                <h3 className="text-xl font-bold text-gray-800">{quiz.title}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <Card className="flex flex-col h-full border-none shadow-sm bg-white">
                    <CardHeader className="pb-2 bg-slate-100/50 rounded-t-lg">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-600">
                            <History className="w-4 h-4" /> Attempt History
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="p-4 grow">
                        {loading ? (
                            <p className="text-sm text-gray-400 text-center py-4">Loading history...</p>
                        ) : history.length > 0 ? (
                            <ScrollArea className="h-[120px] pr-4">
                                <ul className="space-y-3">
                                    {history.map((attempt, idx) => (
                                        <li key={attempt.id} className="flex justify-between items-center text-sm border-b pb-2 last:border-0">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-gray-400">
                                                    {new Date(attempt.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                <span className={`font-medium text-xs ${attempt.score >= quiz.min_score ? 'text-green-600' : 'text-red-500'}`}>
                                                    {attempt.score >= quiz.min_score ? 'Passed' : 'Not Passed'}
                                                </span>
                                            </div>
                                            <span className="font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">
                                                {Math.round(attempt.score)}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </ScrollArea>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 text-sm py-4">
                                <p>History is empty</p>
                                <p className="text-xs">Challenge yourself by attempting the quiz!</p>
                            </div>
                        )}
                    </CardContent>

                    {history.length > 0 && (
                        <div className="p-3 bg-slate-50 border-t flex justify-between items-center text-sm">
                            <span className="text-slate-500">Best Score:</span>
                            <Badge variant={isPassed ? "default" : "secondary"} className={isPassed ? "bg-green-600" : ""}>
                                {Math.round(bestScore)}
                            </Badge>
                        </div>
                    )}
                </Card>

                <Card className="flex flex-col justify-between border-l-4 border-l-teal-500 shadow-md">
                    <div>
                        <CardHeader>
                            <CardTitle className="text-lg">Quiz Details</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <div className="p-2 bg-blue-50 rounded-full text-blue-600">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Duration</p>
                                    <p className="font-semibold">{quiz.timer} Minutes</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <div className="p-2 bg-yellow-50 rounded-full text-yellow-600">
                                    <Trophy className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Minimum Passing Score</p>
                                    <p className="font-semibold">{quiz.min_score}</p>
                                </div>
                            </div>
                        </CardContent>
                    </div>

                    <CardFooter>
                        <Button
                            className="w-full bg-teal-600 hover:bg-teal-700 text-white gap-2 shadow-lg shadow-teal-200"
                            onClick={() => navigate(`/courses/${courseId}/quiz/${quiz.id}/take`)}
                        >
                            {history.length > 0 ? "Try Again" : "Start Quiz"}
                            <PlayCircle className="w-4 h-4" />
                        </Button>
                    </CardFooter>
                </Card>

            </div>

        </div>
    );
};

export default StudentQuizItem;