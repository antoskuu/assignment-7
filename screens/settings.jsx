import React, { useContext, useEffect, useState } from 'react';
import {Modal, View, Text, TextInput, TouchableOpacity, ScrollView, Picker, Touchable, Switch, StyleSheet, Image} from 'react-native';
import { useTheme, useNavigation } from '@react-navigation/native';
import { ThemeContext, LanguageContext } from '../App';
import { getTags } from '../services/memoriesAPI';
import { useFocusEffect } from '@react-navigation/native';
import { uploadTags } from '../services/memoriesAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CardGrid from '../components/cardGrid';
import { runOnJS } from 'react-native-reanimated';

import ColorPicker, { Panel1, Swatches, Preview, OpacitySlider, HueSlider, Panel5 } from 'reanimated-color-picker';

const Settings = () => {
    const navigation = useNavigation();

  const { themeName, setThemeName } = useContext(ThemeContext); 
  const { language, setLanguage, t } = useContext(LanguageContext);
  const { colors } = useTheme();
  const [ tags, setTags] = useState([[]]);
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
    const fetchTags = async () => {
      const data = await getTags();
      setTags(data);
      console.log('Fetched tags in settings:', data);
      console.log('test',data[0])
    };
    fetchTags();
  }, []);

  return (
    <ScrollView style={{flex: 1, backgroundColor: colors.background}} contentContainerStyle={{padding: 16}}>
      <Text style={{fontSize: 24, fontWeight: '600', marginBottom: 16, color: colors.text}}>{t('settings')}</Text>
      
      <View style={styles.row}>
      
        <Text style={[styles.label, { color: colors.text }]}>{t('darkMode')}</Text>
        <Switch
          value={themeName === 'dark'}
          onValueChange={() => setThemeName(themeName === 'light' ? 'dark' : 'light')}
          trackColor={{ false: '#767577', true: colors.primary }}
          thumbColor={themeName === 'dark' ? '#f4f3f4' : '#f4f3f4'}
        />
      </View>
      
      <TouchableOpacity style={{marginVertical: 6, backgroundColor: colors.card, padding: 12, borderRadius: 8}} onPress ={() => {navigation.navigate('Language')}}><Text style={[styles.label, { color: colors.text }]}>{t('language')}</Text></TouchableOpacity>
      <TouchableOpacity style={{marginVertical: 6, backgroundColor: colors.card, padding: 12, borderRadius: 8}} onPress ={() => {navigation.navigate('Tags')}}><Text style={[styles.label, { color: colors.text }]}>{t('tags')}</Text></TouchableOpacity>

      
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
