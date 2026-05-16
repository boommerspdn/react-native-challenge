import { useState } from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';

const FALLBACK = require('../../assets/avatar.png');

interface Props {
  uri: string;
  style?: StyleProp<ImageStyle>;
}

export function UserAvatar({ uri, style }: Props) {
  const [failed, setFailed] = useState(false);
  return (
    <Image
      source={failed ? FALLBACK : { uri }}
      style={style}
      onError={() => setFailed(true)}
    />
  );
}
