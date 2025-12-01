import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Progress } from "@/components/ui/progress"
import { fetchFinishedCourses } from "@/lib/api/services/classEnrolmentService"
import { fetchCourseStudentList } from "@/lib/api/services/courseService"
import { useEffect, useState } from "react"

export default function SectionCard() {
    const [progress, setProgress] = useState(75)
    const [MyCourse, setMyCourse] = useState([]);
    const [finishedCourse, setFinishedCourse] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'))
    const userId = user?.id;
    const role = user?.role;

    useEffect(() => {
        const loadCourses = async () => {
            try {
                const data = await fetchCourseStudentList(role, userId);
                setMyCourse(data)
            } catch (error) {
                console.error("Error loading courses:", error.message);
            }
        }

        const loadFinishedCourses = async () => {
            try {
                const data = await fetchFinishedCourses();
                setFinishedCourse(data)
            } catch (error) {
                console.error("Error loading courses:", error.message);
            }
        }

        loadCourses();
        loadFinishedCourses();

        const timer = setTimeout(() => setProgress(66), 500)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="grid grid-cols-1 shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-2">
            <div>
                <h1 className="text-2xl px-6 font-semibold">
                    Course Progress
                </h1>
                <Card className="@container/card">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-2xl">
                            Course Name
                        </CardTitle>
                        <CardAction>
                            <Badge variant="outline">
                                Progress75%
                            </Badge>
                        </CardAction>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1 text-sm">
                        <div className="line-clamp-1 flex gap-2 font-medium">
                            Course description, lorem ipsum
                        </div>
                        <Progress value={progress} className='w-100%' />
                    </CardFooter>
                </Card>
                {MyCourse.map((course) => (
                    <Card key={course.id} className="@container/card">
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-2xl">
                                {course.title}
                            </CardTitle>
                            <CardAction>
                                <Badge variant="outline">
                                    Progress75%
                                </Badge>
                            </CardAction>
                        </CardHeader>
                        <CardFooter className="flex-col items-start gap-1 text-sm">
                            <div className="line-clamp-1 flex gap-2 font-medium">
                                {course.description}
                            </div>
                            <Progress value={progress} className='w-100%' />
                        </CardFooter>
                    </Card>
                ))}
            </div>
            <div>
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
