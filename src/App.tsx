import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Editor from "./components/Editor";
import Sidebar from "./components/Sidebar";
import { Note } from "./types/Note";
import { Editor as TipTapEditor } from "@tiptap/core";
import { Button } from "@/components/ui/button";
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
        <div className="p-4 border-b bg-white">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {selectedNote ? (
                  <input
                    type="text"
                    value={selectedNote.title}
                    onChange={(e) =>
                      handleNoteTitleChange(selectedNote.id, e.target.value)
                    }
                    onFocus={(e) => e.target.select()}
                    className="text-xl font-semibold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded px-2 py-1 flex-1 min-w-0 lg:pl-2 pl-12"
                    placeholder="Note title..."
                  />
                ) : (
                  <h1 className="text-xl font-semibold">Select a note</h1>
                )}
              </div>
              <div className="flex space-x-2 ml-4">
                {selectedNote && (
                  <Button
                    onClick={handleSave}
                    variant={hasChanges ? "default" : "secondary"}
                  >
                    {hasChanges ? "Save Changes" : "Saved"}
                  </Button>
                )}
              </div>
            </div>
            {selectedNote && (
              <div className="overflow-x-auto">
                <div className="flex items-center gap-1 min-w-max">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className={editor?.isActive("bold") ? "bg-accent" : ""}
                    title="Bold (Ctrl+B)"
                  >
                    <span className="font-bold">B</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    className={editor?.isActive("italic") ? "bg-accent" : ""}
                    title="Italic (Ctrl+I)"
                  >
                    <span className="italic">I</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor?.chain().focus().toggleStrike().run()}
                    className={editor?.isActive("strike") ? "bg-accent" : ""}
                    title="Strikethrough (Ctrl+Shift+X)"
                  >
                    <span className="line-through">S</span>
                  </Button>
                  <div className="w-px bg-gray-200 mx-2" />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      editor?.chain().focus().toggleHeading({ level: 1 }).run()
                    }
                    className={
                      editor?.isActive("heading", { level: 1 })
                        ? "bg-accent"
                        : ""
                    }
                    title="Heading 1 (Ctrl+Alt+1)"
                  >
                    H1
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      editor?.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    className={
                      editor?.isActive("heading", { level: 2 })
                        ? "bg-accent"
                        : ""
                    }
                    title="Heading 2 (Ctrl+Alt+2)"
                  >
                    H2
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      editor?.chain().focus().toggleHeading({ level: 3 }).run()
                    }
                    className={
                      editor?.isActive("heading", { level: 3 })
                        ? "bg-accent"
                        : ""
                    }
                    title="Heading 3 (Ctrl+Alt+3)"
                  >
                    H3
                  </Button>
                  <div className="w-px bg-gray-200 mx-2" />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      editor?.chain().focus().toggleBulletList().run()
                    }
                    className={
                      editor?.isActive("bulletList") ? "bg-accent" : ""
                    }
                    title="Bullet List (Ctrl+Shift+8)"
                  >
                    •
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      editor?.chain().focus().toggleOrderedList().run()
                    }
                    className={
                      editor?.isActive("orderedList") ? "bg-accent" : ""
                    }
                    title="Numbered List (Ctrl+Shift+7)"
                  >
                    1.
                  </Button>
                  <div className="w-px bg-gray-200 mx-2" />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      editor?.chain().focus().toggleCodeBlock().run()
                    }
                    className={editor?.isActive("codeBlock") ? "bg-accent" : ""}
                    title="Code Block (Ctrl+Alt+C)"
                  >
                    {"</>"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      editor?.chain().focus().toggleBlockquote().run()
                    }
                    className={
                      editor?.isActive("blockquote") ? "bg-accent" : ""
                    }
                    title="Quote (Ctrl+Shift+B)"
                  >
                    "
                  </Button>
                  <div className="w-px bg-gray-200 mx-2" />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor?.chain().focus().undo().run()}
                    title="Undo (Ctrl+Z)"
                  >
                    ↶
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor?.chain().focus().redo().run()}
                    title="Redo (Ctrl+Y)"
                  >
                    ↷
                  </Button>
                </div>
              </div>
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
