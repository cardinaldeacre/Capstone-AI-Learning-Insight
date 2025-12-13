import {useEffect, useState} from "react";
import CourseAds from "./CourseAds"
import LearningInsight from "@/components/Dashboard/LearningInsight.jsx";
import LearningPattern from "@/components/Dashboard/LearningPattern.jsx";
import TutorialCompletion from "@/components/Dashboard/TutorialCompletion.jsx";
import {fetchLearningInsight} from "@/lib/api/services/dashboardService.js";

export default function HeaderCard() {
    const [insight, setInsight] = useState('');
    const [pattern, setPattern] = useState([]);
    const [completion, setCompletion] = useState([]);
    const [dateRange, setDateRange] = useState('');

    useEffect(() => {
        const loadLearningInsight = async () => {
            try {
                const learningInsightData = await fetchLearningInsight();
                setInsight(learningInsightData.insightText);

                const patternByTime = [];
                for (const session in learningInsightData.patternByTime) {
                    patternByTime.push({
                        session,
                        count: +learningInsightData.patternByTime[session],
                    })
                }
                setPattern(patternByTime);

                const completionByDay = [];
                for (const day in learningInsightData.completionByDay) {
                    completionByDay.push({
                        day,
                        count: +learningInsightData.completionByDay[day],
                    })
                }
                setCompletion(completionByDay);

                const fromDate = new Date(learningInsightData.from);
                const toDate = new Date(learningInsightData.to);
                const options = { day: 'numeric', month: 'short' };
                const formattedFrom = fromDate.toLocaleDateString('en-ID', options);
                const formattedTo = toDate.toLocaleDateString('en-ID', options);
                setDateRange(`${formattedFrom} - ${formattedTo}`);
            } catch (error) {
                console.error(error);
            }
        }

        loadLearningInsight();
    }, []);

    return (
        <div className="columns-1 gap-4 space-y-4 md:px-6 lg:columns-2">
            {!!insight && (
                <>
                    <LearningInsight insight={insight}/>
                    <LearningPattern pattern={pattern} dateRange={dateRange}/>
                    <TutorialCompletion completion={completion} dateRange={dateRange}/>
                </>
            )}
            <section className="bg-muted/50 border-2 border-neutral-200 rounded-xl p-6 break-inside-avoid">
                <h2 className="text-xl font-semibold mb-4">Featured Courses</h2>
                <CourseAds/>
            </section>
        </div>
    )
}