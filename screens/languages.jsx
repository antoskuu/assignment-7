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

const LanguagesTab = ({ navigation }) => {
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
    <TouchableOpacity onPress ={() => {navigation.goBack()}}>            
    <Text style={{ fontSize: 24, color: colors.primary }}>←</Text>
    </TouchableOpacity>
                  <Text style={{marginBottom: 6, color: colors.text, fontSize: 16}}>{t('language')}</Text>

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

export default LanguagesTab;
