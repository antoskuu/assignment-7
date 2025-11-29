
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import CardGrid from './cardGrid.jsx';
import { Image } from 'react-native';
import { ScrollView } from 'react-native';
import { opacity } from 'react-native-reanimated/lib/typescript/Colors.js';

export default function GroupPopUpMap({ markers, selectedMarker, setSelectedMarker, setSelectedGroupedMarker }) {
    const { colors } = useTheme();

    const handleClose = () => {
        setSelectedGroupedMarker(null);
        
    };

    const handleMemoryPress = (marker) => {
        // You can add logic to open a detail view or select a marker
    };

    return (
        <View style={{
        ...(selectedMarker ? { opacity: 0, pointerEvents: selectedMarker ? 'none' : 'auto' } : {}),
            position: 'absolute',
            height: '40%',
            width: '90%',
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
                onPress={handleClose}
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
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 12 }}>
                {markers.length} Memories
            </Text>
    <ScrollView>
   <View style={{
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
}}>

    {markers.map(item => (
        <TouchableOpacity
          key={item.id || item.title}
          onPress={() => {setSelectedMarker(item.id)
          }}
          style={{

      }}
        >
        <Image
            source={{ uri: item.image }}
            style={{ width: 100, height: 100, borderRadius: 8, margin: 4 }}
        />
    </TouchableOpacity>
    ))}
    </View>
    
        </ScrollView>

        </View>
    );
}