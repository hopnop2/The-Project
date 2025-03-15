import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Menu, Divider, Portal, Dialog, Paragraph } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { addNote, updateNote } from '../constants/notes-slice';
import { RootState } from '../constants/redux-store';
import { RootStackParamList } from '../types';

type NoteDetailScreenRouteProp = RouteProp<RootStackParamList, 'NoteDetail'>;
type NoteDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'NoteDetail'>;

interface NoteDetailScreenProps {
  route: NoteDetailScreenRouteProp;
  navigation: NoteDetailScreenNavigationProp;
}

const NoteDetailScreen: React.FC<NoteDetailScreenProps> = ({ route, navigation }) => {
  const { isNew, note } = route.params || {};
  const categories = useSelector((state: RootState) => state.notes.categories);
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Uncategorized');
  const [menuVisible, setMenuVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);

  useEffect(() => {
    if (!isNew && note) {
      setTitle(note.title);
      setContent(note.content);
      setCategory(note.category || 'Uncategorized');
    }
  }, [isNew, note]);

  const saveNote = () => {
    if (title.trim() === '') {
      setDialogVisible(true);
      return;
    }

    if (isNew) {
      dispatch(addNote({ title, content, category }));
    } else if (note) {
      dispatch(updateNote({ id: note.id, title, content, category }));
    }

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
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
          {categories.map(cat => (
            <Menu.Item 
              key={cat} 
              onPress={() => {
                setCategory(cat);
                setMenuVisible(false);
              }}
              title={cat}
            />
          ))}
          <Divider />
          <Menu.Item 
            onPress={() => {
              setCategory('Uncategorized');
              setMenuVisible(false);
            }}
            title="Uncategorized"
          />
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
        onPress={saveNote} 
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
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

export default NoteDetailScreen;
