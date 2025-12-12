import { BookOpen, FileText, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useEffect, useState } from "react";
import { fetchTeacherStat } from "@/lib/api/services/dashboardService";
import { Skeleton } from "../ui/skeleton";

export default function StatisticCard() {
    const [stats, setStats] = useState({ total_students: 0, total_classes: 0, pending_submissions: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const statsData = await fetchTeacherStat();

                setStats(statsData);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false
                )
            }
        }

        loadStats()
    }, [])

    if (loading) {
        return <div className="p-4"><Skeleton className="h-40 w-full" /></div>;
    }

    return (
        <div className="grid gap-4 md:grid-cols-3">
            {/* Total Classes */}
            <Card className="bg-white border-l-4 border-l-teal-500 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                        Active Courses
                    </CardTitle>
                    <BookOpen className="h-4 w-4 text-teal-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-gray-800">{stats.total_classes}</div>
                    <p className="text-xs text-gray-400 mt-1">Courses you manage</p>
                </CardContent>
            </Card>

            {/* Total Students */}
            <Card className="bg-white border-l-4 border-l-blue-500 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                        Total Students Joined
                    </CardTitle>
                    <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-gray-800">{stats.total_students}</div>
                    <p className="text-xs text-gray-400 mt-1">Across all your classes</p>
                </CardContent>
            </Card>

            {/* Pending Submissions */}
            <Card className="bg-white border-l-4 border-l-orange-500 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                        Needs Grading
                    </CardTitle>
                    <FileText className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-orange-600">{stats.pending_submissions}</div>
                    <p className="text-xs text-gray-400 mt-1">Assignments with 'Submitted' status</p>
                </CardContent>
            </Card>
        </div>

    )
}