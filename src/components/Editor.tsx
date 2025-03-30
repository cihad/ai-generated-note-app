import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { useEffect } from "react";
import type { Editor as CoreEditor } from "@tiptap/core"; // Import Editor type

const lowlight = createLowlight(common);

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  onEditorReady: (editor: CoreEditor) => void; // Use imported Editor type
}

export default function Editor({
  content,
  onChange,
  onEditorReady,
}: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Placeholder.configure({
        placeholder: "Write something amazing...",
      }),
      Highlight,
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (editor) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  // Effect to update editor content when the 'content' prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      // Use editor.commands.setContent to update the editor's content
      // The 'false' argument prevents triggering the onUpdate callback for this change
      editor.commands.setContent(content, false);
    }
  }, [editor, content]);

  return (
    <div className="w-full h-full">
      <div className="h-full p-4">
        {editor && (
          <EditorContent
            editor={editor}
            className="h-full prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none max-w-none"
          />
        )}
      </div>
    </div>
  );
}
