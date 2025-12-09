import ModuleSidebar from "@/components/Module/ModuleSIdebar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card"; // Asumsi pakai Card dari Shadcn
import { fetchCourseModules } from "@/lib/api/services/courseService";
import { fetchQuizDataForStudent, submitStudentAnswers } from "@/lib/api/services/quizService";
import { Clock, CheckCircle2, Circle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

export default function TakeQuizPage() {
    const { courseId, quizId } = useParams();
    const nav = useNavigate();

    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState([]);
    const [modules, setModules] = useState([]);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(null)
    const [isExitOpen, setIsExitOpen] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [quizData, modulesData] = await Promise.all([
                    fetchQuizDataForStudent(quizId),
                    fetchCourseModules(courseId)
                ])
                setQuestions(quizData.questions || []);
                if (quizData.timer) {
                    setTimeLeft(quizData.timer * 60);
                }

                const sortedModules = (modulesData || []).sort((a, b) => a.order_number - b.order_number);
                setModules(sortedModules)
            } catch (error) {
                toast.error("Failed to fetch quiz.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
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

    const jumpToQuestion = (index) => {
        setCurrentQuestionIdx(index);
    }

    const handleSubmitQuiz = async () => {
        if (Object.keys(answers).length < totalQ) {
            toast.warning("There's a blank answer!", {
                description: `Answered${Object.keys(answers).length} from ${totalQ} Question.`
            });
            return;
        }

        setIsConfirmOpen(true)
    };

    const handleConfirmExit = () => {
        setIsExitOpen(false);
        nav(`/courses/${courseId}/modules`);
    };

    const handleConfirmSubmit = async () => {
        setIsConfirmOpen(false)
        setLoading(true);
        try {
            await submitStudentAnswers(quizId, answers);
            nav(`/quiz-result/${quizId}`);
        } catch (error) {
            toast.error("Gagal mengirim jawaban.");
        } finally {
            setLoading(false);
        }
    }
    if (loading) return <div className="p-10 text-center">Memuat Kuis...</div>;

    const currentQuestion = questions[currentQuestionIdx];
    const selectedAnswerId = answers[currentQuestion?.id];

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="w-80 shrink-0 h-full border-r border-gray-200 bg-white z-20 hidden md:block">
                <ModuleSidebar
                    modules={modules}
                    currentIndex={-1}
                    onSelect={() => setIsExitOpen(true)}
                    progressStats={{ completed: 0, total: modules.length, percentage: 0 }}
                />
            </div>
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative min-w-0">
                <header className="h-16 bg-white border-b border-gray-200 shadow-sm z-10 flex items-center px-6 justify-between flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <h1 className="font-bold text-lg text-gray-800">Ujian: Kuis #{quizId}</h1>
                    </div>

                    {timeLeft !== null && totalQ > 0 && (
                        <div className={`flex items-center gap-2 font-mono text-lg font-bold px-3 py-1.5 rounded-md border ${timeLeft < 60 ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white text-teal-700 border-teal-100'}`}>
                            <Clock className="w-4 h-4" />
                            {formatTimer(timeLeft)}
                        </div>
                    )}
                </header>
                <div className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-8">
                    <div className="max-w-6xl mx-auto pb-20">

                        {totalQ === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50">
                                <p className="text-lg font-medium text-gray-500">Soal tidak ditemukan.</p>
                                <p className="text-sm text-gray-400">Silakan hubungi pengajar Anda.</p>
                                <Button variant="outline" className="mt-4" onClick={() => nav(-1)}>
                                    Kembali
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col-reverse md:flex-row gap-6 items-start">

                                <Card className="w-full md:w-64 shrink-0 p-4 shadow-sm border-gray-200">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Navigasi Soal</h3>
                                    <div className="grid grid-cols-5 gap-2">
                                        {questions.map((q, idx) => {
                                            const isAnswered = answers[q.id] !== undefined;
                                            const isCurrent = currentQuestionIdx === idx;
                                            let btnClass = "border border-gray-200 text-gray-600 hover:bg-gray-100";
                                            if (isAnswered) btnClass = "bg-teal-100 text-teal-700 border-teal-200";
                                            if (isCurrent) btnClass = "bg-teal-600 text-white border-teal-600 ring-2 ring-teal-100";

                                            return (
                                                <button key={q.id} onClick={() => jumpToQuestion(idx)} className={`h-9 w-full rounded text-sm font-semibold transition-all ${btnClass}`}>
                                                    {idx + 1}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </Card>

                                <Card className="flex-1 w-full p-6 shadow-md border-t-4 border-t-teal-500">
                                    <div className="mb-6">
                                        <span className="text-xs font-bold text-gray-400 uppercase">Pertanyaan {currentQuestionIdx + 1}</span>
                                        <p className="text-xl font-medium text-gray-800 mt-2 leading-relaxed">
                                            {currentQuestion?.question_text}
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        {currentQuestion?.options.map((option, idx) => {
                                            const isSelected = selectedAnswerId === option.id;
                                            const alphabet = String.fromCharCode(65 + idx);
                                            return (
                                                <div
                                                    key={option.id}
                                                    onClick={() => handleSelectAnswer(currentQuestion.id, option.id)}
                                                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${isSelected ? 'bg-teal-50 border-teal-500 shadow-sm' : 'bg-white hover:bg-gray-50'}`}
                                                >
                                                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center mr-4 ${isSelected ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-500'}`}>
                                                        {isSelected ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-sm font-bold">{alphabet}</span>}
                                                    </div>
                                                    <span className={`text-base ${isSelected ? 'font-medium text-teal-900' : 'text-gray-700'}`}>{option.option_text}</span>
                                                </div>
                                            )
                                        })}
                                    </div>

                                    <div className="flex justify-between pt-8 mt-8 border-t border-gray-100">
                                        <Button onClick={handlePrevious} disabled={isFirstQ} variant="outline">Sebelumnya</Button>
                                        {isLastQ ? (
                                            <Button onClick={handleSubmitQuiz} className="bg-green-600 hover:bg-green-700 text-white">Selesai</Button>
                                        ) : (
                                            <Button onClick={handleNext} className="bg-teal-600 hover:bg-teal-700 text-white">Selanjutnya</Button>
                                        )}
                                    </div>
                                </Card>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl text-red-600">⚠️ Perhatian: Selesaikan Kuis?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Anda akan mengumpulkan **{totalQ}** jawaban. Setelah dikumpulkan, jawaban tidak dapat diubah lagi.
                            <br />
                            <br />
                            Apakah Anda yakin ingin menyelesaikan kuis ini sekarang?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setIsConfirmOpen(false)}>
                            Batal, Periksa Lagi
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmSubmit}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Ya, Kumpulkan Sekarang
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={isExitOpen} onOpenChange={setIsExitOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-red-600">Keluar dari Kuis?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Peringatan: Jawaban Anda saat ini <strong>mungkin hilang</strong> atau belum tersimpan jika Anda keluar sekarang.
                            <br /><br />
                            Apakah Anda yakin ingin kembali ke halaman materi?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmExit}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            Ya, Keluar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div >
    );
}