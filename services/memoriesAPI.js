import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { API_BASE } from './config.js';



const USER_ID_KEY = 'userId';

const getUserId = async () => {
    try {
        let userId = await AsyncStorage.getItem(USER_ID_KEY);
        if (!userId) {
            userId = uuidv4();
            await AsyncStorage.setItem(USER_ID_KEY, userId);
        }
        return userId;
    } catch (e) {
        console.warn('Storage error in getUserId', e);
        return null;
    }
};



export const uploadMemory = async (file, title, description, location, tags, date) => {
    try {
        const userId = await getUserId();
        
        const formData = new FormData();
        formData.append('user_id', userId);
        formData.append('title', title);
        formData.append('description', description); 
        formData.append('location', location ? JSON.stringify(location) : '');
        formData.append('file', {
            uri: file.uri,
            type: file.type || 'image/jpeg',
            name: file.fileName || 'memory.jpg'
        });
        formData.append('tags', tags);
        formData.append('date', date || new Date().toISOString());

        
        const response = await fetch(`${API_BASE}/upload_memory`, {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Response data:', data);
        return data;
    } catch (error) {
        console.error('uploadMemory error:', error);
        throw error;
    }
};

export const getMemories = async () => {
    try {
        const userId = await getUserId();
        console.log('Fetching memories for user ID:', userId);
        const response = await fetch(`${API_BASE}/memories/${userId}`);
        
        if (!response.ok) {
            console.error('Error fetching memories:', response.status);
            return [];
        }
        
        const data = await response.json();
        console.log('Memories response:', data);
        
        const memoriesArray = Array.isArray(data) ? data : (data?.memories || []);
        const memoriesWithFullUrls = memoriesArray.map(memory => ({
            ...memory,
            image: memory.image_url ? `${API_BASE}${memory.image_url}` : memory.image
        }));
        
        console.log('Memories with full URLs:', memoriesWithFullUrls);
        return memoriesWithFullUrls;
    } catch (error) {
        console.error('Error in getMemories:', error);
        return [];
    }
};


export const getTags = async () => {
    const userId = await getUserId();
    try {
        const response = await fetch(`${API_BASE}/tags/${userId}`);
        if (!response.ok) {
            console.error('Error fetching tags:', response.status);
            return [];
        }
        const data = await response.json();
        console.log('getTags:', data);
        return data ? data : [];
        
    } catch (error) {
        console.error('Error in getTags:', error);
        return [];
    }
};

export const uploadTags = async (tags) => {
    try {
        const userId = await getUserId();
        
        const formData = new FormData();
        formData.append('tags', tags);
        console.log("Uploading tags:", tags);
        const response = await fetch(`${API_BASE}/tags/${userId}`, {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (!response.ok) {
            console.error('Error uploading tags:', response.status);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Tags uploaded:', data);
        return data;
    } catch (error) {
        console.error('Error in uploadTags:', error);
        throw error;
    }
};