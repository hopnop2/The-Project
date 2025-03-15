import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Card, Title, Button, TextInput, IconButton, Dialog, Portal, Paragraph } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { addCategory, deleteCategory } from '../constants/notes-slice';
import { RootState } from '../constants/redux-store';

const CategoriesScreen: React.FC = () => {
  const categories = useSelector((state: RootState) => state.notes.categories);
  const notes = useSelector((state: RootState) => state.notes.notes);
  const dispatch = useDispatch();

  const [newCategory, setNewCategory] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleAddCategory = () => {
    if (newCategory.trim() === '') {
      return;
    }
    
    if (categories.includes(newCategory.trim())) {
      Alert.alert('ข้อผิดพลาด', 'หมวดหมู่นี้มีอยู่แล้ว');
      return;
    }
    
    dispatch(addCategory(newCategory.trim()));
    setNewCategory('');
  };

  const confirmDelete = (category: string) => {
    setSelectedCategory(category);
    setDialogVisible(true);
  };

  const handleDeleteCategory = () => {
    if (selectedCategory) {
      dispatch(deleteCategory(selectedCategory));
    }
    setDialogVisible(false);
  };

  const countNotesByCategory = (category: string): number => {
    return notes.filter(note => note.category === category).length;
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          label="หมวดหมู่ใหม่"
          value={newCategory}
          onChangeText={setNewCategory}
          style={styles.input}
          mode="outlined"
        />
        <Button 
          mode="contained" 
          onPress={handleAddCategory}
          style={styles.addButton}
        >
          เพิ่ม
        </Button>
      </View>

      <FlatList
        data={categories}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.categoryInfo}>
                <Title>{item}</Title>
                <Paragraph>โน้ต: {countNotesByCategory(item)}</Paragraph>
              </View>
              <IconButton
                icon="delete"
                size={24}
                onPress={() => confirmDelete(item)}
              />
            </Card.Content>
          </Card>
        )}
        contentContainerStyle={styles.list}
      />

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>ยืนยันการลบ</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              คุณต้องการลบหมวดหมู่ "{selectedCategory}" หรือไม่? 
              โน้ตทั้งหมดในหมวดหมู่นี้จะถูกย้ายไปยัง "Uncategorized"
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>ยกเลิก</Button>
            <Button onPress={handleDeleteCategory}>ลบ</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    marginRight: 8,
  },
  addButton: {
    justifyContent: 'center',
    backgroundColor: '#6200ee',
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    marginBottom: 10,
    borderRadius: 8,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryInfo: {
    flex: 1,
  },
});

export default CategoriesScreen;
