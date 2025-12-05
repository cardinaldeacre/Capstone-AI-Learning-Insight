import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardAction,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Progress } from "@/components/ui/progress"
import { fetchFinishedCourses } from "@/lib/api/services/classEnrolmentService"
import { fetchCourseStudentList } from "@/lib/api/services/courseService"
import { useEffect, useState } from "react"
import CourseCard from "../Course/ShortCourseCard"

export default function SectionCard() {
    const [MyCourse, setMyCourse] = useState([]);
    const [finishedCourse, setFinishedCourse] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'))
    const userId = user?.id;
    const role = user?.role;

    useEffect(() => {
        const loadData = async () => {
            try {
                const courseData = await fetchCourseStudentList(role, userId);
                setMyCourse(Array.isArray(courseData) ? courseData : courseData.data || []);

                const finishedData = await fetchFinishedCourses();
                setFinishedCourse(finishedData)
            } catch (error) {
                console.error("Error loading courses:", error.message);
            }
        }
        console.log('test')
        loadData();
    }, [role, userId])

    return (
        <div className="grid grid-cols-1 gap-5 shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-2">
            <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
                <h1 className="text-2xl px-6 font-semibold">
                    Course Progress
                </h1>

                {MyCourse.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 px-6 w-full">
                        {MyCourse.slice(0, 5).map((course) => (
                            <CourseCard key={course.id || course.class_id} course={course} />
                        ))}
                    </div>
                ) : (
                    <p className="px-6 text-gray-500">You have no any classes yet.</p>
                )}
                {MyCourse.length > 5 && (
                    <div className="px-6 mt-6 text-center">
                        <Link className="w-full">
                            Check all Classes
                        </Link>
                    </div>
                )}
            </div>
            <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
                <h1 className="text-2xl px-6 font-semibold mb-4">
                    Class Finished
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-6">
                    {finishedCourse.map((item) => (
                        <Card key={item.class_id} className="@container/card">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-2xl">
                                    {item.title}
                                </CardTitle>

                                <CardAction>
                                    <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-white">
                                        Completed
                                    </Badge>
                                </CardAction>
                            </CardHeader>

                            <div className="px-6 py-2">
                                <p className="line-clamp-2 text-sm text-gray-600">
                                    {item.description}
                                </p>
                            </div>

                            <CardFooter className="flex-col items-start gap-2 text-sm pt-0">
                                <div className="flex justify-between w-full text-xs text-gray-500">
                                    <span>Progress</span>
                                    <span>100%</span>
                                </div>

                                <Progress value={100} className='w-full h-2 bg-green-200' indicatorClassName='bg-green-600' />

                                {item.stats && (
                                    <div className="flex gap-4 text-xs text-gray-500 mt-2">
                                        <span>📚 Modul: **{item.stats.modules}** Selesai</span>
                                        <span>📝 Tugas: **{item.stats.assignments}** Selesai</span>
                                    </div>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
