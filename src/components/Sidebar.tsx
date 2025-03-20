import { Note } from "../types/Note";
import { StarIcon, TrashIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

interface SidebarProps {
  notes: Note[];
  selectedNoteId: string | null;
  onNoteSelect: (note: Note) => void;
  onNoteDelete: (id: string) => void;
  onNoteFavorite: (id: string, isFavorite: boolean) => void;
  onNoteTitleChange: (id: string, newTitle: string) => void;
  onNewNote: () => void;
}

export default function Sidebar({
  notes,
  selectedNoteId,
  onNoteSelect,
  onNoteDelete,
  onNoteFavorite,
  onNoteTitleChange,
  onNewNote,
}: SidebarProps) {
  return (
    <div className="w-64 h-full border-r bg-gray-50 overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Notes</h2>
          <button
            onClick={onNewNote}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
          >
            New Note
          </button>
        </div>
        <div className="space-y-2">
          {notes.map((note) => (
            <div
              key={note.id}
              className={`p-2 rounded-lg cursor-pointer hover:bg-gray-100 ${
                selectedNoteId === note.id ? "bg-gray-200" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={note.title}
                  onChange={(e) => onNoteTitleChange(note.id, e.target.value)}
                  onFocus={(e) => e.target.select()}
                  className="bg-transparent border-none focus:outline-none focus:ring-0 w-full"
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNoteFavorite(note.id, !note.isFavorite);
                    }}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    {note.isFavorite ? (
                      <StarIconSolid className="w-5 h-5 text-yellow-400" />
                    ) : (
                      <StarIcon className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNoteDelete(note.id);
                    }}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <TrashIcon className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
              <div
                className="text-sm text-gray-500 mt-1 truncate"
                onClick={() => onNoteSelect(note)}
              >
                {new Date(note.updatedAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
