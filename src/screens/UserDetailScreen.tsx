import { useEffect, useRef, useState } from 'react';
import { Animated, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { UserAvatar } from '../components/UserAvatar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { api } from '../api/client';
import { User } from '../types';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'UserDetail'>;

function SkeletonDetail() {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <View style={[styles.avatar, styles.bone]} />
      <View style={[styles.bone, { width: 160, height: 24, borderRadius: 4, marginBottom: 10 }]} />
      <View style={[styles.bone, { width: 200, height: 15, borderRadius: 4 }]} />
    </Animated.View>
  );
}

export function UserDetailScreen({ route }: Props) {
  const { userId } = route.params;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    setTimeout(() => {
      api
        .getUser(userId)
        .then((res) => { setUser(res.data); setError(null); })
        .catch((err: Error) => setError(err.message))
        .finally(() => { setLoading(false); setRefreshing(false); });
    }, 1000);
  };

  useEffect(() => { fetchUser(); }, [userId]);

  if (loading) return <SkeletonDetail />;

  if (error || !user) {
    return (
      <ScrollView
        contentContainerStyle={styles.centered}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchUser(true)} />}
      >
        <Text style={styles.errorText}>Could not load profile</Text>
        {error && <Text style={styles.errorDetail}>{error}</Text>}
      </ScrollView>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchUser(true)} />}
    >
      <UserAvatar uri={user.id === 1 ? 'bad-url' : user.avatar} style={styles.avatar} />
      <Text style={styles.name}>{user.first_name} {user.last_name}</Text>
      <Text style={styles.email}>{user.email}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 20 },
  bone: { backgroundColor: '#e0e0e0' },
  name: { fontSize: 24, fontWeight: '700', color: '#111', marginBottom: 6 },
  email: { fontSize: 15, color: '#555' },
  errorText: { fontSize: 16, fontWeight: '600', color: '#c00', marginBottom: 6 },
  errorDetail: { fontSize: 13, color: '#666' },
});
