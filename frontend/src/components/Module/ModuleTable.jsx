import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MoreHorizontal, Pencil, PlusCircle, Trash2, Eye, FileQuestion } from 'lucide-react';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';

export default function ModuleTable({ modules = [], onDelete }) {
  const navigate = useNavigate();
  const { courseId } = useParams();

  const handleEdit = moduleId => {
    navigate(`/courses/${courseId}/teacher/modules/edit/${moduleId}`);
  };

  const formatDate = dateString => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  const handleCreateQuiz = (moduleId) => {
    navigate(`/courses/${courseId}/quiz/create`, { state: { moduleId } });
  }

  const handleViewQuiz = (quizId) => {
    navigate(`/courses/${courseId}/quiz/${quizId}`);
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-20 text-center">NO</TableHead>
          <TableHead className="text-left">TITLE</TableHead>
          <TableHead className="text-center">QUIZ STATUS</TableHead>
          <TableHead className="text-center">CREATED AT</TableHead>
          <TableHead className="text-right pr-6">ACTION</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {modules.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
              No modules found. Please create one.
            </TableCell>
          </TableRow>
        ) : (
          modules.map((module, index) => (
            <TableRow key={module.id}>
              <TableCell className="font-medium text-center">
                {index + 1}
              </TableCell>

              <TableCell className="font-medium">
                {module.title}
              </TableCell>

              <TableCell className="text-center">
                {module.quiz ? (
                  <Button
                    onClick={() => handleViewQuiz(module.quiz.id)}
                    variant="outline"
                    className="border-teal-600 text-teal-600 hover:bg-teal-50 gap-2 h-8"
                  >
                    <FileQuestion className="w-4 h-4" />
                    Manage Quiz
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleCreateQuiz(module.id)}
                    className="bg-teal-600 hover:bg-teal-700 text-white gap-2 h-8"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Add Quiz
                  </Button>
                )}
              </TableCell>

              <TableCell className="text-center text-gray-500 text-sm">
                {formatDate(module.created_at || module.createdAt)}
              </TableCell>

              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => handleEdit(module.id)}
                      className="cursor-pointer"
                    >
                      <Pencil className="mr-2 h-4 w-4" /> Edit Module
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />

                    <Dialog>
                      <DialogTrigger asChild>
                        <DropdownMenuItem
                          className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                          onSelect={e => e.preventDefault()}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Module
                        </DropdownMenuItem>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete module "{module.title}"?</DialogTitle>
                          <DialogDescription>
                            This action cannot be undone. This will permanently delete the module and all associated materials.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button
                            variant="destructive"
                            onClick={() => onDelete(module.id)}
                          >
                            Delete
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
