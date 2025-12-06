import { fetchCourseModules } from "@/lib/api/services/courseService";
import { createQuiz } from "@/lib/api/services/quizService";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from 'sonner'

export default function AppendQuizPage() {
    const { courseId } = useParams();
    const nav = useNavigate();

    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        module_id: '',
        title: '',
        timer: '',
        min_score: ''
    });

    useEffect(() => {
        const loadModule = async () => {
            try {
                const data = await fetchCourseModules(courseId);
                setModules(data || []);
            } catch (error) {
                toast({
                    variant: 'destruction',
                    title: 'Fail to load module',
                    description: 'Ensure you have create a module for this course'
                })
            } finally {
                setLoading(false)
            }
        }

        loadModule();
    }, [courseId, toast]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    const handleModuleChange = (value) => {
        setFormData((prev) => ({ ...prev, module_id: value }));
    }

    const handleSubmit = async (e) => {
        e.preventDefaault();
        setIsSubmitting(true);

        if (!formData.module_id || !formData.timer || !formData.title) {
            toast({
                variant: 'destructive',
                title: 'Data not complete',
                description: 'Please fill the module, title, and timer'
            });
            setIsSubmitting(false);
            return;
        }


        try {
            const payload = {
                module_id: parseInt(formData.module_id),
                title: formData.title,
                timer: parseInt(formData.timer),
                min_score: formData.min_score ? parseInt(formData.min_score) : null
            }

            const result = await createQuiz(payload);
            toast({
                title: 'Quiz Created',
                description: 'Now you can create question!',
                className: "bg-green-500 text-white",
            })

        } catch (error) {

        }
    }
}