import { Note } from "../types/Note";
import { StarIcon, TrashIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

interface AppSidebarProps {
  notes: Note[];
  selectedNoteId: string | null;
  onNoteSelect: (note: Note) => void;
  onNoteDelete: (id: string) => void;
  onNoteFavorite: (id: string, isFavorite: boolean) => void;
  onNoteTitleChange: (id: string, newTitle: string) => void;
  onNewNote: () => void;
}

export default function AppSidebar({
  notes,
  selectedNoteId,
  onNoteSelect,
  onNoteDelete,
  onNoteFavorite,
  onNoteTitleChange,
  onNewNote,
}: AppSidebarProps) {
  return (
    <ShadcnSidebar className="border-r h-screen">
      <div className="flex flex-col h-full">
        <SidebarHeader className="p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Notes</h2>
          <Button onClick={onNewNote} size="sm">
            New Note
          </Button>
        </SidebarHeader>
        <Separator />
        <SidebarContent className="flex-1 overflow-auto">
          <div className="space-y-2 p-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className={`p-2 rounded-lg cursor-pointer hover:bg-accent ${
                  selectedNoteId === note.id ? "bg-accent" : ""
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
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNoteFavorite(note.id, !note.isFavorite);
                      }}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    >
                      {note.isFavorite ? (
                        <StarIconSolid className="w-5 h-5 text-yellow-400" />
                      ) : (
                        <StarIcon className="w-5 h-5 text-muted-foreground" />
                      )}
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNoteDelete(note.id);
                      }}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <TrashIcon className="w-5 h-5 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
                <div
                  className="text-sm text-muted-foreground mt-1 truncate"
                  onClick={() => onNoteSelect(note)}
                >
                  {formatDistanceToNow(new Date(note.updatedAt), {
                    addSuffix: true,
                  })}
                </div>
              </div>
            ))}
          </div>
        </SidebarContent>
      </div>
    </ShadcnSidebar>
  );
}
