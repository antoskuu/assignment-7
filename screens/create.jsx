import React, {useState} from "react";
import { useEffect } from "react";
import styles from '../styles/styles.jsx';
import CardGrid from '../components/cardGrid.jsx'
import { StatusBar, StyleSheet, useColorScheme, View, Text, Button, ScrollView, TouchableOpacity, ImageBackground, Image, Platform, TextInput, PermissionsAndroid } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { getUserId } from "../services/memoriesAPI.js";
import { useTheme } from '@react-navigation/native';
import { uploadMemory } from "../services/memoriesAPI.js";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { ActivityIndicator } from "react-native";
import { getTags } from "../services/memoriesAPI.js";
import Geolocation from '@react-native-community/geolocation';



const Create = () => {
    const { colors } = useTheme();
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState(null);
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    useEffect(() => {
    console.log('Selected tags updated:', selectedTags);
}, [selectedTags]);

    useFocusEffect(
        React.useCallback(() => {
        const requestLocationPermission = async () => {
            getLocation();
        };
        const fetchTags = async () => {
            const data = await getTags();
            setTags(data);
        };
        fetchTags();

        const getLocation = () => {
            Geolocation.getCurrentPosition(
                (position) => {
                    console.log('Position:', position);
                    setLocation(position.coords);
                },
                (error) => {
                    console.error('Location error:', error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 10000
                }
            );
        };

        requestLocationPermission();
    }, []));

    const toggleTag = (tag) => {
        setSelectedTags(prevTags => {
            const tagId = tag[0];
            // Si le tag est déjà sélectionné, on le retire
            if (prevTags.some(t => t[0] === tagId)) {
            return prevTags.filter(t => t[0] !== tagId);
            }
            return [...prevTags, tag];
        });
        };

    const pickImage = async () => {
        const result = await launchImageLibrary({
            mediaType: 'photo',
            quality: 1,
        });
        
        if (!result.didCancel && result.assets) {
            setFormData({...formData, file: result.assets[0]});
        }
    };

    const takePhoto = async () => {
        const result = await launchCamera({
            mediaType: 'photo',
            quality: 1,
        });
        
        if (!result.didCancel && result.assets) {
            setFormData({...formData, file: result.assets[0]});
        }
    };

const sendMemory = async () => {
    setLoading(true);
    try {
        const data = await uploadMemory(formData.file, formData.title, [location.latitude, location.longitude], selectedTags);
    } catch (error) {
        console.error('Error uploading memory:', error);
    } finally {
        setLoading(false);
    }s
};
        

    return (
        <ScrollView>
            <View style={{backgroundColor: colors.background}}>
                
                <Text style={{...styles.title, color: colors.text}}>Create</Text>
                <View style={{ flexDirection: 'row', paddingHorizontal: 10, marginBottom: 8 }}>
                </View>
            </View>
            <TextInput
                placeholder="Title"
                style={{
                    backgroundColor: colors.card,
                    borderRadius: 8,
                    padding: 12,
                    margin: 10,
                    color: colors.text,
                }}
    onChangeText={(text) => setFormData({...formData, title: text, location: location, tags: selectedTags})}
            />
            
                      <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 8}}>
                        {tags.map((t) => (
                          <TouchableOpacity
                            key={t[0]}
                            onPress={() =>  { toggleTag(t) }}
                            style={{
                            
                              backgroundColor: t[1],
                              opacity: selectedTags.some(st => st[0] === t[0]) ? 1 : 0.2,
                              borderRadius: 16,
                              paddingHorizontal: 12,
                              paddingVertical: 8,
                              marginRight: 8,
                              marginBottom: 8,
                              borderWidth: 3,
                              borderColor: selectedTags.some(st => st[0] === t[0]) ? colors.primary : colors.border,
                            }}
                          >
                            <Text style={{color: colors.text}}>{t[0]}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
            <Text style={{...styles.text, marginLeft: 10, color: colors.text}}>Location: {location ? `Lat: ${location.latitude}, Lon: ${location.longitude}` : 'Fetching location...'}</Text>   
            <Button title="Choisir une photo" onPress={pickImage} />
            {loading && <ActivityIndicator size="small" color={colors.primary} />}
            <Button title="Prendre une photo" onPress={takePhoto} />
            {formData.file && <Image source={{uri: formData.file.uri}} style={{width: 200, height: 200, margin: 10}} />}
            <Button title="Send Memory" onPress={sendMemory} />
        </ScrollView>
    )
}
export default Create;