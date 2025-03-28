import React, { useState, useRef, useEffect } from "react";
import { Note } from "../types/Note";
import { StarIcon, TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ThemeSelector } from "./ThemeSelector";

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
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState<string>("");
  const [hoveredTitleId, setHoveredTitleId] = useState<string | null>(null); // State for title hover
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingNoteId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select(); // Select text for easy replacement
    }
  }, [editingNoteId]);

  const handleTitleEditStart = (note: Note, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingNoteId(note.id);
    setEditedTitle(note.title);
  };

  const handleTitleSave = () => {
    if (editingNoteId && editedTitle.trim() !== "") {
      // Check if title actually changed before calling the update function
      const originalNote = notes.find((n) => n.id === editingNoteId);
      if (originalNote && originalNote.title !== editedTitle.trim()) {
        onNoteTitleChange(editingNoteId, editedTitle.trim());
      }
    }
    setEditingNoteId(null);
    setEditedTitle("");
  };

  const handleTitleCancel = () => {
    setEditingNoteId(null);
    setEditedTitle("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleTitleSave();
    } else if (event.key === "Escape") {
      handleTitleCancel();
    }
  };

  const renderNoteItem = (note: Note) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      key={note.id}
      className={`group relative rounded-lg p-3 cursor-pointer hover:bg-accent ${
        selectedNoteId === note.id && !editingNoteId ? "bg-accent" : "" // Don't highlight when editing
      }`}
      onClick={() => !editingNoteId && onNoteSelect(note)} // Prevent selection when editing
    >
      {/* Restructure: Main flex container */}
      <div className="flex items-center">
        {/* Left side: Title/Input and Timestamp */}
        <div className="flex-1 min-w-0 mr-2">
          {/* Title/Input Row */}
          <div className="flex items-center justify-between">
            {editingNoteId === note.id ? (
              // --- Editing State ---
              <Input
                ref={inputRef}
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleTitleSave} // Save on blur
                onClick={(e) => e.stopPropagation()} // Prevent note selection
                // Styling to match the span: remove borders/padding/shadow/rounding, match font, allow growth
                className="h-auto py-0 px-0 border-none shadow-none rounded-none focus-visible:ring-0 font-medium flex-grow bg-transparent focus:outline-none focus:ring-0 focus:border-none text-inherit" // Added shadow-none, rounded-none, text-inherit
              />
            ) : (
              // --- Display State (Title + Edit Button Group) ---
              <div
                className="flex items-center"
                onMouseEnter={() => setHoveredTitleId(note.id)} // Add mouse enter handler
                onMouseLeave={() => setHoveredTitleId(null)} // Add mouse leave handler
              >
                {" "}
                {/* Removed group/title */} {/* New wrapper div */}
                <span className="font-medium inline truncate">
                  {" "}
                  {/* Changed block to inline, removed flex-grow */}
                  {note.title}
                </span>
                {/* Edit button - moved inside the wrapper */}
                <TooltipProvider delayDuration={150}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => handleTitleEditStart(note, e)}
                        // Visibility: Controlled by hoveredTitleId state
                        className={`p-1 h-auto w-auto ${
                          hoveredTitleId === note.id
                            ? "opacity-100"
                            : "opacity-0"
                        } focus-within:opacity-100 hover:text-blue-500 dark:text-muted-foreground dark:hover:text-blue-400 transition-opacity shrink-0 ml-1`} // Use state for opacity
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit title</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
            {/* Removed Edit button from here as it's moved inside the conditional */}
          </div>
          {/* Timestamp - always visible */}
          <p className="text-sm text-muted-foreground mt-1 truncate">
            {formatDistanceToNow(note.updatedAt, { addSuffix: true })}
          </p>
        </div>

        {/* Right side: Favorite/Delete Buttons - always present structurally, visibility controlled */}
        {/* Visibility: Show normally when editing, show on hover when not editing */}
        <div
          className={`flex items-center space-x-1 ${
            editingNoteId === note.id
              ? "opacity-100" // Always visible when editing this item
              : "opacity-0 group-hover:opacity-100 focus-within:opacity-100" // Standard hover visibility
          } transition-opacity shrink-0`}
        >
          <TooltipProvider delayDuration={150}>
            {/* Favorite Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNoteFavorite(note.id, !note.isFavorite);
                  }}
                  className="p-1 h-auto w-auto hover:text-yellow-500 dark:text-muted-foreground dark:hover:text-yellow-400 transition-colors"
                >
                  {note.isFavorite ? (
                    <StarIconSolid className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
                  ) : (
                    <StarIcon className="w-4 h-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {note.isFavorite
                    ? "Remove from favorites"
                    : "Add to favorites"}
                </p>
              </TooltipContent>
            </Tooltip>

            {/* Delete Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNoteDelete(note.id);
                  }}
                  className="p-1 h-auto w-auto hover:text-red-500 dark:text-muted-foreground dark:hover:text-red-400 transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete note</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      {/* Removed extraneous closing parenthesis and brace */}
    </motion.div>
  );

  return (
    <ShadcnSidebar className="border-r h-screen">
      <div className="flex flex-col h-full">
        <SidebarHeader className="p-4">
          <h2 className="text-lg font-semibold">Notes</h2>
        </SidebarHeader>
        <Separator />
        <SidebarContent className="flex-1 overflow-auto">
          <div className="space-y-4 p-4">
            {/* Favoriler Bölümü */}
            {notes.some((note) => note.isFavorite) && (
              <div>
                <h3 className="text-base font-semibold text-muted-foreground mb-2 px-2">
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
              <h3 className="text-base font-semibold text-muted-foreground mb-2 px-2">
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
        <SidebarFooter className="p-4 border-t">
          <div className="flex gap-2">
            <Button onClick={onNewNote} className="flex-1">
              New Note
            </Button>
            <ThemeSelector />
          </div>
        </SidebarFooter>
      </div>
    </ShadcnSidebar>
  );
}
