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
  const editor = useEditor(
    {
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
      // Pass dependencies as the second argument to useEditor
    }
    // REMOVED [content] dependency array
  );

  useEffect(() => {
    if (editor) {
      onEditorReady(editor);
    }
    // Ensure onEditorReady is called if the editor instance is recreated due to deps change
  }, [editor, onEditorReady]);

  // RESTORED the useEffect that manually calls editor.commands.setContent
  useEffect(() => {
    const isFocused = editor?.isFocused;
    // Only sync content from props if the editor is NOT focused.
    // This prevents the effect from running and potentially causing loops
    // when the change originates from user input within the editor itself.
    if (editor && !isFocused && content !== editor.getHTML()) {
      editor.commands.setContent(content, false);
    }
    // We depend on editor instance and content prop. Focus state is read inside.
  }, [editor, content]);

  return (
    <div className="w-full h-full">
      <div className="h-full p-4">
        {" "}
        {/* Added overflow-y-auto */}
        {editor && (
          <EditorContent
            editor={editor}
            className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none max-w-none" /* Removed h-full */
          />
        )}
      </div>
    </div>
  );
}
