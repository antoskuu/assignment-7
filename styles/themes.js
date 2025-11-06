import {
  DefaultTheme as NavLightTheme,
  DarkTheme as NavDarkTheme,
} from '@react-navigation/native';

export const MyLightTheme = {
  ...NavLightTheme,
  colors: {
    ...NavLightTheme.colors,
    primary: '#FF6B35',        // Orange pour les éléments actifs
    background: '#FFF8DC',     // Beige clair
    card: '#FFFFFF',           // Blanc pour les cartes
    text: '#2C2C2C',          // Gris foncé pour le texte
    border: '#E0E0E0',        // Gris clair pour les bordures
    notification: '#FF6B35',   // Orange pour les notifications
    // Couleurs custom
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FF9800',
  },
};

export const MyDarkTheme = {
  ...NavDarkTheme,
  colors: {
    ...NavDarkTheme.colors,
    primary: '#FF8C61',        // Orange plus clair en dark mode
    background: '#121212',     // Noir profond
    card: '#1E1E1E',          // Gris très foncé pour les cartes
    text: '#FFFFFF',          // Blanc pour le texte
    border: '#2C2C2C',        // Gris foncé pour les bordures
    notification: '#FF8C61',   // Orange clair pour les notifications
    // Couleurs custom
    success: '#66BB6A',
    error: '#EF5350',
    warning: '#FFA726',
  },
};
