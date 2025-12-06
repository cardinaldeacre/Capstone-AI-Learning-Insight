import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { fetchOptionsByQuestion } from "@/lib/api/services/optionService";
import { createFullQuestion, fetchQuestionsByQuiz } from "@/lib/api/services/questionService";
import { fetchQuizById } from "@/lib/api/services/quizService";
import { ArrowLeft, CheckCircle2, Circle, Plus } from "lucide-react";
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router";
import { toast } from 'sonner'

const QuestionItem = ({ question, index }) => {
    const [options, setOptions] = useState([]);

    useEffect(() => {
        fetchOptionsByQuestion(question.id).then(setOptions);
    }, [question.id]);

    return (
        <Card className="mb-4 border-l-4 border-l-teal-400">
            <CardHeader className="py-3 bg-slate-50">
                <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-slate-800">
                        Question {index + 1}: {question.question_text}
                    </h4>
                    {/* delte quesiotn */}
                </div>
            </CardHeader>
            <CardContent className="pt-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {options.map((opt) => (
                        <div key={opt.id} className={`flex items-center gap-2 p-2 rounded border ${opt.is_correct ? 'bg-teal-50 border-teal-200' : 'bg-white border-slate-100'}`}>
                            {opt.is_correct ? <CheckCircle2 className="w-4 h-4 text-teal-600" /> : <Circle className="w-4 h-4 text-slate-300" />}
                            <span className={opt.is_correct ? 'font-medium text-teal-700' : 'text-slate-600'}>{opt.option_text}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default function ManageQuizPage() {
    const { courseId, quizId } = useParams();

    const [quizInfo, setQuizInfo] = useState(null);
    const [questions, setQuestions] = useState(null);

    const [qText, setQText] = useState("");
    const [optionsData, setOptionsData] = useState([
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
    ]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loadData = async () => {
        try {
            const [quiz, qList] = await Promise.all([
                fetchQuizById(quizId),
                fetchQuestionsByQuiz(quizId)
            ])

            setQuizInfo(quiz);
            setQuestions(qList || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, [quizId]);

    // handle input opis
    const handleOptionChange = (idx, val) => {
        const newOptions = [...optionsData];
        newOptions[idx].text = val;
        setOptionsData(newOptions);
    }
    // hanlde kuncu jawban
    const handleCorrectSelect = (idx) => {
        const newOptions = optionsData.map((opt, i) => ({
            ...opt,
            isCorrect: i === idx
        }));
        setOptionsData(newOptions)
    }

    const handleSaveQuestion = async () => {
        if (!qText) return toast({ variant: "destructive", title: "Question empty!" });
        if (optionsData.some(o => !o.text)) return toast({ variant: "destructive", title: "Option cannot be blank" });
        if (!optionsData.some(o => o.isCorrect)) return toast({ variant: "destructive", title: "Choose one correct answer" });

        setIsSubmitting(true);
        try {
            await createFullQuestion(quizId, qText, optionsData);

            toast({ title: "Success", description: "Question created successfully" });
            setIsModalOpen(false);

            setQText("");
            setOptionsData([
                { text: "", isCorrect: false },
                { text: "", isCorrect: false },
                { text: "", isCorrect: false },
                { text: "", isCorrect: false },
            ]);

            loadData();
        } catch (error) {
            toast({ variant: "destructive", title: "Gagal menyimpan soal" });
        } finally {
            setIsSubmitting(false);
        }
    }

    if (loading) return <div className="p-10 text-center">Loading Quiz Data...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-6">

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to={`/courses/${courseId}`} className="p-2 rounded-full hover:bg-gray-200">
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">{quizInfo?.title}</h1>
                            <div className="flex gap-3 text-sm text-gray-500 mt-1">
                                <Badge variant="outline">{quizInfo?.data.timer} Minutes</Badge>
                                <Badge variant="outline">Min score: {quizInfo?.data.min_score}</Badge>
                            </div>
                        </div>
                    </div>

                    {/* Modal Tambah Soal */}
                    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-teal-600 hover:bg-teal-700 text-white gap-2">
                                <Plus
                                    className="w-4 h-4" /> Add Question
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Buat Pertanyaan Baru</DialogTitle>
                            </DialogHeader>

                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label
                                    >Teks Pertanyaan</Label>
                                    <Textarea
                                        placeholder="Tulis soal disini..."
                                        value={qText}
                                        onChange={(e) => setQText(e.target.value)}
                                    />
                                </div>

                                <Separator
                                />

                                <div className="space-y-3">
                                    <Label>Opsi Jawaban (Klik lingkaran untuk set kunci jawaban)</Label>
                                    {optionsData.map((opt, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <button
                                                onClick={() => handleCorrectSelect(idx)}
                                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${opt.isCorrect ? 'border-teal-500 bg-teal-500 text-white' : 'border-slate-300'}`}
                                            >
                                                {opt.isCorrect && <CheckCircle2 className="w-4 h-4" />}
                                            </button>
                                            <Input
                                                placeholder={`Pilihan ${String.fromCharCode(65 + idx)}`}
                                                value={opt.text}
                                                onChange={(e) => handleOptionChange(idx, e.target.value)}
                                                className={opt.isCorrect ? "border-teal-500 bg-teal-50" : ""}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                <Button onClick={handleSaveQuestion} disabled={isSubmitting}>
                                    {isSubmitting ? "Menyimpan..." : "Simpan Soal"}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                <Separator />

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700">List of Question ({questions.length})</h3>

                    {questions.length === 0 ? (
                        <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-lg text-gray-400">
                            No any question yet, create one!
                        </div>
                    ) : (
                        questions.map((q, i) => (
                            <QuestionItem key={q.id} question={q} index={i} />
                        ))
                    )}
                </div>

            </div>
        </div>
    );
}