import React, {useState, useCallback} from "react";
import { View, Text, ScrollView, TouchableOpacity, ImageBackground, Image } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import styles from '../styles/styles.jsx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '@react-navigation/native';
import { getMemories} from "../services/memoriesAPI.js";
import CardGrid from '../components/cardGrid.jsx'


const HomeScreen = ({navigation}) => {
    const { colors } = useTheme();
    const [ memories, setMemories ] = useState([]);
    const [ name, setName ] = useState('');
    const [ city, setCity ] = useState('');

    useFocusEffect(
        useCallback(() => {
            const load = async () => {
                const n = await AsyncStorage.getItem('settings_name');
                const c = await AsyncStorage.getItem('settings_city');
                if (n) setName(n);
                if (c) setCity(c);
            };
            load();
        }, [])
    );



    const fetchMemories = async () => {
            const data = await getMemories();
            console.log('Fetched memories:', data);
            console.log('Is array?', Array.isArray(data));
            // Si l'API retourne un objet avec une propriété contenant le tableau
            const memoriesArray = Array.isArray(data) ? data : (data?.memories || []);
            setMemories(memoriesArray);
        };
    
    useFocusEffect(
        React.useCallback(() => {
            fetchMemories();
        }, [])
    );



    return (
<ScrollView style={styles.ScrollView} contentContainerStyle={styles.scrollContent}>
        <View style={{backgroundColor: colors.background}}>
                
                <Text style={{...styles.title, color: colors.text}}>Memories</Text>
                <View style={{ flexDirection: 'row', paddingHorizontal: 10, marginBottom: 8 }}>
                <CardGrid cart_bool={false} items={memories} />

              </View>
            </View>
      </ScrollView>

    )


}


export default HomeScreen;



