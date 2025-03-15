import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, IconButton } from 'react-native-paper';
import { View, Text } from '@/components/Themed';
import moment from 'moment';

// กำหนด Note interface ในไฟล์นี้เลย
export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

// กำหนดค่า COLORS ในไฟล์นี้เอง
const COLORS = {
  primary: '#5B7FFF',
  secondary: '#7B61FF',
  background: '#F8F9FD',
  card: '#FFFFFF',
  text: {
    primary: '#2D3748',
    secondary: '#718096',
    light: '#A0AEC0',
  },
  categories: {
    'งาน': '#4299E1',
    'ส่วนตัว': '#9F7AEA',
    'ไอเดีย': '#F6AD55',
    'To-Do': '#48BB78',
    'Uncategorized': '#A0AEC0'
  },
  error: '#FF5757',
  divider: '#EDF2F7',
};

interface NoteItemProps {
  note: Note;
  onPress: () => void;
  onDelete: () => void;
  gridView?: boolean;
  cardHeight?: number; // เพิ่ม prop รับความสูงของการ์ด
  fontSize?: { title: number; regular: number }; // เพิ่ม prop รับขนาด font
}

const NoteItem: React.FC<NoteItemProps> = ({ 
  note, 
  onPress, 
  onDelete, 
  gridView = false,
  cardHeight = 180,
  fontSize = { title: 16, regular: 12 }
}) => {
  // กำหนดค่า default สำหรับ category
  const category = note.category || 'Uncategorized';
  
  // ใช้งาน COLORS ที่กำหนดในไฟล์นี้
  const categoryColor = COLORS.categories[category] || COLORS.categories.Uncategorized;
  
  // ปรับรูปแบบการแสดงผลตามโหมด grid หรือ list
  if (gridView) {
    return (
      <TouchableOpacity 
        onPress={onPress} 
        activeOpacity={0.75} 
        style={[styles.gridItemWrapper, { height: cardHeight }]}
      >
        <Card style={[styles.gridCard, { borderTopColor: categoryColor }]}>
          <Card.Content style={styles.gridCardContent}>
            <View style={styles.gridCardHeader}>
              <IconButton
                icon="delete-outline"
                color={COLORS.text.light}
                size={fontSize.regular + 4}
                style={styles.gridDeleteButton}
                onPress={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              />
            </View>
            
            <Title 
              numberOfLines={1} 
              style={[styles.gridTitle, { fontSize: fontSize.title }]}
            >
              {note.title}
            </Title>
            
            <Paragraph 
              numberOfLines={cardHeight >= 180 ? 3 : 2} 
              style={[styles.gridContent, { fontSize: fontSize.regular }]}
            >
              {note.content}
            </Paragraph>
            
            <View style={styles.gridFooter}>
              <Text 
                style={[
                  styles.gridCategory, 
                  { 
                    color: categoryColor,
                    fontSize: fontSize.regular - 2
                  }
                ]}
              >
                {category}
              </Text>
              <Text 
                style={[
                  styles.gridDate,
                  { fontSize: fontSize.regular - 2 }
                ]}
              >
                {moment(note.updatedAt).format(cardHeight >= 180 ? 'MM/DD/YY' : 'MM/DD')}
              </Text>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  }
  
  // รูปแบบ list view
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.75}>
      <Card style={[styles.card, { borderLeftWidth: 4, borderLeftColor: categoryColor }]}>
        <Card.Content>
          <View style={styles.headerContainer}>
            <Title 
              numberOfLines={1} 
              style={[styles.title, { fontSize: fontSize.title + 2 }]}
            >
              {note.title}
            </Title>
            <IconButton
              icon="delete-outline"
              color={COLORS.text.light}
              size={fontSize.title + 4}
              style={styles.deleteButton}
              onPress={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            />
          </View>
          
          <Paragraph 
            numberOfLines={2} 
            style={[styles.content, { fontSize: fontSize.regular + 2 }]}
          >
            {note.content}
          </Paragraph>
          
          <View style={styles.footer}>
            <Text 
              style={[
                styles.category, 
                { 
                  color: categoryColor, 
                  backgroundColor: `${categoryColor}20`,
                  fontSize: fontSize.regular
                }
              ]}
            >
              {category}
            </Text>
            <Text style={[styles.date, { fontSize: fontSize.regular }]}>
              {moment(note.updatedAt).format('MMM DD, YYYY')}
            </Text>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Styles เดิม แต่เอาส่วนที่เกี่ยวกับขนาดไปกำหนดใน inline style แทน
  card: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: 'hidden',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  title: {
    flex: 1,
    color: COLORS.text.primary,
  },
  deleteButton: {
    margin: -8,
  },
  content: {
    marginTop: 5,
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: 'transparent',
  },
  category: {
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  date: {
    color: COLORS.text.light,
  },
  
  // Styles สำหรับ Grid View
  gridItemWrapper: {
    flex: 1,
  },
  gridCard: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: 'hidden',
    borderTopWidth: 4,
  },
  gridCardContent: {
    flex: 1,
    padding: 10,
  },
  gridCardHeader: {
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
    height: 20,
  },
  gridDeleteButton: {
    margin: -8,
    marginTop: -10,
    marginRight: -6,
  },
  gridTitle: {
    color: COLORS.text.primary,
    marginTop: 0,
  },
  gridContent: {
    color: COLORS.text.secondary,
    lineHeight: 16,
    flex: 1,
  },
  gridFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingTop: 4,
  },
  gridCategory: {
    fontWeight: 'bold',
  },
  gridDate: {
    color: COLORS.text.light,
  },
});

export default NoteItem;
