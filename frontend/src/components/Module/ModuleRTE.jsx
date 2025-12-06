// src/components/Module/ModuleRTE.jsx
import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, Heading, Undo, Redo } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ModuleRTE({
  initialContent = '',
  onEditorReady,
  onContentBlur // new optional prop
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    editorProps: {
      attributes: {
        class:
          'min-h-[300px] prose dark:prose-invert max-w-none p-4 focus:outline-none'
      }
    }
  });

  // Kirim instance editor ke parent
  useEffect(() => {
    if (editor) {
      onEditorReady?.(editor);

      // register blur handler once
      const handleBlur = () => {
        try {
          const html = editor.getHTML();
          onContentBlur?.(html);
        } catch (e) {
          console.error(e);
        }
      };

      editor.on('blur', handleBlur);

      return () => {
        editor.off('blur', handleBlur);
      };
    }
  }, [editor, onEditorReady, onContentBlur]);

  if (!editor) return null;

  return (
    <div className="rounded-md border border-input bg-background shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b p-2">
        <Button
          type="button"
          onMouseDown={e => {
            e.preventDefault();
            editor.chain().focus().toggleBold().run();
          }}
          size="icon"
          variant="ghost"
          className={editor.isActive('bold') ? 'bg-muted' : ''}
        >
          <Bold className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          onMouseDown={e => {
            e.preventDefault();
            editor.chain().focus().toggleItalic().run();
          }}
          size="icon"
          variant="ghost"
          className={editor.isActive('italic') ? 'bg-muted' : ''}
        >
          <Italic className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          onMouseDown={e => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 3 }).run();
          }}
          size="icon"
          variant="ghost"
          className={editor.isActive('heading', { level: 3 }) ? 'bg-muted' : ''}
        >
          <Heading className="w-4 h-4" />
        </Button>

        <div className="mx-2 w-px h-6 bg-gray-200" />

        <Button
          type="button"
          onMouseDown={e => {
            e.preventDefault();
            editor.chain().focus().undo().run();
          }}
          disabled={!editor.can().undo()}
          size="icon"
          variant="ghost"
        >
          <Undo className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          onMouseDown={e => {
            e.preventDefault();
            editor.chain().focus().redo().run();
          }}
          disabled={!editor.can().redo()}
          size="icon"
          variant="ghost"
        >
          <Redo className="w-4 h-4" />
        </Button>
      </div>

      {/* Editor content */}
      <EditorContent editor={editor} />
    </div>
  );
}
