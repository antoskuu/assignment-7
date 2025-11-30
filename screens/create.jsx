import React, {useState} from "react";
import { useEffect } from "react";
import styles from '../styles/styles.jsx';
import CardGrid from '../components/cardGrid.jsx'
import { StatusBar, StyleSheet, useColorScheme, View, Text, Button, ScrollView, TouchableOpacity, ImageBackground, Image, Platform, TextInput, PermissionsAndroid } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getUserId } from "../services/memoriesAPI.js";
import { useTheme } from '@react-navigation/native';
import { uploadMemory } from "../services/memoriesAPI.js";
import { launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { ActivityIndicator } from "react-native";
import { getTags } from "../services/memoriesAPI.js";
import Geolocation from '@react-native-community/geolocation';
import { LanguageContext } from '../App';



const Create = () => {
    const { colors } = useTheme();
    const { t } = React.useContext(LanguageContext);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState(null);
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [imagePickerVisible, setImagePickerVisible] = useState(true);

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

    const toggleTag = (tag, tagIndex) => {
        setSelectedTags(prevTags => {
            const existingIndex = prevTags.findIndex(t => t.index === tagIndex);
            
            if (existingIndex !== -1) {
                return prevTags.filter((_, i) => i !== existingIndex);
            }
            return [...prevTags, { tag, index: tagIndex }];
        });
        };

    const pickImage = async () => {
        const result = await launchImageLibrary({
            mediaType: 'photo',
            quality: 1,
        });
        
        if (!result.didCancel && result.assets) {
            setFormData({...formData, file: result.assets[0]});
            setImagePickerVisible(false);
        }
    };

    const takePhoto = async () => {
        const result = await launchCamera({
            mediaType: 'photo',
            quality: 1,
        });
        
        if (!result.didCancel && result.assets) {
            setFormData({...formData, file: result.assets[0]});
            setImagePickerVisible(false);
        }
    };
    const removeImage = () => {
        setFormData({...formData, file: null});
        setImagePickerVisible(true);

    };

const sendMemory = async () => {
    setLoading(true);
    try {
        const tagsToSend = selectedTags.map(st => st.tag);
        const data = await uploadMemory(formData.file, formData.title, formData.description || '', [location.longitude, location.latitude], tagsToSend);
    } catch (error) {
        console.error('Error uploading memory:', error);
    } finally {
        setLoading(false);
        setImagePickerVisible(true);
        setFormData({
            title: '',
            file: null,
            location: null,
            tags: []
        });
        setSelectedTags([]);

    }
};
        

    return (
        <ScrollView>
            <View style={{backgroundColor: colors.background}}>
                
                <Text style={{...styles.title, color: colors.text}}>{t('create')}</Text>
                <View style={{ flexDirection: 'row', paddingHorizontal: 10, marginBottom: 8 }}>
                </View>
            </View>
            <TextInput
                placeholder={t('title')}
                placeholderTextColor="#888"
                value={formData.title || ''}
                style={{
                    backgroundColor: colors.card,
                    borderRadius: 8,
                    padding: 12,
                    marginLeft: 30,
                    marginRight: 30,
                    color: colors.text,
                }}
    onChangeText={(text) => setFormData({...formData, title: text, location: location, tags: selectedTags})}
            />
             <TextInput
                placeholder={t('description')}
                placeholderTextColor="#888"
                value={formData.description || ''}
                multiline={true}
                numberOfLines={4}
                style={{
                    backgroundColor: colors.card,
                    borderRadius: 8,
                    padding: 12,
                    marginTop: 10,
                    marginBottom: 20,
                    marginLeft: 30,
                    marginRight: 30,
                    height: 100,
                    textAlignVertical: 'top',
                    color: colors.text,
                }}
    onChangeText={(text) => setFormData({...formData, description: text, location: location, tags: selectedTags})}
            />
                    <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginLeft: 20}}>
                        {tags.map((t, index) => (
                        <TouchableOpacity
                            key={`${t[0]}-${index}`}
                            onPress={() =>  { toggleTag(t, index) }}
                            style={{
                            
                            backgroundColor: t[1],
                            opacity: selectedTags.some(st => st.index === index) ? 1 : 0.2,
                            borderRadius: 16,
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                            marginRight: 8,
                            marginBottom: 8,
                            borderWidth: 3,
                            borderColor: selectedTags.some(st => st.index === index) ? colors.text : colors.border,
                            }}
                        >
                            <Text style={{color: colors.text}}>{t[0]}</Text>
                        </TouchableOpacity>
                        ))}
                    </View>
            <View style={{backgroundColor: location? "green" : "orange", alignItems: 'center', justifyContent: 'center', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, width: 150, alignSelf: 'center'}}>
            <Text style={{...styles.text, color: colors.text}}>{location ? t('locationLoaded') : t('fetchingLocation')}</Text>   
            </View>
            {imagePickerVisible &&
            <View style={{height: 300, flexDirection: 'row', backgroundColor: colors.card, borderWidth: 3, borderColor: colors.border, borderRadius: 20, borderStyle: 'dotted', margin:20,  alignItems: 'center', justifyContent: 'center'}} >
            
            <TouchableOpacity onPress={pickImage} style={{ backgroundColor: colors.background, padding: 15, borderRadius: 20, margin:10, flexDirection: 'row', alignItems: 'center'}}>
                <Image source={require('../assets/app/gallery.png')} style={{width: 16, height: 16, tintColor: colors.text, margin: 4}} />
                <Text style={{color: colors.text}}>{t('pickImage')}</Text>

            </TouchableOpacity>
            {loading && <ActivityIndicator size="small" color={colors.primary} />}
            <TouchableOpacity onPress={takePhoto} style={{ backgroundColor: colors.background, padding: 15, borderRadius: 20, margin:10, flexDirection: 'row', alignItems: 'center'}}>
                <Image source={require('../assets/app/camera.png')} style={{width: 24, height: 24, tintColor: colors.text}} />
                <Text style={{color: colors.text}}>{t('takePhoto')}</Text>

            </TouchableOpacity>
            
            </View>
            }

            {!imagePickerVisible &&
            <View style={{height: 450, flexDirection: 'row', backgroundColor: colors.card, borderWidth: 3, borderColor: colors.border, borderRadius: 20, borderStyle: 'dotted', margin:20,  alignItems: 'center', justifyContent: 'center', }} >
                        <TouchableOpacity onPress={removeImage} style={{position: 'absolute', top: 10, right: 10, zIndex: 10, backgroundColor: 'rgba(0,0,0,0.1)', width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{ fontSize: 20, color: colors.text, fontWeight: 'bold' }}>×</Text>
                        </TouchableOpacity>
                        {formData.file && <Image source={{uri: formData.file.uri}} style={{width: '100%', height: '100%', margin: 10, borderRadius: 20}} />}

            </View>
            }
            <TouchableOpacity onPress={sendMemory} style={{position: "absolute", top: 700, right: 20, backgroundColor: colors.primary, padding: 15, borderRadius: 20, }}>
                <Image source={require('../assets/app/send.png')} style={{width: 24, height: 24, tintColor: colors.text, }} />
                
            </TouchableOpacity>
        </ScrollView>
    )
}
export default Create;