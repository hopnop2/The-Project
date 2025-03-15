// Types/interfaces หลัก
export interface Note {
    id: string;
    title: string;
    content: string;
    category: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface NotesState {
    notes: Note[];
    categories: string[];
  }
  
  // Navigation Types
  export type RootStackParamList = {
    MyNotes: undefined;
    NoteDetail: { note?: Note; isNew?: boolean };
    SearchNotes: undefined;
    MyCategories: undefined;
  };
  
  export type TabParamList = {
    Notes: undefined;
    Categories: undefined;
    Search: undefined;
  };
  