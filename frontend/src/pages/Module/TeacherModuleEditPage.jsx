// src/pages/Module/ModuleEditPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ModuleForm from '@/components/Module/ModuleForm';
import {
  fetchTeacherUpdateModule,
  fetchgetModuleById
} from '@/lib/api/services/moduleService';

export default function TeacherModuleEditPage() {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchgetModuleById(moduleId);
        if (data) {
          setInitialData(data);
        } else {
          alert('Modul tidak ditemukan');
          navigate(`/courses/${courseId}/modules/teacher`);
        }
      } catch (error) {
        console.error('gagal memuat module: ', error);
        alert('terjadi kesalahan saat memuat modul');
        navigate(`/courses/${courseId}/modules/teacher`);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [moduleId, courseId, navigate]);

  const handleSubmit = async formData => {
    setIsSubmitting(true);
    try {
      const dataToSend = {
        title: formData.title,
        content: formData.content,
        order_number: formData.order_number
      };

      const updatedModule = await fetchTeacherUpdateModule(
        moduleId,
        dataToSend
      );
      console.log(`Module "${updatedModule.title}" berhasil diupdate`);
      navigate('/courses');
    } catch (error) {
      console.error('gagal memperbarui module: ', error);
      alert('terjadi kesalahan saat memperbarui modul');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="p-6">Memuat data modul...</div>; // Ganti dengan Skeleton
  }

  if (!initialData) {
    return <div className="p-6">Gagal memuat modul atau modul tidak ada.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Edit Modul: {initialData.title}
      </h1>
      <ModuleForm
        initialData={initialData}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
}
