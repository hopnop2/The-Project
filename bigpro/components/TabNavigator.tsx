import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import { RootStackParamList, TabParamList } from '../types';

// Import Screens
import NotesScreen from '../app/notes';
import NoteDetailScreen from '../app/note-details';
import CategoriesScreen from '../app/categories';
import SearchScreen from '../app/search';

const Tab = createBottomTabNavigator<TabParamList>();
const NotesStack = createStackNavigator<RootStackParamList>();
const CategoriesStack = createStackNavigator<RootStackParamList>();
const SearchStack = createStackNavigator<RootStackParamList>();

const NotesStackScreen: React.FC = () => (
  <NotesStack.Navigator>
    <NotesStack.Screen name="MyNotes" component={NotesScreen} options={{ title: 'My Notes' }} />
    <NotesStack.Screen 
      name="NoteDetail" 
      component={NoteDetailScreen} 
      options={({ route }) => ({ 
        title: route.params?.isNew ? 'New Note' : 'Edit Note' 
      })} 
    />
  </NotesStack.Navigator>
);

const CategoriesStackScreen: React.FC = () => (
  <CategoriesStack.Navigator>
    <CategoriesStack.Screen name="MyCategories" component={CategoriesScreen} options={{ title: 'Categories' }} />
  </CategoriesStack.Navigator>
);

const SearchStackScreen: React.FC = () => (
  <SearchStack.Navigator>
    <SearchStack.Screen name="SearchNotes" component={SearchScreen} options={{ title: 'Search Notes' }} />
    <SearchStack.Screen 
      name="NoteDetail" 
      component={NoteDetailScreen} 
      options={{ title: 'View Note' }} 
    />
  </SearchStack.Navigator>
);

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { paddingBottom: 5 }
      }}
    >
      <Tab.Screen 
        name="Notes" 
        component={NotesStackScreen} 
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="note" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Categories" 
        component={CategoriesStackScreen} 
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="category" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Search" 
        component={SearchStackScreen} 
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="search" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
