import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Sparkles} from "lucide-react";
import {ScrollArea} from "@/components/ui/scroll-area.jsx";

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
                <p className="leading-tight">
                    {insight}
                </p>

                {/* Scroll area rekomendasi */}
                <ScrollArea className="min-h-[100px] rounded-md p-3 border border-neutral-200 bg-neutral-50">
                    <p className="text-neutral-700 text-xs leading-relaxed">
                        <span className="font-semibold text-blue-600">Rekomendasi AI:</span><br/><br/>
                        • Lanjutkan modul: <span className="text-blue-500">State Management</span><br/>
                        • Fokus pada topik: <span className="text-blue-500">Async Operations</span><br/>
                        • Durasi belajar idealmu: <span className="text-blue-500">20–30 menit</span> per sesi<br/>
                        • Kurangi pengulangan berlebih di modul 3 — coba metode ringkasan.
                    </p>
                </ScrollArea>

            </CardContent>
        </Card>
    )
}