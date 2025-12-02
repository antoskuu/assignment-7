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

const TagsEdit = ({ navigation }) => {

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
      
          <View style={{marginBottom: 12}}>
            <Text style={{marginBottom: 6, color: colors.text, fontSize: 16}}>{t('tags')}</Text>
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
                  color: 'white',
                  borderWidth: 1,
                  borderColor: colors.border,
                  marginRight: 8,
                  textShadowColor: 'black',
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
              <View
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
              </View>
            ))}
          </View>
        </View>
<View style={{alignSelf: 'center'}}>
        
        <ColorPicker style={{ width: '70%'}} onComplete={onSelectColor} >
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

export default TagsEdit;
