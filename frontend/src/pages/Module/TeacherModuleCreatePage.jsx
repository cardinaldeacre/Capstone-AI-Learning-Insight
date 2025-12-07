// src/pages/Module/ModuleCreatePage.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ModuleForm from '@/components/Module/ModuleForm';
import {
  fetchModulesByClass,
  fetchTeacherCreateModule
} from '@/lib/api/services/moduleService';

export default function TeacherModuleCreatePage() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modules, setModules] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchModulesByClass(courseId);
        setModules(data);
      } catch (error) {
        console.error(error);
      }
    };
    load();
  }, [courseId]);

  const handleSubmit = async formData => {
    setIsSubmitting(true);

    try {
      // untuk ngambil order_number
      const lastOrder =
        modules.length > 0 ? Math.max(...modules.map(m => m.order_number)) : 0;

      const dataToSend = {
        ...formData,
        class_id: Number(courseId),
        order_number: lastOrder + 1
      };

      await fetchTeacherCreateModule(dataToSend);

      alert('Modul berhasil dibuat!');
      navigate(`/courses/${courseId}/modules/teacher`);
    } catch (error) {
      console.error('Gagal membuat modul:', error);
      alert('Gagal membuat modul. Silakan periksa konsol.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Buat Modul Pembelajaran Baru</h1>
      <ModuleForm onSubmit={handleSubmit} isLoading={isSubmitting} />
    </div>
  );
}
