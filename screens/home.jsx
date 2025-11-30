import React, {useState, useCallback, useMemo} from "react";
import { Modal, View, Text, ScrollView, TouchableOpacity, ImageBackground, Image, h1 } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import styles from '../styles/styles.jsx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '@react-navigation/native';
import { getMemories} from "../services/memoriesAPI.js";
import CardGrid from '../components/cardGrid.jsx'
import { getTags } from "../services/memoriesAPI.js";


const HomeScreen = ({navigation}) => {
    const { colors } = useTheme();
    const [ memories, setMemories ] = useState([]);
    const [ sortedMemories, setSortedMemories ] = useState([]);
    const [filteredMemories, setFilteredMemories] = useState([]);
    const [filterActive, setFilterActive] = useState([]);
    const [tags, setTags] = useState([]);
    
    const [sortMode, setSortMode] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

            
            
    useFocusEffect(
        useCallback(() => {
            const load = async () => {
                fetchMemories();
            };
            load();
            const fetchTags = async () => {
                const data = await getTags();
                setTags(data);
            };
            fetchTags();
        }, [])
    );
    
    const handleMemoryPress = (memory) => {
        navigation.navigate('MemoryDetail', {
            memory: memory,
        });
    };
        const toggleTag = (tag, tagIndex) => {
        setFilterActive(prevTags => {
            const existingIndex = prevTags.findIndex(t => t.index === tagIndex);
            
            if (existingIndex !== -1) {
                return prevTags.filter((_, i) => i !== existingIndex);
            }
            
            return [...prevTags, { tag, index: tagIndex }];
        });
        };


    const fetchMemories = async () => {
            const data = await getMemories();
            console.log('Fetched memories:', data);
            console.log('Is array?', Array.isArray(data));
            const memoriesArray = Array.isArray(data) ? data : (data?.memories || []);
            setMemories(memoriesArray);
        };
    
    useFocusEffect(
        React.useCallback(() => {
            fetchMemories();
        }, [])
    );


    const finalMemories = useMemo(() => {
        let result = [...memories];

        if (filterActive.length > 0) {
            const activeTagNames = filterActive.map(item => item.tag[0]);

            result = result.filter(memory => {
                if (!memory.tags) return false;
                
                const memoryTagNames = memory.tags.map(t => Array.isArray(t) ? t[0] : t);

                return activeTagNames.some(tagName => memoryTagNames.includes(tagName));
            });
        }

        if (sortMode === 'newest') {
            result.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (sortMode === 'oldest') {
            result.sort((a, b) => new Date(a.date) - new Date(b.date));
        }

        return result;
    }, [memories, filterActive, sortMode]); 

    return (
<ScrollView style={styles.ScrollView} contentContainerStyle={styles.scrollContent}>
        <View style={{backgroundColor: colors.background}}>
            
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <Text style={{...styles.title, color: colors.text, marginLeft: 20}}>Memories</Text>
                <TouchableOpacity 
                onPress={() => {setModalOpen(!modalOpen);}}
                style={{
                    padding: 10,
                    margin: 10,
                    alignSelf: 'flex-start'
                }}
            >
                <Text style={{ fontSize: 24, color: colors.text }}>{modalOpen ? "✕" : "☰"}</Text>
            </TouchableOpacity>

        
            </View>
            {(sortMode === 'newest' || sortMode === 'oldest' || filterActive.length > 0) && (
                <TouchableOpacity
                onPress={() => {
                    setSortMode(null);
                    setFilterActive([]);
                }}
                style={{
                    backgroundColor: colors.card,
                    marginHorizontal: 20,
                    marginBottom: 10,
                    padding: 10,
                    borderRadius: 8,
                    alignItems: 'center',
                }}
            >
                <Text style={{ color: colors.text }}>Clear Filters & Sorting ({filterActive.length + (sortMode ? 1 : 0)})</Text>
            </TouchableOpacity>
            )}
            {modalOpen && (
            <View style={{
                alignSelf: 'center',
                width: '100%',
                backgroundColor: colors.card,
                borderRadius: 8,
                padding: 10
            }}>
                <TouchableOpacity onPress={() => setModalOpen(false)} style={{ alignSelf: 'flex-end' }}>
                </TouchableOpacity>
                <Text style={{ color: colors.text, marginTop: 10 }}>Sort By:</Text>
                
                <TouchableOpacity onPress={() => {
                    setSortMode(sortMode === 'newest' ? null : 'newest');
                }} style={{ paddingVertical: 8, flexDirection: 'row', alignItems: 'center', backgroundColor: sortMode=== 'newest' ? colors.background : colors.card,borderRadius: 5 }}>
                    <Text style={{ color: colors.text, marginLeft: 10 }}>Date (Newest First)</Text>
                    { sortMode === 'newest' && <Text style={{ color: colors.text}}> ✓</Text> }
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                    setSortMode(sortMode === 'oldest' ? null : 'oldest');             
                }} style={{ paddingVertical: 8, flexDirection: 'row', alignItems: 'center', backgroundColor: sortMode=== 'oldest' ? colors.background : colors.card,borderRadius: 5 }}>
                    <Text style={{ color: colors.text, marginLeft: 10 }}>Date (Oldest First)</Text>
                    { sortMode === 'oldest' && <Text style={{ color: colors.text}}> ✓</Text> }
                </TouchableOpacity>
                <Text style={{ color: colors.text, marginTop: 10 }}>Filter:</Text>
                <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginLeft: 20}}>
                        {tags.map((t, index) => (
                        <TouchableOpacity
                            key={`${t[0]}-${index}`}
                            onPress={() =>  { toggleTag(t, index) }}
                            style={{
                            
                            backgroundColor: t[1],
                            opacity: filterActive.some(st => st.index === index) ? 1 : 0.2,
                            borderRadius: 16,
                            paddingHorizontal: 5,
                            paddingVertical: 5,
                            marginRight: 3,
                            marginBottom: 1,
                            borderWidth: 3,
                            borderColor: filterActive.some(st => st.index === index) ? colors.text : colors.border,
                            }}
                        >
                            <Text style={{color: colors.text}}>{t[0]}</Text>
                        </TouchableOpacity>
                        ))}
                    </View>
            </View>
        )}
        
                <View style={{ flexDirection: 'row', paddingHorizontal: 10, marginBottom: 8 }}>
                <CardGrid cart_bool={false} items={finalMemories} onItemPress={handleMemoryPress} />

            </View>
            </View>
    </ScrollView>

    )


}


export default HomeScreen;



