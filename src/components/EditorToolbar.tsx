import React, { useState, useEffect } from "react"; // Import useState, useEffect
import { Editor } from "@tiptap/core";
import AppButton from "./AppButton";

interface EditorToolbarProps {
  editor: Editor | null;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ editor }) => {
  // Add state to force re-render of the toolbar itself
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!editor) {
      return;
    }

    // Function to force re-render the toolbar
    const forceToolbarUpdate = () => setTick((tick) => tick + 1);

    // Listen for transactions or selection updates to trigger toolbar re-render
    // 'transaction' is more comprehensive, ensuring updates on content changes too
    editor.on("transaction", forceToolbarUpdate);

    // Initial update
    forceToolbarUpdate();

    // Cleanup listener
    return () => {
      editor.off("transaction", forceToolbarUpdate);
    };
  }, [editor]); // Re-run effect if editor instance changes

  if (!editor) {
    return null;
  }

  // Check if editor is destroyed before accessing properties/methods
  if (editor.isDestroyed) {
    return null;
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex items-center justify-center gap-1 min-w-max">
        <AppButton
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={
            editor.isActive("bold")
              ? "bg-blue-500 text-white dark:bg-blue-700"
              : ""
          }
          tooltip="Bold (Ctrl+B)"
        >
          <span className="font-bold">B</span>
        </AppButton>

        <AppButton
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={
            editor.isActive("italic")
              ? "bg-blue-500 text-white dark:bg-blue-700"
              : ""
          }
          tooltip="Italic (Ctrl+I)"
        >
          <span className="italic">I</span>
        </AppButton>

        <AppButton
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={
            editor.isActive("strike")
              ? "bg-blue-500 text-white dark:bg-blue-700"
              : ""
          }
          tooltip="Strikethrough (Ctrl+Shift+X)"
        >
          <span className="line-through">S</span>
        </AppButton>

        <div className="w-px bg-gray-200 mx-2" />

        <AppButton
          variant="ghost"
          size="icon"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive("heading", { level: 1 })
              ? "bg-blue-500 text-white dark:bg-blue-700"
              : ""
          }
          tooltip="Heading 1 (Ctrl+Alt+1)"
        >
          H1
        </AppButton>

        <AppButton
          variant="ghost"
          size="icon"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive("heading", { level: 2 })
              ? "bg-blue-500 text-white dark:bg-blue-700"
              : ""
          }
          tooltip="Heading 2 (Ctrl+Alt+2)"
        >
          H2
        </AppButton>

        <AppButton
          variant="ghost"
          size="icon"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={
            editor.isActive("heading", { level: 3 })
              ? "bg-blue-500 text-white dark:bg-blue-700"
              : ""
          }
          tooltip="Heading 3 (Ctrl+Alt+3)"
        >
          H3
        </AppButton>

        <div className="w-px bg-gray-200 mx-2" />

        <AppButton
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={
            editor.isActive("bulletList")
              ? "bg-blue-500 text-white dark:bg-blue-700"
              : ""
          }
          tooltip="Bullet List (Ctrl+Shift+8)"
        >
          •
        </AppButton>

        <AppButton
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={
            editor.isActive("orderedList")
              ? "bg-blue-500 text-white dark:bg-blue-700"
              : ""
          }
          tooltip="Numbered List (Ctrl+Shift+7)"
        >
          1.
        </AppButton>

        <div className="w-px bg-gray-200 mx-2" />

        <AppButton
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={
            editor.isActive("codeBlock")
              ? "bg-blue-500 text-white dark:bg-blue-700"
              : ""
          }
          tooltip="Code Block (Ctrl+Alt+C)"
        >
          {"</>"}
        </AppButton>

        <AppButton
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={
            editor.isActive("blockquote")
              ? "bg-blue-500 text-white dark:bg-blue-700"
              : ""
          }
          tooltip="Quote (Ctrl+Shift+B)"
        >
          "
        </AppButton>

        <div className="w-px bg-gray-200 mx-2" />

        <AppButton
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().undo().run()}
          tooltip="Undo (Ctrl+Z)"
        >
          ↶
        </AppButton>

        <AppButton
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().redo().run()}
          tooltip="Redo (Ctrl+Y)"
        >
          ↷
        </AppButton>
      </div>
    </div>
  );
};

export default EditorToolbar;
