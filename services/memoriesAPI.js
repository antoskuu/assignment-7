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



export const uploadMemory = async (file, title, location) => {
    try {
        const userId = await getUserId();
        console.log('userId:', userId);
        console.log('Preparing FormData...');
        
        const formData = new FormData();
        formData.append('user_id', userId);
        formData.append('title', title);
        formData.append('location', location ? JSON.stringify(location) : '');
        formData.append('file', {
            uri: file.uri,
            type: file.type || 'image/jpeg',
            name: file.fileName || 'memory.jpg'
        });

        console.log('Sending request to:', `${API_BASE}/upload_memory`);
        console.log('File data:', {
            uri: file.uri,
            type: file.type,
            name: file.fileName
        });

        const response = await fetch(`${API_BASE}/upload_memory`, {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        
        console.log('Response received, status:', response.status);
        
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
        
        // Convertir les chemins d'images relatifs en URLs complètes
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

export const getCartItems = async () => {
    const cartId = await getCartId();
    console.log('Fetching cart items for cart ID:', cartId);
    console.log('API URL:', `${API_BASE}/cart?user_id=${cartId}`);
    const response = await fetch(`${API_BASE}/cart?user_id=${cartId}`);
    const data = await response.json();
    return data;
};



export const delItemFromCart = async (itemId) => {
    const cartId = await getCartId();
    const response = await fetch (`${API_BASE}/cart?id=${itemId}&user_id=${cartId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    console.log('Response status for deleting item from cart:', response.status);
    parseInt(response.status) >= 400 && console.warn('Error deleting item from cart:', response.status);

    return response.json();
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
        console.log('Tags fetched:', data);
        return Array.isArray(data) ? data : [];  // Changed from data.tags
    } catch (error) {
        console.error('Error in getTags:', error);
        return [];
    }
};

export const uploadTags = async (tags) => {
    try {
        const userId = await getUserId();
        
        const formData = new FormData();
        formData.append('tags', JSON.stringify(tags));

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