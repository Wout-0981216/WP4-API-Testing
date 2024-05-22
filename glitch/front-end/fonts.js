import { Font } from 'expo-font';

export const loadFonts = async () => {
  await Font.loadAsync({
    'jomhuria': require('./src/fonts/Jomhuria.ttf'),
    'Arial': require('./src/fonts/Arial.ttf'),
  });
};
