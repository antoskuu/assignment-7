import React, { useContext, useEffect, useState } from 'react';
import {Modal, View, Text, TextInput, TouchableOpacity, ScrollView, Picker, Touchable, Switch, StyleSheet, Image} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { ThemeContext, LanguageContext } from '../App';
import { getTags } from '../services/memoriesAPI';
import { useFocusEffect } from '@react-navigation/native';
import { uploadTags } from '../services/memoriesAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CardGrid from '../components/cardGrid';
import { runOnJS } from 'react-native-reanimated';

import ColorPicker, { Panel1, Swatches, Preview, OpacitySlider, HueSlider, Panel5 } from 'reanimated-color-picker';

const Settings = () => {
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
      <View style={{marginBottom: 12, flexDirection: 'row', alignItems: 'center', alignContent: 'center', alignSelf: 'center'}}>
      
        <TouchableOpacity
          onPress={() => {
            const newLang = 'English'
            setLanguage(newLang);
          }} style={{width: 100, marginRight: 16, alignItems: 'center', backgroundColor: language=== 'English' ? colors.card : 'transparent', borderRadius: 8, padding: 8, borderColor: colors.border, borderWidth: language=== 'English' ? 2 : 0}}>
        
        <Text style={{color: colors.text}}>English</Text>

          <Image source={require('../assets/app/uk_flag.png')} style={{width: 48, height: 36, marginTop: 8}}/>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            const newLang = 'Norwegian'
            setLanguage(newLang);
          }} style={{width: 100, marginRight: 16, alignItems: 'center', backgroundColor: language=== 'Norwegian' ? colors.card : 'transparent', borderRadius: 8, padding: 8, borderColor: colors.border, borderWidth: language=== 'Norwegian' ? 2 : 0}}>

        <Text style={{color: colors.text}}>Norwegian</Text>

          <Image source={require('../assets/app/norway_flag.png')} style={{width: 48, height: 36, marginTop: 8}} />
        </TouchableOpacity>
        
      </View>

          <View style={{marginBottom: 12}}>
            <Text style={{marginBottom: 6, color: colors.text}}>{t('tags')}</Text>
            <View style={{flexDirection: 'row', marginBottom: 8}}>
              <TextInput
                value={newTag}
                onChangeText={setNewTag}
                placeholder={t('addTag')}
                placeholderTextColor="#000"
                style={{
                  flex: 1,
                  backgroundColor: hex,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  color: 'white', // Texte blanc
                  borderWidth: 1,
                  borderColor: colors.border,
                  marginRight: 8,
                  textShadowColor: 'black', // Contour noir opaque
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 3
                }}
              />
              <TouchableOpacity onPress={addTag} style={{backgroundColor: colors.primary, padding: 12, justifyContent: 'center', borderRadius: 8, height: 40}}>
                <Text style={{color: '#fff'}}>{t('add')}</Text>
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
        
        <ColorPicker style={{ width: '70%' }} onComplete={onSelectColor} >
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
