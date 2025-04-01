import React, { useState, useEffect, ReactNode } from "react"; // Import ReactNode
import { Editor } from "@tiptap/core";
import AppToggleButton from "./AppToggleButton";

// Define props for the reusable ToolbarButton
interface ToolbarButtonProps {
  editor: Editor;
  onClick: () => void;
  isActive?: () => boolean; // Optional: not all buttons have an active state (e.g., undo/redo)
  tooltip: string;
  children: ReactNode;
}

// Reusable ToolbarButton component
const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  editor,
  onClick,
  isActive,
  tooltip,
  children,
}) => {
  // Check if editor is destroyed before accessing properties/methods
  // Although the parent checks, adding a check here makes the component more robust
  if (editor.isDestroyed) {
    return null;
  }

  const active = isActive ? isActive() : false;

  return (
    <AppToggleButton
      pressed={active}
      onPressedChange={onClick}
      className={active ? "bg-blue-500 text-white dark:bg-blue-700" : ""}
      tooltip={tooltip}
    >
      {children}
    </AppToggleButton>
  );
};

interface EditorToolbarProps {
  editor: Editor | null;
}

// Define button configurations
type ButtonConfig =
  | {
      id: string;
      onClick: (editor: Editor) => void;
      isActive?: (editor: Editor) => boolean;
      tooltip: string;
      content: ReactNode;
    }
  | { separator: true };

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
    return null; // Already checked above, but good practice
  }

  const buttonConfigs: ButtonConfig[] = [
    {
      id: "bold",
      onClick: (e) => e.chain().focus().toggleBold().run(),
      isActive: (e) => e.isActive("bold"),
      tooltip: "Bold (Ctrl+B)",
      content: <span className="font-bold">B</span>,
    },
    {
      id: "italic",
      onClick: (e) => e.chain().focus().toggleItalic().run(),
      isActive: (e) => e.isActive("italic"),
      tooltip: "Italic (Ctrl+I)",
      content: <span className="italic">I</span>,
    },
    {
      id: "strike",
      onClick: (e) => e.chain().focus().toggleStrike().run(),
      isActive: (e) => e.isActive("strike"),
      tooltip: "Strikethrough (Ctrl+Shift+X)",
      content: <span className="line-through">S</span>,
    },
    { separator: true },
    {
      id: "h1",
      onClick: (e) => e.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: (e) => e.isActive("heading", { level: 1 }),
      tooltip: "Heading 1 (Ctrl+Alt+1)",
      content: "H1",
    },
    {
      id: "h2",
      onClick: (e) => e.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: (e) => e.isActive("heading", { level: 2 }),
      tooltip: "Heading 2 (Ctrl+Alt+2)",
      content: "H2",
    },
    {
      id: "h3",
      onClick: (e) => e.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: (e) => e.isActive("heading", { level: 3 }),
      tooltip: "Heading 3 (Ctrl+Alt+3)",
      content: "H3",
    },
    { separator: true },
    {
      id: "bulletList",
      onClick: (e) => e.chain().focus().toggleBulletList().run(),
      isActive: (e) => e.isActive("bulletList"),
      tooltip: "Bullet List (Ctrl+Shift+8)",
      content: "•",
    },
    {
      id: "orderedList",
      onClick: (e) => e.chain().focus().toggleOrderedList().run(),
      isActive: (e) => e.isActive("orderedList"),
      tooltip: "Numbered List (Ctrl+Shift+7)",
      content: "1.",
    },
    { separator: true },
    {
      id: "codeBlock",
      onClick: (e) => e.chain().focus().toggleCodeBlock().run(),
      isActive: (e) => e.isActive("codeBlock"),
      tooltip: "Code Block (Ctrl+Alt+C)",
      content: "</>",
    },
    {
      id: "blockquote",
      onClick: (e) => e.chain().focus().toggleBlockquote().run(),
      isActive: (e) => e.isActive("blockquote"),
      tooltip: "Quote (Ctrl+Shift+B)",
      content: '"',
    },
    { separator: true },
    {
      id: "undo",
      onClick: (e) => e.chain().focus().undo().run(),
      // No isActive for undo
      tooltip: "Undo (Ctrl+Z)",
      content: "↶",
    },
    {
      id: "redo",
      onClick: (e) => e.chain().focus().redo().run(),
      // No isActive for redo
      tooltip: "Redo (Ctrl+Y)",
      content: "↷",
    },
  ];

  return (
    <div className="overflow-x-auto">
      <div className="flex items-center justify-center gap-1 min-w-max">
        {buttonConfigs.map((config, index) => {
          if ("separator" in config) {
            return (
              <div
                key={`sep-${index}`}
                className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2"
              />
            );
          }
          return (
            <ToolbarButton
              key={config.id}
              editor={editor}
              onClick={() => config.onClick(editor)}
              isActive={
                config.isActive ? () => config.isActive!(editor) : undefined
              }
              tooltip={config.tooltip}
            >
              {config.content}
            </ToolbarButton>
          );
        })}
      </div>
    </div>
  );
};

export default EditorToolbar;
