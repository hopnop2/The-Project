import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, IconButton, Title, Paragraph } from 'react-native-paper';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { deleteNote } from '../constants/notes-slice';
import { Note } from '../types';

interface NoteItemProps {
  note: Note;
  onPress: () => void;
}

const NoteItem: React.FC<NoteItemProps> = ({ note, onPress }) => {
  const dispatch = useDispatch();

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content>
        <View style={styles.headerContainer}>
          <Title numberOfLines={1} style={styles.title}>{note.title}</Title>
          <IconButton
            icon="delete"
            size={20}
            onPress={() => dispatch(deleteNote(note.id))}
          />
        </View>
        
        <Paragraph numberOfLines={2} style={styles.content}>
          {note.content}
        </Paragraph>
        
        <View style={styles.footerContainer}>
          <Text style={styles.category}>{note.category}</Text>
          <Text style={styles.date}>
            {moment(note.updatedAt).format('MMM DD, YYYY')}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    flex: 1,
  },
  content: {
    marginTop: 5,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  category: {
    fontSize: 12,
    color: '#6200ee',
    fontWeight: 'bold',
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
});

export default NoteItem;
