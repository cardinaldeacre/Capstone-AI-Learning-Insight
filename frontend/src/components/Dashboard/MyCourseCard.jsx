import { Link } from "react-router";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useEffect, useState } from "react";
import { fetchCourseStudentList } from "@/lib/api/services/courseService";
import { Skeleton } from "../ui/skeleton";
import { ArrowRight } from "lucide-react";

export default function MyCourseCard() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCourses = async () => {
            try {
                const data = await fetchCourseStudentList();
                setCourses(Array.isArray(data) ? data : data.data || []);
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        loadCourses();
    })

    if (loading) {
        return <div className="p-4"><Skeleton className="h-40 w-full" /></div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Your Courses</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {courses.length > 0 ? (
                    courses.map((course) => (
                        <Card key={course.id} className="group hover:shadow-md transition-all border-gray-200">
                            <CardHeader>
                                <CardTitle className="line-clamp-1 text-lg group-hover:text-teal-600 transition-colors">
                                    {course.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">
                                    {course.description || "Tidak ada deskripsi"}
                                </p>
                                <Button className="w-full bg-teal-50 text-teal-700 hover:bg-teal-100 hover:text-teal-800 border border-teal-200" asChild>
                                    <Link to={`/courses/${course.id}`}>
                                        Manage Class<ArrowRight className="ml-2 w-4 h-4" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full text-center py-10 bg-gray-50 rounded-xl border border-dashed">
                        <p className="text-gray-500">No any course created yet.</p>
                    </div>
                )}
            </div>
        </div>
    )
}