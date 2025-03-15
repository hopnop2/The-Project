import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Note, NotesState } from '../types';

const initialState: NotesState = {
  notes: [],
  categories: ['Personal', 'Work', 'Ideas', 'To-Do']
};

export const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    addNote: (state, action: PayloadAction<{ title: string; content: string; category?: string }>) => {
      const newNote: Note = {
        id: Date.now().toString(),
        title: action.payload.title,
        content: action.payload.content,
        category: action.payload.category || 'Uncategorized',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      state.notes.push(newNote);
    },
    updateNote: (state, action: PayloadAction<{ id: string; title: string; content: string; category: string }>) => {
      const { id, title, content, category } = action.payload;
      const noteIndex = state.notes.findIndex(note => note.id === id);
      if (noteIndex !== -1) {
        state.notes[noteIndex] = {
          ...state.notes[noteIndex],
          title,
          content,
          category,
          updatedAt: new Date().toISOString()
        };
      }
    },
    deleteNote: (state, action: PayloadAction<string>) => {
      state.notes = state.notes.filter(note => note.id !== action.payload);
    },
    addCategory: (state, action: PayloadAction<string>) => {
      if (!state.categories.includes(action.payload)) {
        state.categories.push(action.payload);
      }
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(category => category !== action.payload);
      // อัพเดทโน้ตที่ใช้หมวดหมู่ที่ถูกลบ
      state.notes = state.notes.map(note => {
        if (note.category === action.payload) {
          return { ...note, category: 'Uncategorized' };
        }
        return note;
      });
    }
  }
});

export const { addNote, updateNote, deleteNote, addCategory, deleteCategory } = notesSlice.actions;

export default notesSlice.reducer;
