import React, { useContext, useEffect, useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, ScrollView, Picker, Touchable, Switch, StyleSheet} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { ThemeContext } from '../App';
import { getTags } from '../services/memoriesAPI';
import { useFocusEffect } from '@react-navigation/native';
import { uploadTags } from '../services/memoriesAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CardGrid from '../components/cardGrid';
const Settings = () => {
  const { themeName, setThemeName } = useContext(ThemeContext); // ← Correction ici
  const { colors } = useTheme();
  const [ tags, setTags] = useState([]);
  const [language, setLanguage] = useState('English');
  const [newTag, setNewTag] = useState('');
  const addTag = async () => {
    const t = (newTag || '').trim();
    if (!t) return;
    if (tags.includes(t)) {
      setNewTag('');
      return;
    }
    const updated = [t, ...tags];
    setTags(updated);
    setNewTag('');
    try { await uploadTags(updated); } catch (e) { console.error('uploadTags error', e); }
  };

  const removeTag = async (tagToRemove) => {
    const updated = tags.filter(t => t !== tagToRemove);
    setTags(updated);
    try { await uploadTags(updated); } catch (e) { console.error('uploadTags error', e); }
  };
  useEffect(() => {
    const load = async () => {
      const l = await AsyncStorage.getItem('settings_language');
      if (l) setLanguage(l);
    };
    load();
    const fetchTags = async () => {
      const data = await getTags();
      setTags(data);
    };
    fetchTags();
  }, []);

  const saveLanguage = async (lang) => {
    setLanguage(lang);
    await AsyncStorage.setItem('settings_language', lang);
  };

  return (
    <ScrollView style={{flex: 1, backgroundColor: colors.background}} contentContainerStyle={{padding: 16}}>
      <Text style={{fontSize: 24, fontWeight: '600', marginBottom: 16, color: colors.text}}>Settings</Text>
      
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.text }]}>Mode sombre</Text>
        <Switch
          value={themeName === 'dark'}
          onValueChange={() => setThemeName(themeName === 'light' ? 'dark' : 'light')}
          trackColor={{ false: '#767577', true: colors.primary }}
          thumbColor={themeName === 'dark' ? '#f4f3f4' : '#f4f3f4'}
        />
      </View>

          <View style={{marginBottom: 12}}>
            <Text style={{marginBottom: 6, color: colors.text}}>Tags</Text>
            <View style={{flexDirection: 'row', marginBottom: 8}}>
              <TextInput
                value={newTag}
                onChangeText={setNewTag}
                placeholder="Add tag"
                placeholderTextColor={colors.text + '88'}
                style={{
                  flex: 1,
                  backgroundColor: colors.card,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  color: colors.text,
                  borderWidth: 1,
                  borderColor: colors.border,
                  marginRight: 8,
                }}
              />
              <TouchableOpacity onPress={addTag} style={{backgroundColor: colors.primary, paddingHorizontal: 12, justifyContent: 'center', borderRadius: 8}}>
                <Text style={{color: '#fff'}}>Add</Text>
              </TouchableOpacity>
            </View>

          <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 8}}>
            {tags.map((t) => (
              <TouchableOpacity
                key={t}
                onPress={() => removeTag(t)}
                style={{
                  backgroundColor: colors.card,
                  borderRadius: 16,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  marginRight: 8,
                  marginBottom: 8,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <Text style={{color: colors.text}}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>

      <View style={{marginBottom: 12}}>
        <Text style={{marginBottom: 6, color: colors.text}}>Language</Text>
        <TouchableOpacity
          onPress={() => {
            const newLang = language === 'English' ? 'Spanish' : language === 'Spanish' ? 'French' : 'English';
            saveLanguage(newLang);
          }}
          style={{backgroundColor: colors.card, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: colors.border}}
        >
          <Text style={{color: colors.text}}>{language}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  label: {
    fontSize: 16,
  },
});

export default Settings;
