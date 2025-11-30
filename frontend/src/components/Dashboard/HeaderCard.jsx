import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    CardContent
} from "@/components/ui/card"

export default function HeaderCard() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                <div className="bg-muted/50 aspect-video rounded-xl" >
                    <CardTitle>
                        Iklan Courses
                    </CardTitle>
                </div>
                <div className="bg-muted/50 aspect-video rounded-xl" >
                    <CardTitle>
                        AI Learning Insight
                    </CardTitle>
                </div>
            </div >
        </div >
    )
}