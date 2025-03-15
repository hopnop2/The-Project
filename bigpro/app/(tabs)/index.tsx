import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Dimensions, useWindowDimensions } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FAB } from 'react-native-paper';

// นำเข้าคอมโพเนนต์โน้ต
import NoteItem from '@/components/NoteItem';

// กำหนดชุดสีหลักเพื่อให้แอปมีความสวยงามและเป็นระบบ
export const COLORS = {
  primary: '#5B7FFF',      // สีฟ้าม่วง
  secondary: '#7B61FF',    // สีม่วงน้ำเงิน
  background: '#F8F9FD',   // สีพื้นหลัง
  card: '#FFFFFF',         // สีขาว
  text: {
    primary: '#2D3748',    // สีข้อความหลัก
    secondary: '#718096',  // สีข้อความรอง
    light: '#A0AEC0',      // สีข้อความอ่อน
  },
  categories: {
    'งาน': '#4299E1',      // สีฟ้า
    'ส่วนตัว': '#9F7AEA',   // สีม่วง
    'ไอเดีย': '#F6AD55',    // สีส้ม
    'To-Do': '#48BB78',     // สีเขียว
    'Uncategorized': '#A0AEC0' // สีเทา
  },
  error: '#FF5757',        // สีแดง
  divider: '#EDF2F7',      // สีเส้นแบ่ง
};

// ประกาศไทป์สำหรับข้อมูลโน้ต
export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

// ข้อมูลโน้ตตัวอย่าง
export const DUMMY_NOTES: Note[] = [
  // ... (ข้อมูลเดิม)
];

// ข้อมูลหมวดหมู่ตัวอย่าง
export const CATEGORIES = ['งาน', 'ส่วนตัว', 'ไอเดีย', 'To-Do', 'Uncategorized'];

export default function NotesScreen() {
  const router = useRouter();
  // ใช้ useWindowDimensions แทน Dimensions.get เพื่อให้รองรับการเปลี่ยนแปลงขนาดหน้าจอแบบ real-time
  const { width, height } = useWindowDimensions();
  
  // ใช้ state เก็บข้อมูลโน้ตที่จะแสดงในหน้าแรก
  const [notes, setNotes] = useState<Note[]>(DUMMY_NOTES);

  // คำนวณจำนวนคอลัมน์ขึ้นอยู่กับขนาดหน้าจอ
  const getNumColumns = () => {
    if (width >= 1024) return 5;        // Extra large screens
    if (width >= 768) return 4;         // Tablets landscape
    if (width >= 540) return 3;         // Tablets portrait / large phones
    return 2;                           // Small phones
  };

  // คำนวณขนาดการ์ดขึ้นอยู่กับขนาดหน้าจอ
  const getCardHeight = () => {
    if (width >= 768) return 200;       // ขนาดใหญ่สำหรับแท็บเล็ต
    if (width >= 540) return 180;       // ขนาดกลางสำหรับหน้าจอขนาดกลาง
    return 160;                         // ขนาดเล็กสำหรับมือถือ
  };

  // คำนวณขนาด font ขึ้นอยู่กับขนาดหน้าจอ
  const getFontSize = () => {
    if (width >= 768) return { title: 30, regular: 16 };
    if (width >= 540) return { title: 26, regular: 14 };
    return { title: 22, regular: 12 };
  };

  const numColumns = getNumColumns();
  const cardHeight = getCardHeight();
  const fontSize = getFontSize();

  const handleNotePress = (noteId: string) => {
    // นำทางไปหน้ารายละเอียดโน้ตพร้อมส่ง id
    router.push(`/note-details?id=${noteId}`);
  };

  // ฟังก์ชันเพิ่มโน้ตใหม่
  const addNote = (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: Note = {
      id: Date.now().toString(),
      ...note,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setNotes(prevNotes => [...prevNotes, newNote]);
  };

  // ฟังก์ชันอัปเดตโน้ต
  const updateNote = (updatedNote: Partial<Note> & { id: string }) => {
    setNotes(prevNotes => 
      prevNotes.map(note => 
        note.id === updatedNote.id 
          ? { ...note, ...updatedNote, updatedAt: new Date().toISOString() } 
          : note
      )
    );
  };

  // ฟังก์ชันลบโน้ต
  const deleteNote = (id: string) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
  };

  // ทำให้ฟังก์ชันพวกนี้เป็น global
  React.useEffect(() => {
    // @ts-ignore
    window.noteActions = {
      addNote,
      updateNote,
      deleteNote,
      notes,
      categories: CATEGORIES
    };
  }, [notes]);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { fontSize: fontSize.title }]}>My Notes</Text>
      
      {notes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text-outline" size={64} color={COLORS.text.light} />
          <Text style={[styles.emptyText, { fontSize: fontSize.title - 6 }]}>คุณยังไม่มีโน้ต</Text>
          <Text style={[styles.emptySubtext, { fontSize: fontSize.regular }]}>กดปุ่ม + เพื่อเพิ่มโน้ตแรกของคุณ</Text>
        </View>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          key={`grid-${numColumns}`} // สำคัญ! ต้องเปลี่ยนค่า key เมื่อ numColumns เปลี่ยน
          renderItem={({ item }) => (
            <View style={[
              styles.gridItem, 
              { 
                width: `${100/numColumns}%`,
                padding: width >= 768 ? 8 : 4 
              }
            ]}>
              <NoteItem 
                note={item} 
                onPress={() => handleNotePress(item.id)}
                onDelete={() => deleteNote(item.id)}
                gridView={true}
                cardHeight={cardHeight}
                fontSize={fontSize}
              />
            </View>
          )}
          contentContainerStyle={[
            styles.listContainer,
            { padding: width >= 768 ? 12 : 6 }
          ]}
        />
      )}
      
      <FAB
        style={[
          styles.fab,
          { 
            size: width >= 768 ? 'large' : 'medium',
            margin: width >= 768 ? 24 : 16,
          }
        ]}
        icon="plus"
        color="#FFFFFF"
        onPress={() => router.push('/note-details?isNew=true')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: COLORS.background,
  },
  title: {
    fontWeight: 'bold',
    marginLeft: 20,
    marginBottom: 20,
    color: COLORS.text.primary,
  },
  listContainer: {
    paddingBottom: 20,
  },
  gridItem: {
    paddingVertical: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
    color: COLORS.text.primary,
  },
  emptySubtext: {
    color: COLORS.text.secondary,
    marginTop: 8,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primary,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});
