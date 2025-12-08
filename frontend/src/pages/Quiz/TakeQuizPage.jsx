import { Button } from "@/components/ui/button";
import { fetchQuizDataForStudent, submitStudentAnswers } from "@/lib/api/services/quizService";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

export default function TakeQuizPage() {
    const { quizId } = useParams();
    const nav = useNavigate();

    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(null);

    useEffect(() => {
        const loadQuizData = async () => {
            try {
                const data = await fetchQuizDataForStudent(quizId);
                setQuestions(data.questions || []);
                if (data.timer) {
                    setTimeLeft(data.timer * 60);
                }
            } catch (error) {
                toast.error("Fail load quiz.");
                console.error(error)
            } finally {
                setLoading(false);
            }
        };
        loadQuizData();
    }, [quizId, nav]);

    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0) return;

        const intervalId = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(intervalId);

                    return 0;
                }

                return prevTime - 1;
            })
        }, 1000);

        return () => clearInterval(intervalId);
    }, [timeLeft]);

    const formatTimer = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleSelectAnswer = (questionId, optionId) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: optionId
        }));
    }

    const totalQ = questions.length;
    const isFirstQ = currentQuestionIdx === 0;
    const isLastQ = currentQuestionIdx === totalQ - 1;

    const handleNext = () => {
        if (!isLastQ) {
            setCurrentQuestionIdx(prev => prev + 1);
        }
    }

    const handlePrevious = () => {
        if (!isFirstQ) {
            setCurrentQuestionIdx(prev => prev - 1);
        }
    }

    const handleSubmitQuiz = async () => {
        if (Object.keys(answers).length < totalQ) {
            toast.warning("There's a question had no answered!", {
                description: `You have answered ${Object.keys(answers).length} from ${totalQ} question.`
            });
            return;
        }

        if (!confirm("Apakah Anda yakin ingin menyelesaikan kuis? Jawaban tidak bisa diubah setelah submit.")) return;

        setLoading(true);
        try {
            const submissionResult = await submitStudentAnswers(quizId, answers);

            toast.success("Kuis Berhasil Disubmit!", {
                description: `Nilai Anda: ${submissionResult.score || 'Menunggu Penilaian'}`
            });

            // Redirect ke halaman hasil kuis
            nav(`/quiz-result/${quizId}`);

        } catch (error) {
            toast.error("Gagal mengirim jawaban.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Memuat Kuis...</div>;
    }

    if (totalQ === 0) {
        return <div className="p-8 text-center text-red-500">Kuis ini belum memiliki soal.</div>;
    }

    const currentQuestion = questions[currentQuestionIdx];
    const selectedAnswerId = answers[currentQuestion.id];

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg my-8">
            <h1 className="text-2xl font-bold mb-4 border-b pb-2">Kerjakan Kuis: {quizId}</h1>

            {timeLeft !== null && (
                <div className={`flex items-center gap-2 font-mono text-xl font-bold px-4 py-2 rounded-md ${timeLeft < 60 ? 'bg-red-100 text-red-600' : 'bg-teal-50 text-teal-700'}`}>
                    <Clock className="w-5 h-5" />
                    {formatTimer(timeLeft)}
                </div>
            )}

            <div className="text-sm text-gray-600 mb-4">
                Soal {currentQuestionIdx + 1} dari {totalQ}
            </div>

            <div className="mb-6">
                <p className="text-lg font-semibold mb-3">{currentQuestion.question_text}</p>

                {/* TODO: GANTI DENGAN KOMPONEN QuizQuestionComponent 
                  yang me-map currentQuestion.options 
                */}
                <div className="space-y-3">
                    {/* Placeholder untuk Opsi Jawaban */}
                    {currentQuestion.options.map(option => (
                        <div
                            key={option.id}
                            className={`p-3 border rounded cursor-pointer transition 
                                ${selectedAnswerId === option.id ? 'bg-teal-500 text-white border-teal-600' : 'hover:bg-gray-100'}`
                            }
                            onClick={() => handleSelectAnswer(currentQuestion.id, option.id)}
                        >
                            {option.option_text}
                        </div>
                    ))}
                </div>
            </div>

            {/* --- Kontrol Navigasi --- */}
            <div className="flex justify-between pt-4 border-t">
                <Button onClick={handlePrevious} disabled={isFirstQ} variant="outline">
                    Sebelumnya
                </Button>

                {isLastQ ? (
                    <Button onClick={handleSubmitQuiz} className="bg-green-600 hover:bg-green-700">
                        Selesai & Submit
                    </Button>
                ) : (
                    <Button onClick={handleNext} className="bg-teal-600 hover:bg-teal-700">
                        Selanjutnya
                    </Button>
                )}
            </div>
        </div>
    );
}