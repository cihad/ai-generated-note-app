import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Editor from "./components/Editor";
import Sidebar from "./components/Sidebar";
import { Note } from "./types/Note";
import { Editor as TipTapEditor } from "@tiptap/core";
import {
  getAllNotes,
  saveNote,
  deleteNote,
  getNote,
} from "./utils/noteStorage";

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [content, setContent] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [editor, setEditor] = useState<TipTapEditor | null>(null);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    const loadedNotes = await getAllNotes();
    setNotes(loadedNotes);
  };

  const handleNoteSelect = (note: Note) => {
    setSelectedNote(note);
    setContent(note.content);
    setHasChanges(false);
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!selectedNote) return;

    const updatedNote: Note = {
      ...selectedNote,
      content,
      updatedAt: Date.now(),
    };

    await saveNote(updatedNote);
    setHasChanges(false);
    loadNotes();
  };

  const handleNoteDelete = async (id: string) => {
    await deleteNote(id);
    if (selectedNote?.id === id) {
      setSelectedNote(null);
      setContent("");
    }
    loadNotes();
  };

  const handleNoteFavorite = async (id: string, isFavorite: boolean) => {
    const note = await getNote(id);
    if (!note) return;

    const updatedNote: Note = {
      ...note,
      isFavorite,
      updatedAt: Date.now(),
    };

    await saveNote(updatedNote);
    loadNotes();
  };

  const handleNoteTitleChange = async (id: string, newTitle: string) => {
    // First update the UI immediately
    if (selectedNote?.id === id) {
      setSelectedNote({
        ...selectedNote,
        title: newTitle,
        updatedAt: Date.now(),
      });
    }

    // Then update in notes list
    setNotes(
      notes.map((note) =>
        note.id === id
          ? { ...note, title: newTitle, updatedAt: Date.now() }
          : note
      )
    );

    // Finally save to cache
    const note = await getNote(id);
    if (!note) return;

    const updatedNote: Note = {
      ...note,
      title: newTitle,
      updatedAt: Date.now(),
    };

    await saveNote(updatedNote);
  };

  const createNewNote = () => {
    const newNote: Note = {
      id: uuidv4(),
      title: "New Note",
      content: "",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isFavorite: false,
    };

    saveNote(newNote);
    setSelectedNote(newNote);
    setContent("");
    loadNotes();
  };

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar
        notes={notes}
        selectedNoteId={selectedNote?.id || null}
        onNoteSelect={handleNoteSelect}
        onNoteDelete={handleNoteDelete}
        onNoteFavorite={handleNoteFavorite}
        onNoteTitleChange={handleNoteTitleChange}
        onNewNote={createNewNote}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center bg-white">
          <div className="flex items-center gap-4">
            {selectedNote ? (
              <input
                type="text"
                value={selectedNote.title}
                onChange={(e) =>
                  handleNoteTitleChange(selectedNote.id, e.target.value)
                }
                className="text-xl font-semibold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded px-2 py-1 w-96"
                placeholder="Note title..."
              />
            ) : (
              <h1 className="text-xl font-semibold">Select a note</h1>
            )}
            {selectedNote && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  className={`p-2 w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 ${
                    editor?.isActive("bold") ? "bg-gray-200" : ""
                  }`}
                  title="Bold (Ctrl+B)"
                >
                  <span className="font-bold">B</span>
                </button>
                <button
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  className={`p-2 w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 ${
                    editor?.isActive("italic") ? "bg-gray-200" : ""
                  }`}
                  title="Italic (Ctrl+I)"
                >
                  <span className="italic">I</span>
                </button>
                <button
                  onClick={() => editor?.chain().focus().toggleStrike().run()}
                  className={`p-2 w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 ${
                    editor?.isActive("strike") ? "bg-gray-200" : ""
                  }`}
                  title="Strikethrough (Ctrl+Shift+X)"
                >
                  <span className="line-through">S</span>
                </button>
                <div className="w-px bg-gray-200 mx-2" />
                <button
                  onClick={() =>
                    editor?.chain().focus().toggleHeading({ level: 1 }).run()
                  }
                  className={`p-2 w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 ${
                    editor?.isActive("heading", { level: 1 })
                      ? "bg-gray-200"
                      : ""
                  }`}
                  title="Heading 1 (Ctrl+Alt+1)"
                >
                  H1
                </button>
                <button
                  onClick={() =>
                    editor?.chain().focus().toggleHeading({ level: 2 }).run()
                  }
                  className={`p-2 w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 ${
                    editor?.isActive("heading", { level: 2 })
                      ? "bg-gray-200"
                      : ""
                  }`}
                  title="Heading 2 (Ctrl+Alt+2)"
                >
                  H2
                </button>
                <button
                  onClick={() =>
                    editor?.chain().focus().toggleHeading({ level: 3 }).run()
                  }
                  className={`p-2 w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 ${
                    editor?.isActive("heading", { level: 3 })
                      ? "bg-gray-200"
                      : ""
                  }`}
                  title="Heading 3 (Ctrl+Alt+3)"
                >
                  H3
                </button>
                <div className="w-px bg-gray-200 mx-2" />
                <button
                  onClick={() =>
                    editor?.chain().focus().toggleBulletList().run()
                  }
                  className={`p-2 w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 ${
                    editor?.isActive("bulletList") ? "bg-gray-200" : ""
                  }`}
                  title="Bullet List (Ctrl+Shift+8)"
                >
                  •
                </button>
                <button
                  onClick={() =>
                    editor?.chain().focus().toggleOrderedList().run()
                  }
                  className={`p-2 w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 ${
                    editor?.isActive("orderedList") ? "bg-gray-200" : ""
                  }`}
                  title="Numbered List (Ctrl+Shift+7)"
                >
                  1.
                </button>
                <div className="w-px bg-gray-200 mx-2" />
                <button
                  onClick={() =>
                    editor?.chain().focus().toggleCodeBlock().run()
                  }
                  className={`p-2 w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 ${
                    editor?.isActive("codeBlock") ? "bg-gray-200" : ""
                  }`}
                  title="Code Block (Ctrl+Alt+C)"
                >
                  {"</>"}
                </button>
                <button
                  onClick={() =>
                    editor?.chain().focus().toggleBlockquote().run()
                  }
                  className={`p-2 w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 ${
                    editor?.isActive("blockquote") ? "bg-gray-200" : ""
                  }`}
                  title="Quote (Ctrl+Shift+B)"
                >
                  "
                </button>
                <div className="w-px bg-gray-200 mx-2" />
                <button
                  onClick={() => editor?.chain().focus().undo().run()}
                  className="p-2 w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100"
                  title="Undo (Ctrl+Z)"
                >
                  ↶
                </button>
                <button
                  onClick={() => editor?.chain().focus().redo().run()}
                  className="p-2 w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100"
                  title="Redo (Ctrl+Y)"
                >
                  ↷
                </button>
              </div>
            )}
          </div>
          <div className="flex space-x-2">
            {selectedNote && (
              <button
                onClick={handleSave}
                className={`px-4 py-2 rounded ${
                  hasChanges
                    ? "bg-yellow-500 hover:bg-yellow-600"
                    : "bg-green-500 hover:bg-green-600"
                } text-white`}
              >
                {hasChanges ? "Save Changes" : "Saved"}
              </button>
            )}
          </div>
        </div>
        <div className="flex-1 p-4 overflow-hidden">
          {selectedNote ? (
            <Editor
              content={content}
              onChange={handleContentChange}
              editor={editor}
              setEditor={setEditor}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Select a note or create a new one
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
