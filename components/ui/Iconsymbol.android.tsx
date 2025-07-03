// iconsymbol.android.tsx
import { View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export function IconSymbol({ name = 'help', size = 24, color = 'black', style }: any) {
  return (
    <MaterialIcons name={name} size={size} color={color} style={style} />
  );
}
