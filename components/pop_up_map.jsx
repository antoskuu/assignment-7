
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@react-navigation/native';

export default function PopUpMap({ marker, setSelectedMarker }) {
    const { colors } = useTheme();
    return (
        <View style={{
            position: 'absolute',
            bottom: 20,
            left: 20,
            right: 20,
            backgroundColor: colors.card || 'white',
            borderRadius: 15,
            padding: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 10,
        }}>
            <TouchableOpacity
                onPress={() => setSelectedMarker(null)}
                style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                }}
            >
                <Text style={{ fontSize: 20, color: colors.text, fontWeight: 'bold' }}>×</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap'}}>
                {marker.image && (
                    <Image 
                        source={{uri: marker.image}} 
                        style={{
                            width: '50%', 
                            height: 150, 
                            resizeMode: 'cover', 
                            borderRadius: 10, 
                            marginBottom: 12
                        }} 
                    />
                )}
                <View style={{ flex: 1, marginLeft: marker.image ? 12 : 0 }}>
                    <Text style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: colors.text || '#000',
                        marginBottom: 8,
                        paddingRight: 30,
                    }}>
                        {marker.title}
                    </Text>
                    <Text style={{
                        fontSize: 14,
                        color: colors.text || '#000',
                        marginBottom: 8,
                        paddingRight: 30,
                    }}>
                        {marker.description}
                    </Text>
                    <Text style={{
                        fontSize: 12,
                        color: colors.text || '#000',
                        marginBottom: 12,
                        paddingRight: 30,
                    }}>
                        {new Date(marker.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                    </Text>                           
                    {marker.tags && marker.tags.length > 0 && (
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 }}>
                            {marker.tags.slice(0, 3).map((tag, idx) => (
                                <View
                                    key={idx}
                                    style={{
                                        backgroundColor: tag[1],
                                        paddingHorizontal: 8,
                                        paddingVertical: 4,
                                        borderRadius: 10,
                                        marginRight: 6,
                                        marginBottom: 4,
                                    }}
                                >
                                    <Text style={{ fontSize: 11, color: 'white', fontWeight: '500' }}>
                                        {tag[0]}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
}