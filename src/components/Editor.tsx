import { EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { useEffect, useState } from "react";
import { Editor as TipTapEditor } from "@tiptap/core";

const lowlight = createLowlight(common);

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  editor: TipTapEditor | null;
  setEditor: (editor: TipTapEditor) => void;
}

export default function Editor({
  content,
  onChange,
  editor,
  setEditor,
}: EditorProps) {
  const [, setSelectionUpdate] = useState(0);

  useEffect(() => {
    if (!editor) {
      const newEditor = new TipTapEditor({
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

      // Add selection change listener
      newEditor.on("selectionUpdate", () => {
        setSelectionUpdate((prev) => prev + 1);
      });

      setEditor(newEditor);
    }
  }, [editor, setEditor, content, onChange]);

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full h-full">
      <div className="h-full p-4">
        <EditorContent
          editor={editor}
          className="h-full prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none max-w-none"
        />
      </div>
    </div>
  );
}
