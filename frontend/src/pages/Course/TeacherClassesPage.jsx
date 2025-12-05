// frontend/src/pages/Course/TeacherClassesPage.jsx

import React, { useState, useEffect } from 'react';
import {
  fetchCourseStudentList,
  deleteClass
} from '@/lib/api/services/courseService';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  PlusCircle,
  Terminal,
  Edit,
  Trash2,
  BookOpen,
  Users,
  Loader2
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import ClassForm from '@/components/Course/ClassForm';
import { Link } from 'react-router-dom';

export default function TeacherClassesPage() {
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);

  const loadClasses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchCourseStudentList();
      setClasses(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const handleEdit = classItem => {
    setEditingClass(classItem);
    setIsSheetOpen(true);
  };

  const handleDelete = async classId => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus kelas ini? Tindakan ini tidak dapat dibatalkan.')) return;

    try {
      await deleteClass(classId);
      loadClasses();
    } catch (err) {
      alert('Gagal menghapus kelas: ' + err.message);
    }
  };

  const handleOpenCreate = () => {
    setEditingClass(null);
    setIsSheetOpen(true);
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Gagal memuat daftar kelas: {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center pb-4 border-b">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Manajemen Kelas Anda
        </h1>

        <Button onClick={handleOpenCreate}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Buat Kelas Baru
        </Button>
      </header>
      
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>
              {editingClass ? 'Edit Kelas' : 'Buat Kelas Baru'}
            </SheetTitle>
          </SheetHeader>
          <div className="pt-6">
            <ClassForm
            
              initialData={editingClass} 
              isEdit={!!editingClass}
              onSuccess={loadClasses}
              onClose={() => setIsSheetOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>


      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : classes.length === 0 ? (
        <div className="py-10 text-center border-dashed border-2 rounded-xl bg-gray-50">
          <h3 className="text-xl font-semibold text-gray-600">
            Anda belum memiliki kelas.
          </h3>
          <p className="text-muted-foreground mt-2">
            Klik "Buat Kelas Baru" untuk memulai.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border shadow-sm overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judul Kelas</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead className="w-[150px] text-center">
                  Tanggal Dibuat
                </TableHead>
                <TableHead className="w-[200px] text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.map(kelas => (
                <TableRow key={kelas.id || kelas.class_id}>
                  <TableCell className="font-medium max-w-xs">
                    {kelas.title}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-sm truncate">
                    {kelas.description}
                  </TableCell>
                  <TableCell className="text-xs text-center">
                    {new Date(kelas.created_at).toLocaleDateString('id-ID')}
                  </TableCell>
                  <TableCell className="space-x-2 flex justify-center">
                    <Button
                      variant="secondary"
                      size="sm"
                      asChild
                      title="Atur Modul"
                    >
                      <Link to={`/courses/${kelas.id || kelas.class_id}/modules`}>
                        <BookOpen className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(kelas)}
                      title="Edit Kelas"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(kelas.id || kelas.class_id)}
                      title="Hapus Kelas"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}