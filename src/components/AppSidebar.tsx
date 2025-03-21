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
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const renderNoteItem = (note: Note) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      key={note.id}
      className={`group relative rounded-lg p-3 cursor-pointer hover:bg-accent ${
        selectedNoteId === note.id ? "bg-accent" : ""
      }`}
      onClick={() => onNoteSelect(note)}
    >
      <div className="flex items-center">
        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={note.title}
            onChange={(e) => onNoteTitleChange(note.id, e.target.value)}
            className="bg-transparent outline-none w-full truncate"
            onClick={(e) => e.stopPropagation()}
          />
          <p className="text-sm text-muted-foreground mt-1 truncate">
            {formatDistanceToNow(note.updatedAt, { addSuffix: true })}
          </p>
        </div>
        <div className="flex items-center space-x-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNoteFavorite(note.id, !note.isFavorite);
                  }}
                  className="p-1 hover:text-yellow-500 transition-colors"
                >
                  {note.isFavorite ? (
                    <StarIconSolid className="w-4 h-4 text-yellow-500" />
                  ) : (
                    <StarIcon className="w-4 h-4" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {note.isFavorite
                    ? "Remove from favorites"
                    : "Add to favorites"}
                </p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNoteDelete(note.id);
                  }}
                  className="p-1 hover:text-red-500 transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete note</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </motion.div>
  );

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
          <div className="space-y-4 p-4">
            {/* Favoriler Bölümü */}
            {notes.some((note) => note.isFavorite) && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2 px-2">
                  Favoriler
                </h3>
                <AnimatePresence mode="popLayout">
                  <div className="space-y-2">
                    {notes
                      .filter((note) => note.isFavorite)
                      .map((note) => renderNoteItem(note))}
                  </div>
                </AnimatePresence>
              </div>
            )}

            {/* Diğer Notlar Bölümü */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2 px-2">
                Tüm Notlar
              </h3>
              <AnimatePresence mode="popLayout">
                <div className="space-y-2">
                  {notes
                    .filter((note) => !note.isFavorite)
                    .map((note) => renderNoteItem(note))}
                </div>
              </AnimatePresence>
            </div>
          </div>
        </SidebarContent>
      </div>
    </ShadcnSidebar>
  );
}
