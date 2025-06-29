import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { OpaqueColorValue, StyleProp, TextStyle } from 'react-native';
import { SymbolWeight } from 'expo-symbols';

const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
} as const;

export type IconSymbolName = keyof typeof MAPPING;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return (
    <MaterialIcons
      color={color}
      size={size}
      name={MAPPING[name] ?? 'help-outline'}
      style={typeof style === 'object' && style !== null ? style : undefined}
    />
  );
}
