import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { FAB, Text } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import NoteItem from '../components/NoteItem';
import { RootState } from '../constants/redux-store';
import { RootStackParamList } from '../types';

type NotesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MyNotes'>;

interface NotesScreenProps {
  navigation: NotesScreenNavigationProp;
}

const NotesScreen: React.FC<NotesScreenProps> = ({ navigation }) => {
  const notes = useSelector((state: RootState) => state.notes.notes);

  return (
    <View style={styles.container}>
      {notes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>คุณยังไม่มีโน้ต กดปุ่ม + เพื่อเพิ่มโน้ตแรกของคุณ</Text>
        </View>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <NoteItem
              note={item}
              onPress={() => navigation.navigate('NoteDetail', { note: item })}
            />
          )}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('NoteDetail', { isNew: true })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
});

export default NotesScreen;
