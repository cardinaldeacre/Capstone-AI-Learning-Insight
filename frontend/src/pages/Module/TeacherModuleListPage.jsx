// src/pages/Module/ModuleListPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ModuleTable from '@/components/Module/ModuleTable';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import {
  fetchModulesByClass,
  fetchTeacherDeleteModule
} from '@/lib/api/services/moduleService';

export default function TeacherModuleListPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      setIsLoading(true);
      try {
        const data = await fetchModulesByClass(courseId);
        setModules(data);
      } catch (error) {
        console.error('Gagal membuat module: ', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourses();
  }, [courseId]);

  const handleDelete = async moduleId => {
    try {
      await fetchTeacherDeleteModule(moduleId);

      setModules(prev => prev.filter(mod => mod.id !== moduleId));
      alert(`Modul dengan ID ${moduleId} berhasil dihapus`);
    } catch (error) {
      console.error('Gagal menghapus modul:', error);
      alert('Gagal menghapus modul. Silakan coba lagi.');
    }
  };

  const handleCreateClick = () => {
    navigate(`/courses/${courseId}/modules/teacher/create`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manajemen Modul</h1>
        <Button onClick={handleCreateClick}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Modul Baru
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Modul Pembelajaran</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Memuat data modul...</p>
          ) : (
            <ModuleTable modules={modules} onDelete={handleDelete} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
