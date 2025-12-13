import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Sparkles} from "lucide-react";

export default function LearningInsight({insight}) {
    return (
        <Card className="w-full border border-neutral-200 shadow-sm rounded-xl bg-white break-inside-avoid">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-500"/>
                    AI Learning Insight
                </CardTitle>
            </CardHeader>

            <CardContent className="text-sm text-neutral-700 flex flex-col gap-4">

                {/* Insight 1 */}
                <p className="leading-tight mb-4">
                    {insight}
                </p>

            </CardContent>
        </Card>
    )
}