import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card"; // Asumsi pakai Card dari Shadcn
import { fetchQuizDataForStudent, submitStudentAnswers } from "@/lib/api/services/quizService";
import { Clock, CheckCircle2, Circle } from "lucide-react";
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

    // --- Load Data ---
    useEffect(() => {
        const loadQuizData = async () => {
            try {
                const data = await fetchQuizDataForStudent(quizId);
                setQuestions(data.questions || []);
                if (data.timer) {
                    setTimeLeft(data.timer * 60);
                }
            } catch (error) {
                toast.error("Gagal memuat kuis.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        loadQuizData();
    }, [quizId, nav]);

    // --- Timer Logic ---
    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0) return;
        const intervalId = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(intervalId);
                    // Opsi: handleSubmitQuiz(); (Auto submit jika waktu habis)
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
        return () => clearInterval(intervalId);
    }, [timeLeft !== null]);

    const formatTimer = (seconds) => {
        if (!seconds || isNaN(seconds)) return "00:00";
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // --- Handlers ---
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
        if (!isLastQ) setCurrentQuestionIdx(prev => prev + 1);
    }

    const handlePrevious = () => {
        if (!isFirstQ) setCurrentQuestionIdx(prev => prev - 1);
    }

    // Fungsi untuk lompat ke soal tertentu dari Map
    const jumpToQuestion = (index) => {
        setCurrentQuestionIdx(index);
    }

    const handleSubmitQuiz = async () => {
        if (Object.keys(answers).length < totalQ) {
            toast.warning("Masih ada soal kosong!", {
                description: `Anda baru menjawab ${Object.keys(answers).length} dari ${totalQ} soal.`
            });
            return;
        }

        if (!confirm("Yakin ingin mengumpulkan jawaban?")) return;

        setLoading(true);
        try {
            const submissionResult = await submitStudentAnswers(quizId, answers);
            toast.success("Kuis Berhasil Disubmit!", {
                description: `Nilai Anda: ${Math.round(submissionResult.score)}`
            });
            nav(`/quiz-result/${quizId}`);
        } catch (error) {
            toast.error("Gagal mengirim jawaban.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Memuat Kuis...</div>;
    if (totalQ === 0) return <div className="p-10 text-center text-red-500">Soal tidak ditemukan.</div>;

    const currentQuestion = questions[currentQuestionIdx];
    const selectedAnswerId = answers[currentQuestion.id];

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">

                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h1 className="text-2xl font-bold text-gray-800">Kuis #{quizId}</h1>

                    {timeLeft !== null && (
                        <div className={`flex items-center gap-2 font-mono text-xl font-bold px-4 py-2 rounded-md border shadow-sm ${timeLeft < 60 ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white text-teal-700 border-teal-100'}`}>
                            <Clock className="w-5 h-5" />
                            {formatTimer(timeLeft)}
                        </div>
                    )}
                </div>

                <div className="flex flex-col-reverse md:flex-row gap-6 items-start">

                    <Card className="w-full md:w-64 shrink-0 p-4 shadow-sm border-gray-200">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Nomor Soal</h3>

                        <div className="grid grid-cols-5 gap-2">
                            {questions.map((q, idx) => {
                                const isAnswered = answers[q.id] !== undefined;
                                const isCurrent = currentQuestionIdx === idx;

                                let btnClass = "border border-gray-200 text-gray-600 hover:bg-gray-100"; // Default (Belum dijawab)
                                if (isAnswered) btnClass = "bg-teal-100 text-teal-700 border-teal-200"; // Sudah dijawab
                                if (isCurrent) btnClass = "bg-teal-600 text-white border-teal-600 ring-2 ring-teal-100"; // Sedang dibuka

                                return (
                                    <button
                                        key={q.id}
                                        onClick={() => jumpToQuestion(idx)}
                                        className={`h-10 w-full rounded-md text-sm font-semibold transition-all ${btnClass}`}
                                    >
                                        {idx + 1}
                                    </button>
                                )
                            })}
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-500">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-teal-600 rounded-sm"></div> Sekarang
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-teal-100 border border-teal-200 rounded-sm"></div> Sudah Dijawab
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-white border border-gray-200 rounded-sm"></div> Belum Dijawab
                            </div>
                        </div>
                    </Card>

                    <Card className="flex-1 w-full p-6 md:p-8 shadow-md border-teal-500 border-t-4">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-sm font-medium text-gray-500">
                                Soal {currentQuestionIdx + 1} dari {totalQ}
                            </span>
                        </div>

                        <div className="mb-8">
                            <p className="text-xl font-medium text-gray-800 leading-relaxed">
                                {currentQuestion.question_text}
                            </p>
                        </div>

                        <div className="space-y-3">
                            {currentQuestion.options.map((option, idx) => {
                                const isSelected = selectedAnswerId === option.id;
                                const alphabet = String.fromCharCode(65 + idx);

                                return (
                                    <div
                                        key={option.id}
                                        onClick={() => handleSelectAnswer(currentQuestion.id, option.id)}
                                        className={`relative flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-200 group
                                            ${isSelected
                                                ? 'bg-teal-50 border-teal-500 shadow-sm'
                                                : 'bg-white border-gray-200 hover:border-teal-300 hover:bg-gray-50'
                                            }`
                                        }
                                    >
                                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center mr-4 transition-colors
                                            ${isSelected ? 'bg-teal-600 border-teal-600 text-white' : 'bg-white border-gray-300 text-gray-500 group-hover:border-teal-400'}`}>
                                            {isSelected ? <CheckCircle2 className="w-5 h-5" /> : <span className="font-semibold text-sm">{alphabet}</span>}
                                        </div>

                                        <span className={`text-base ${isSelected ? 'font-medium text-teal-900' : 'text-gray-700'}`}>
                                            {option.option_text}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="flex justify-between pt-8 mt-8 border-t border-gray-100">
                            <Button
                                onClick={handlePrevious}
                                disabled={isFirstQ}
                                variant="outline"
                                className="px-6"
                            >
                                ← Sebelumnya
                            </Button>

                            {isLastQ ? (
                                <Button
                                    onClick={handleSubmitQuiz}
                                    className="bg-green-600 hover:bg-green-700 text-white px-8 shadow-lg shadow-green-100"
                                >
                                    Selesai & Kumpulkan
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleNext}
                                    className="bg-teal-600 hover:bg-teal-700 text-white px-8"
                                >
                                    Selanjutnya →
                                </Button>
                            )}
                        </div>
                    </Card>

                </div>
            </div>
        </div>
    );
}