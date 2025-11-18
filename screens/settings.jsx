import React, { useContext, useEffect, useState } from 'react';
import {Modal, View, Text, TextInput, TouchableOpacity, ScrollView, Picker, Touchable, Switch, StyleSheet} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { ThemeContext } from '../App';
import { getTags } from '../services/memoriesAPI';
import { useFocusEffect } from '@react-navigation/native';
import { uploadTags } from '../services/memoriesAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CardGrid from '../components/cardGrid';
import { runOnJS } from 'react-native-reanimated';

import ColorPicker, { Panel1, Swatches, Preview, OpacitySlider, HueSlider, Panel5 } from 'reanimated-color-picker';

const Settings = () => {
  const { themeName, setThemeName } = useContext(ThemeContext); 
  const { colors } = useTheme();
  const [ tags, setTags] = useState([[]]);
  const [language, setLanguage] = useState('English');
  const [hex, setHex] = useState('#ffffff');
  const [newTag, setNewTag] = useState('');


  const addTag = async () => {
    const t = [newTag, hex];
    console.log('Adding tag:', t);
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
const onSelectColor = ({ hex }) => {

    'worklet';
    runOnJS(setHex)(hex);
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
      console.log('Fetched tags in settings:', data);
      console.log('test',data[0])
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
                  backgroundColor: hex,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  color: colors.text,
                  borderWidth: 1,
                  borderColor: colors.border,
                  marginRight: 8,
                }}
              />
              <TouchableOpacity onPress={addTag} style={{backgroundColor: colors.primary, padding: 12, justifyContent: 'center', borderRadius: 8, height: 40}}>
                <Text style={{color: '#fff'}}>Add</Text>
              </TouchableOpacity>
            </View>

          <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 8}}>
            {tags.map((t, index) => (
              <TouchableOpacity
                key={`${t[0]}-${index}`}
                style={{
                  backgroundColor: t[1],
                  borderRadius: 16,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  marginRight: 8,
                  marginBottom: 8,
                  borderWidth: 1,
                  borderColor: colors.border,
                  flexDirection: 'row',
                }}
              >
                <Text style={{color: colors.text}}>{t[0]}</Text>
                <TouchableOpacity onPress={() => removeTag(t)} style={{marginLeft: 8}}>
                  <Text style={{color: '#f00', fontWeight: 'bold'}}>×</Text>
              </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </View>
<View>
        
        <ColorPicker style={{ width: '70%' }} onComplete={onSelectColor}>
        <Panel5 />
        

        </ColorPicker>
        
        
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
