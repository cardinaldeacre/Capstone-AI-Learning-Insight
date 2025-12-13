import { fetchCourseList } from "@/lib/api/services/courseService";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, Badge, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Link } from "react-router";

export default function CourseAds() {
    const [latestCourses, setLatestCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const plugin = useRef(
        Autoplay({
            delay: 2300,
            stopOnInteraction: true,
            stopOnMouseEnter: true,
        })
    );

    useEffect(() => {
        const loadData = async () => {
            try {

                const data = await fetchCourseList();
                const courses = Array.isArray(data) ? data : data.data || [];

                const sorted = courses.sort((a, b) => {
                    const dateA = new Date(a.created_at || 0);
                    const dateB = new Date(b.created_at || 0);
                    return dateB - dateA;
                })

                setLatestCourses(sorted.slice(0, 5));
            } catch (error) {
                console.error('Failed to load Ads', error);
            } finally {
                setLoading(false)
            }
        }

        loadData();
    }, []);

    if (loading) {
        return (
            <div className="flex h-48 w-full items-center justify-center rounded-xl border bg-muted/20">
                <Loader2 className="h-6 w-6 animate-spin -600" />
            </div>
        )
    }

    if (latestCourses.length === 0) return null;

    return (
        <div className="w-full">
            <Carousel
                plugins={[plugin.current]}
                className="w-full"
                options={{ loop: true }}
                onMouseEnter={() => plugin.current.stop()}
                onMouseLeave={() => plugin.current.play()}
            >
                <CarouselContent>
                    {latestCourses.map((course) => (
                        <CarouselItem key={course.id}>
                            <div className="p-1">
                                <Card className="border-2 border-neutral-200 shadow-none bg-linear-to-r from-neutral-50 to-neutral-100 rounded-xl overflow-hidden relative">
                                    <div className="absolute top-0 right-0 p-10 opacity-10">
                                        <div className="w-32 h-32 rounded-full bg-white blur-2xl"></div>
                                    </div>

                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <Badge className="bg-white/20 hover:bg-white/30 border-none mb-2">
                                                New Course!
                                            </Badge>
                                            <span className="text-xs -700 opacity-80">
                                                {new Date(course.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <CardTitle className="text-2xl font-bold line-clamp-1">
                                            {course.title}
                                        </CardTitle>
                                        <CardDescription className="-100 line-clamp-1">
                                            Mentor: {course.teacher_name || "Expert Mentor"}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent>
                                        <p className="text-sm -50 line-clamp-2">
                                            {course.description || "Pelajari materi terbaru ini untuk meningkatkan skill kamu."}
                                        </p>
                                    </CardContent>

                                    <CardFooter>
                                        <Button
                                            asChild
                                            variant="secondary"
                                            className="w-full bg-white -700 hover:bg-teal-50 font-semibold"
                                        >
                                            <Link to={`/courses/${course.id}`}>
                                                Get To Course <ArrowRight className="ml-2 w-4 h-4" />
                                            </Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
            </Carousel>
        </div>
    );
} 