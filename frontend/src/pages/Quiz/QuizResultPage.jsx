import ModuleSidebar from "@/components/Module/ModuleSIdebar";
import { Button } from "@/components/ui/button";
import { fetchCourseModules } from "@/lib/api/services/courseService";
import { fetchLatestQuizResult } from "@/lib/api/services/quizService";
import { CheckCircle, XCircle } from "lucide-react";
import React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";

export default function QuizResultPage() {
    const { quizId } = useParams();
    const nav = useNavigate();

    const [result, setResult] = useState(null);
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const resultData = await fetchLatestQuizResult(quizId);
                setResult(resultData);

                if (resultData && resultData.class_id) {
                    const modulesData = await fetchCourseModules(resultData.class_id);
                    const sortedModules = (modulesData || []).sort((a, b) => a.order_number - b.order_number);
                    setModules(sortedModules);
                }
            } catch (error) {
                toast.error("Failed getting result", {
                    description: error.message || "Ensure you have finished the quiz"
                });
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [quizId]);

    const handleSidebarSelect = () => {
        if (result?.class_id) {
            nav(`/courses/${result.class_id}/modules`);
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Loading quiz result...</div>;
    }

    if (!result) {
        return <div className="p-8 text-center text-gray-500">Finish the quiz first!</div>;
    }

    const isPassed = result.is_passed;
    const resultColor = isPassed ? 'text-teal-600 bg-teal-50' : 'text-red-600 bg-red-50';
    const resultIcon = isPassed ? CheckCircle : XCircle;

    return (
        <div className="max-w-xl mx-auto my-10 px-8 shadow-2xl rounded-2xl bg-white border border-teal-200">
            <div className="w-80 shrink-0 h-full border-r border-gray-200 bg-white z-20 hidden md:block">
                <ModuleSidebar
                    modules={modules}
                    currentIndex={-1}
                    onSelect={handleSidebarSelect}
                    progressStats={{ completed: 0, total: modules.length, percentage: 0 }}
                />
            </div>
            <div className={`text-center p-6 rounded-xl ${resultColor}`}>
                {React.createElement(resultIcon, { className: 'w-16 h-16 mx-auto mb-4' })}
                <h1 className="text-3xl font-extrabold mb-2">
                    {isPassed ? 'Congratulations! You Passed the quiz' : 'Try again later'}
                </h1>
                <p className="text-lg font-semibold">Result</p>
            </div>

            <div className="mt-6 space-y-4">
                <div className="flex justify-between border-b pb-2">
                    <span className="font-medium text-gray-600">Your score:</span>
                    <span className="text-4xl font-extrabold text-teal-700">{Math.round(result.score)}</span>
                </div>

                <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Minimum score:</span>
                    <span className="font-bold text-lg">{result.min_score || 'N/A'}</span>
                </div>

                <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Submit time:</span>
                    <span className="text-sm">{new Date(result.created_at).toLocaleString()}</span>
                </div>
            </div>

            <div className="mt-8 text-center">
                <Link to={`/courses/${result.class_id}/modules`}>
                    <Button variant="outline" className="w-full">
                        Back to module page
                    </Button>
                </Link>
            </div>
        </div>
    )
}