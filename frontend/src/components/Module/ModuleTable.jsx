// src/components/Module/ModuleTable.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'; // Shadcn Table
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'; // Shadcn DropdownMenu
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog'; // Shadcn Dialog

/**
 * Komponen untuk menampilkan daftar modul dalam bentuk tabel.
 * @param {array} modules - Array data modul
 * @param {function} onDelete - Handler untuk menghapus modul
 */
export default function ModuleTable({ modules = [], onDelete }) {
  const navigate = useNavigate();

  // Handler untuk mengarahkan ke halaman edit
  const handleEdit = moduleId => {
    navigate(`/admin/modules/edit/${moduleId}`); // Rute akan dikonfigurasi di Tahap 5
  };

  // Format tanggal (contoh sederhana)
  const formatDate = dateString => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Judul Modul</TableHead>
          <TableHead>Dibuat Pada</TableHead>
          <TableHead className="text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {modules.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="h-24 text-center">
              Belum ada Modul.
            </TableCell>
          </TableRow>
        ) : (
          modules.map(module => (
            <TableRow key={module.id}>
              <TableCell className="font-medium truncate max-w-[100px]">
                {module.id}
              </TableCell>
              <TableCell>{module.title}</TableCell>
              <TableCell>{formatDate(module.createdAt)}</TableCell>
              <TableCell className="text-right">
                {/* Dropdown Menu untuk Aksi */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Buka menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => handleEdit(module.id)}
                      className="cursor-pointer"
                    >
                      <Pencil className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />

                    {/* Dialog Konfirmasi Hapus */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <DropdownMenuItem
                          className="cursor-pointer text-red-600"
                          onSelect={e => e.preventDefault()}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Hapus
                        </DropdownMenuItem>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
                          <DialogDescription>
                            Apakah Anda yakin ingin menghapus modul "
                            {module.title}"? Aksi ini tidak dapat dibatalkan.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Batal</Button>
                          </DialogClose>
                          <Button
                            variant="destructive"
                            onClick={() => onDelete(module.id)}
                          >
                            Hapus
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
