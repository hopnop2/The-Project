import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Menu, Divider, Portal, Dialog, Paragraph, IconButton } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Note } from '@/app/(tabs)/index'; // นำเข้าไทป์ Note จากหน้า index

export default function NoteDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  
  // รับพารามิเตอร์จาก URL
  const isNew = params.isNew === 'true';
  const noteId = params.id as string;
  
  // เข้าถึงข้อมูลและฟังก์ชันจาก global (แทน Redux)
  // @ts-ignore - global variable
  const { notes, categories, addNote, updateNote, deleteNote } = window.noteActions || {};
  
  // ค้นหาโน้ตจาก ID (สำหรับกรณีแก้ไข)
  const note = notes?.find((n: Note) => n.id === noteId);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('ส่วนตัว');
  const [menuVisible, setMenuVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);

  useEffect(() => {
    if (!isNew && note) {
      setTitle(note.title);
      setContent(note.content);
      setCategory(note.category || 'ส่วนตัว');
    }
  }, [isNew, note]);

  const handleSave = () => {
    if (title.trim() === '') {
      setDialogVisible(true);
      return;
    }

    if (isNew) {
      addNote({ title, content, category });
    } else if (noteId) {
      updateNote({ id: noteId, title, content, category });
    }

    router.back();
  };

  const handleDelete = () => {
    Alert.alert(
      'ยืนยันการลบ',
      'คุณต้องการลบโน้ตนี้ใช่หรือไม่?',
      [
        { text: 'ยกเลิก', style: 'cancel' },
        { 
          text: 'ลบ', 
          style: 'destructive',
          onPress: () => {
            if (noteId) {
              deleteNote(noteId);
              router.back();
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => router.back()}
        />
        <Text style={styles.headerTitle}>{isNew ? 'สร้างโน้ตใหม่' : 'แก้ไขโน้ต'}</Text>
        {!isNew && (
          <IconButton
            icon="trash-outline"
            size={24}
            color="#FF3B30"
            onPress={handleDelete}
          />
        )}
      </View>

      <ScrollView style={styles.scrollView}>
        <TextInput
          label="หัวข้อ"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
          mode="outlined"
        />

        <View style={styles.categoryContainer}>
          <Button 
            mode="outlined" 
            onPress={() => setMenuVisible(true)}
            style={styles.categoryButton}
          >
            {`หมวดหมู่: ${category}`}
          </Button>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={<View />}
            style={styles.menu}
          >
            {categories?.map((cat: string) => (
              <Menu.Item 
                key={cat} 
                onPress={() => {
                  setCategory(cat);
                  setMenuVisible(false);
                }}
                title={cat}
              />
            ))}
          </Menu>
        </View>

        <TextInput
          label="เนื้อหา"
          value={content}
          onChangeText={setContent}
          style={styles.contentInput}
          multiline
          mode="outlined"
        />

        <Button 
          mode="contained" 
          onPress={handleSave} 
          style={styles.saveButton}
        >
          บันทึกโน้ต
        </Button>

        <Portal>
          <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
            <Dialog.Title>ข้อผิดพลาด</Dialog.Title>
            <Dialog.Content>
              <Paragraph>กรุณากรอกหัวข้อโน้ต</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setDialogVisible(false)}>ตกลง</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </ScrollView>
    </View>
  );
}

// กำหนด Text component เพื่อใช้แทนการ import
function Text({ style, children }: { style?: any, children: React.ReactNode }) {
  return <React.Fragment>{children}</React.Fragment>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  categoryContainer: {
    marginBottom: 16,
    zIndex: 1,
  },
  categoryButton: {
    justifyContent: 'flex-start',
  },
  menu: {
    marginTop: 40,
  },
  contentInput: {
    minHeight: 200,
    marginBottom: 16,
  },
  saveButton: {
    marginTop: 16,
    marginBottom: 32,
    paddingVertical: 8,
    backgroundColor: '#6200ee',
  },
});
