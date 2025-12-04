import { fetchClassProgress } from "@/lib/api/services/moduleProgressService";
import { useEffect, useState } from "react";
import { Card, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Link } from "react-router";

const CardAction = ({ children }) => <div className="ml-auto">{children}</div>;

export default function ShortCourseCard({ course }) {
    const [progressStats, setProgressStats] = useState({
        percentage: 0,
        completed: 0,
        total: 0
    });
    const [loading, setLoading] = useState(true);
    const classId = course.id || course.class_id;

    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            try {
                const response = await fetchClassProgress(classId);
                if (isMounted && response.stats) {
                    setProgressStats(response.stats);
                }
            } catch (error) {
                console.error("Error loading courses:", error.message);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        loadData();
    }, [classId]);

    const isCompleted = progressStats.percentage === 100;
    const badgeText = isCompleted ? "Selesai" : `${progressStats.percentage}% Progress`;
    const badgeVariant = isCompleted ? "default" : "outline";

    return (
        <Link to={`/courses/${classId}`} className="group block h-full w-full">
            <Card
                className="@container/card flex flex-col h-full w-full hover:shadow-md transition-shadow cursor-pointer 
                   bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
            >
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 gap-2">
                    <CardTitle className="text-xl font-semibold tabular-nums line-clamp-2 leading-tight">
                        {course.title}
                    </CardTitle>

                    <CardAction>
                        <Badge variant={badgeVariant} className={isCompleted ? "bg-green-600 hover:bg-green-700" : ""}>
                            {loading ? "..." : badgeText}
                        </Badge>
                    </CardAction>
                </CardHeader>

                <CardFooter className="flex-col items-start gap-3 mt-auto">
                    <div className="w-full space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Learning Progress</span>
                            <span>{progressStats.percentage}%</span>
                        </div>

                        <div
                            className="h-2 rounded-full transition-all duration-1000 bg-teal-600"
                            style={{ width: `${progressStats?.percentage || 0}%` }}
                        ></div>
                    </div>

                    <div className="flex justify-between w-full text-xs text-gray-400">
                        <span>{progressStats.completed}/{progressStats.total} Modul</span>
                        {course.teacher_name && <span>Mentor: {course.teacher_name}</span>}
                    </div>
                </CardFooter>
            </Card>
        </Link>
    );
}   