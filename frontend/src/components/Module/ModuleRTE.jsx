import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
// Hapus: import Italic dari sini, karena kita akan menggunakan versi StarterKit
import Heading from '@tiptap/extension-heading';

import {
  Bold,
  Italic as ItalicIcon,
  Heading as HeadingIcon,
  Undo,
  Redo
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ModuleRTE({
  initialContent = '',
  onEditorReady,
  onContentBlur
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // PERBAIKAN: Set italic: true agar Italic berfungsi melalui StarterKit
        italic: true, 
        // StarterKit menyertakan Bold secara default, tapi kita memastikan Italic diaktifkan
        heading: false // Heading dikonfigurasi secara terpisah di bawah
      }),
      // Hapus Italic dari list ekstensi di sini untuk menghindari konflik
      Heading.configure({
        levels: [1, 2, 3]
      })
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        // Pastikan class 'tiptap' ada untuk CSS styling global
        class: 'min-h-[300px] p-4 focus:outline-none tiptap' 
      }
    }
  });

  useEffect(() => {
    if (!editor) return;

    onEditorReady?.(editor);

    const handleBlur = () => {
      try {
        const html = editor.getHTML();
        onContentBlur?.(html);
      } catch (e) {
        console.error(e);
      }
    };

    editor.on('blur', handleBlur);
    return () => editor.off('blur', handleBlur);
  }, [editor, onEditorReady, onContentBlur]); // Menambahkan dependencies

  if (!editor) return null;

  return (
    <div className="rounded-md border border-input bg-background shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b p-2">
        {/* Bold */}
        <Button
          asChild
          size="icon"
          variant="ghost"
          className={editor.isActive('bold') ? 'bg-muted' : ''}
        >
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="w-4 h-4" />
          </button>
        </Button>

        {/* Italic */}
        <Button
          asChild
          size="icon"
          variant="ghost"
          className={editor.isActive('italic') ? 'bg-muted' : ''}
        >
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <ItalicIcon className="w-4 h-4" />
          </button>
        </Button>

        {/* Heading 3 */}
        <Button
          asChild
          size="icon"
          variant="ghost"
          className={editor.isActive('heading', { level: 3 }) ? 'bg-muted' : ''}
        >
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
          >
            <HeadingIcon className="w-4 h-4" />
          </button>
        </Button>

        <div className="mx-2 w-px h-6 bg-gray-200" />

        {/* Undo */}
        <Button
          asChild
          size="icon"
          variant="ghost"
          disabled={!editor.can().undo()}
        >
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
          >
            <Undo className="w-4 h-4" />
          </button>
        </Button>

        {/* Redo */}
        <Button
          asChild
          size="icon"
          variant="ghost"
          disabled={!editor.can().redo()}
        >
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
          >
            <Redo className="w-4 h-4" />
          </button>
        </Button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}