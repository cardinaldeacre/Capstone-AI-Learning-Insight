import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { fetchCourseModules } from "@/lib/api/services/courseService";
import { createQuiz } from "@/lib/api/services/quizService";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from 'sonner'

export default function AppendQuizPage() {
    const { courseId } = useParams();
    const nav = useNavigate();

    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        module_id: '',
        title: '',
        timer: '',
        min_score: ''
    });

    useEffect(() => {
        const loadModule = async () => {
            try {
                const data = await fetchCourseModules(courseId);
                setModules(data || []);
            } catch (error) {
                toast({
                    variant: 'destruction',
                    title: 'Fail to load module',
                    description: 'Ensure you have create a module for this course'
                })
            } finally {
                setLoading(false)
            }
        }

        loadModule();
    }, [courseId, toast]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    const handleModuleChange = (value) => {
        setFormData((prev) => ({ ...prev, module_id: value }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!formData.module_id || !formData.timer || !formData.title) {
            toast({
                variant: 'destructive',
                title: 'Data not complete',
                description: 'Please fill the module, title, and timer'
            });
            setIsSubmitting(false);
            return;
        }

        try {
            const payload = {
                module_id: parseInt(formData.module_id),
                title: formData.title,
                timer: parseInt(formData.timer),
                min_score: formData.min_score ? parseInt(formData.min_score) : null
            }

            await createQuiz(payload);
            toast({
                title: 'Quiz Created',
                description: 'Now you can create question!',
                className: "bg-green-500 text-white",
            })
            nav(`/courses/${courseId}/modules`);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Failed to create quiz",
                description: error.message,
            });
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-2xl mx-auto space-y-6">

                <div className="flex items-center gap-4 mb-6">
                    <Link
                        to={`/courses/${courseId}/modules`}
                        className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">Create New Quiz</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Quiz Detail</CardTitle>
                        <CardDescription>
                            Fill quiz description before append the questions
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">

                            <div className="space-y-2">
                                <Label htmlFor="module_id">Choose Module</Label>
                                <Select onValueChange={handleModuleChange} value={formData.module_id}>
                                    <SelectTrigger id="module_id" disabled={loading}>
                                        <SelectValue placeholder={loading ? "Loading module..." : "Choose relational module"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {modules.map((mod) => (
                                            <SelectItem key={mod.id} value={String(mod.id)}>
                                                {mod.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {modules.length === 0 && !loading && (
                                    <p className="text-xs text-red-500">
                                        This course has no module yet, create at least 1 moduel
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="title">Quiz Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    placeholder="Ex: Chapter 1 Evaluation Quiz"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="timer">Duration (Minute)</Label>
                                    <Input
                                        id="timer"
                                        name="timer"
                                        type="number"
                                        placeholder="Ex: 30"
                                        min="1"
                                        value={formData.timer}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="min_score">Minimum score (Optional)</Label>
                                    <Input
                                        id="min_score"
                                        name="min_score"
                                        type="number"
                                        placeholder="Ex: 75"
                                        min="0"
                                        max="100"
                                        value={formData.min_score}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <Button
                                    type="submit"
                                    className="bg-teal-600 hover:bg-teal-700 w-full md:w-auto"
                                    disabled={isSubmitting || modules.length === 0}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" /> Save & Continue
                                        </>
                                    )}
                                </Button>
                            </div>

                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}