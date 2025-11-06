import React, { useContext, useEffect, useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, ScrollView, Picker, Touchable, Switch, StyleSheet} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { ThemeContext } from '../App';

import AsyncStorage from '@react-native-async-storage/async-storage';
const Settings = () => {
  const { themeName, setThemeName } = useContext(ThemeContext); // ← Correction ici
  const { colors } = useTheme();

  const [language, setLanguage] = useState('English');

  useEffect(() => {
    const load = async () => {
      const l = await AsyncStorage.getItem('settings_language');
      if (l) setLanguage(l);
    };
    load();
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
