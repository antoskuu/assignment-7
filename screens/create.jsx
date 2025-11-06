import React, {useState} from "react";
import { useEffect } from "react";
import styles from '../styles/styles.jsx';
import CardGrid from '../components/cardGrid.jsx'
import { StatusBar, StyleSheet, useColorScheme, View, Text, Button, ScrollView, TouchableOpacity, ImageBackground, Image, Platform, TextInput } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {getCategories, getProductsWithImageUrls} from '../services/productsApi.js';
import { getUserId } from "../services/memoriesAPI.js";
import { useTheme } from '@react-navigation/native';
import { uploadMemory } from "../services/memoriesAPI.js";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { ActivityIndicator } from "react-native";
const Create = () => {
    const { colors } = useTheme();
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);

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
        const data = await uploadMemory(formData.file, formData.title);
    } catch (error) {
        console.error('Error uploading memory:', error);
    } finally {
        setLoading(false);
    }
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
    onChangeText={(text) => setFormData({...formData, title: text})}
            />

            <Button title="Choisir une photo" onPress={pickImage} />
            {loading && <ActivityIndicator size="small" color={colors.primary} />}
            <Button title="Prendre une photo" onPress={takePhoto} />
            {formData.file && <Image source={{uri: formData.file.uri}} style={{width: 200, height: 200, margin: 10}} />}
            <Button title="Send Memory" onPress={sendMemory} />
        </ScrollView>
    )
}
export default Create;