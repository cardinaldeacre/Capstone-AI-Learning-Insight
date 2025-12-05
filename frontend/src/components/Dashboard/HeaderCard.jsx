import {
    Card,
    CardHeader,
    CardTitle,
    CardContent
} from "@/components/ui/card"
import { Brain, Sparkles } from "lucide-react"
import { Activity } from "react"
import { ScrollArea } from "../ui/scroll-area"

export default function HeaderCard() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                <div className="bg-muted/50 aspect-video rounded-xl" >
                    <Card className="w-full border border-neutral-200 shadow-sm rounded-xl bg-white">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
                                Iklan Courses
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </div>
                <div className="bg-muted/50 aspect-video rounded-xl" >
                    <Card className="w-full border border-neutral-200 shadow-sm rounded-xl bg-white">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-blue-500" />
                                AI Learning Insight
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="text-sm text-neutral-700 flex flex-col gap-4">

                            {/* Insight 1 */}
                            <div className="flex items-start gap-3">
                                <Brain className="w-5 h-5 text-purple-500" />
                                <p className="leading-tight">
                                    Kemampuan analismu meningkat
                                    <span className="text-purple-600 font-medium"> 12% </span> minggu ini.
                                    Proses memahami pola makin stabil.
                                </p>
                            </div>

                            {/* Insight 2 */}
                            <div className="flex items-start gap-3">
                                <Activity className="w-5 h-5 text-green-500" />
                                <p className="leading-tight">
                                    Kamu lebih cepat memahami materi berbasis visual.
                                    Coba tambahkan video pendek untuk memperkuat pemahamanmu.
                                </p>
                            </div>

                            {/* Scroll area rekomendasi */}
                            <ScrollArea className="min-h-[100px] rounded-md p-3 border border-neutral-200 bg-neutral-50">
                                <p className="text-neutral-700 text-xs leading-relaxed">
                                    <span className="font-semibold text-blue-600">Rekomendasi AI:</span><br /><br />
                                    • Lanjutkan modul: <span className="text-blue-500">State Management</span><br />
                                    • Fokus pada topik: <span className="text-blue-500">Async Operations</span><br />
                                    • Durasi belajar idealmu: <span className="text-blue-500">20–30 menit</span> per sesi<br />
                                    • Kurangi pengulangan berlebih di modul 3 — coba metode ringkasan.
                                </p>
                            </ScrollArea>

                        </CardContent>
                    </Card>

                </div>
            </div >
        </div >
    )
}