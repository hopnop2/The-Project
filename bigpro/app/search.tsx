import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Searchbar, Chip, Text, Divider } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import NoteItem from '../components/NoteItem';
import { RootState } from '../constants/redux-store';
import { RootStackParamList } from '../types';

type SearchScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SearchNotes'>;

interface SearchScreenProps {
  navigation: SearchScreenNavigationProp;
}

const SearchScreen: React.FC<SearchScreenProps> = ({ navigation }) => {
  const notes = useSelector((state: RootState) => state.notes.notes);
  const categories = useSelector((state: RootState) => state.notes.categories);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredNotes = notes.filter(note => {
    // กรองตามข้อความค้นหา
    const matchesSearch = 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    // กรองตามหมวดหมู่ (ถ้ามีการเลือก)
    const matchesCategory = selectedCategory ? note.category === selectedCategory : true;
    
    return matchesSearch && matchesCategory;
  });

  const handleCategoryPress = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="ค้นหาโน้ต..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />
      
      <View style={styles.categoriesContainer}>
        <Text style={styles.labelText}>กรองตามหมวดหมู่:</Text>
        <View style={styles.chipContainer}>
          {categories.map(category => (
            <Chip
              key={category}
              selected={selectedCategory === category}
              onPress={() => handleCategoryPress(category)}
              style={styles.chip}
              selectedColor="#6200ee"
            >
              {category}
            </Chip>
          ))}
        </View>
      </View>
      
      <Divider style={styles.divider} />
      
      {filteredNotes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>ไม่พบโน้ตที่ตรงกับการค้นหา</Text>
        </View>
      ) : (
        <FlatList
          data={filteredNotes}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchbar: {
    margin: 16,
    marginBottom: 8,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  labelText: {
    marginBottom: 8,
    fontSize: 14,
    color: '#555',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 4,
  },
  divider: {
    marginVertical: 8,
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
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
});

export default SearchScreen;
