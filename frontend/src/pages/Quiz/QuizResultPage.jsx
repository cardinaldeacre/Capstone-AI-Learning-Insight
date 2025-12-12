import { Button } from "@/components/ui/button";
import { fetchLatestQuizResult } from "@/lib/api/services/quizService"; 
import { CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"; 
import { toast } from "sonner";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function QuizResultPage() {
    const { quizId } = useParams();
    

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                
                const resultData = await fetchLatestQuizResult(quizId);
                setResult(resultData);
            } catch (error) {
                toast.error("Failed to load quiz results", { 
                    description: error.message || "Please ensure you have finished the quiz" 
                });
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [quizId]);


    if (loading) {
        return <div className="p-8 text-center">Loading quiz result...</div>; 
    }

    if (!result) {
        return <div className="p-8 text-center text-gray-500">Finish the quiz first!</div>; 
    }

    const isPassed = result.is_passed;
    const resultColor = isPassed ? 'text-teal-700 bg-teal-50' : 'text-red-700 bg-red-50';
    const iconColor = isPassed ? 'text-teal-600' : 'text-red-600';
    const resultIcon = isPassed ? CheckCircle : XCircle;

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
            <Card className="max-w-xl w-full shadow-2xl rounded-2xl border-2 overflow-hidden">
                {/* Result Header */}
                <CardHeader className={`text-center p-8 ${resultColor}`}>
                    {React.createElement(resultIcon, { className: `w-16 h-16 mx-auto mb-4 ${iconColor}` })}
                    <CardTitle className="text-3xl font-extrabold mb-2">
                        {isPassed ? 'CONGRATULATIONS! You Passed the Quiz' : 'FAILED! Try Again Later'} 
                    </CardTitle>
                    <p className="text-lg font-semibold">
                        {isPassed ? 'Your Quiz Results' : 'You did not meet the minimum score.'} 
                    </p>
                </CardHeader>

                <CardContent className="p-6">
                    <div className="space-y-4">
                        {/* Score */}
                        <div className="flex justify-between items-center border-b pb-4">
                            <span className="font-semibold text-xl text-gray-700">Your Score:</span> 
                            <span className={`text-5xl font-extrabold ${isPassed ? 'text-teal-700' : 'text-red-700'}`}>
                                {Math.round(result.score)}
                            </span>
                        </div>

                        {/* Minimum Score */}
                        <div className="flex justify-between border-b border-dashed pb-3">
                            <span className="font-medium text-gray-600">Minimum Passing Score:</span> 
                            <span className="font-bold text-lg text-gray-800">{result.min_score || 'N/A'}</span>
                        </div>

                        {/* Submission Time */}
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Submission Time:</span> 
                            <span className="text-sm text-gray-500">{new Date(result.created_at).toLocaleString('en-US')}</span> 
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="p-6 pt-0">
                    <div className="w-full text-center">
                        <Link to={`/courses/${result.class_id}/modules`}>
                            <Button variant="outline" className="w-full text-teal-600 border-teal-300 hover:bg-teal-50">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Module Page 
                            </Button>
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}