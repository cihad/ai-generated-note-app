import { Note } from "../types/Note";

const CACHE_NAME = "notes-cache-v1";

export const saveNote = async (note: Note): Promise<void> => {
  const cache = await caches.open(CACHE_NAME);
  const response = new Response(JSON.stringify(note));
  await cache.put(`/notes/${note.id}`, response);
};

export const getNotes = async (): Promise<Note[]> => {
  const cache = await caches.open(CACHE_NAME);
  const keys = await cache.keys();
  const notes: Note[] = [];

  for (const key of keys) {
    const response = await cache.match(key);
    if (response) {
      const note = await response.json();
      notes.push(note);
    }
  }

  return notes.sort((a: Note, b: Note) => {
    // Sort by favorite first, then by updated date
    if (a.isFavorite !== b.isFavorite) {
      return a.isFavorite ? -1 : 1;
    }
    return b.updatedAt - a.updatedAt;
  });
};

export const deleteNote = async (id: string): Promise<void> => {
  const cache = await caches.open(CACHE_NAME);
  await cache.delete(`/notes/${id}`);
};

export const getNote = async (id: string): Promise<Note | null> => {
  const cache = await caches.open(CACHE_NAME);
  const response = await cache.match(`/notes/${id}`);
  if (!response) return null;
  return response.json();
};
