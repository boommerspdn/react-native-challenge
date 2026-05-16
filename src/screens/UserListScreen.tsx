import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { api } from '../api/client';
import { User } from '../types';
import { RootStackParamList } from '../navigation/AppNavigator';
import { UserAvatar } from '../components/UserAvatar';

type Props = NativeStackScreenProps<RootStackParamList, 'UserList'>;

function SkeletonRow() {
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
    <Animated.View style={[styles.row, { opacity }]}>
      <View style={[styles.avatar, styles.bone]} />
      <View style={styles.info}>
        <View style={[styles.bone, { width: '55%', height: 16, borderRadius: 4 }]} />
        <View style={[styles.bone, { width: '75%', height: 13, borderRadius: 4, marginTop: 6 }]} />
      </View>
    </Animated.View>
  );
}

export function UserListScreen({ navigation }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    setTimeout(() => {
      api
        .getUsers()
        .then((res) => { setUsers(res.data); setError(null); })
        .catch((err: Error) => setError(err.message))
        .finally(() => { setLoading(false); setRefreshing(false); });
    }, 1000);
  };

  useEffect(() => { fetchUsers(); }, []);

  if (loading) {
    return (
      <View style={styles.list}>
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonRow key={i} />
        ))}
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Failed to load users</Text>
        <Text style={styles.errorDetail}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={users.length === 0 ? styles.centered : styles.list}
      ListEmptyComponent={<Text style={styles.emptyText}>No team members found.</Text>}
      refreshing={refreshing}
      onRefresh={() => fetchUsers(true)}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.row}
          onPress={() => navigation.navigate('UserDetail', { userId: item.id })}
          accessibilityLabel={`View profile of ${item.first_name} ${item.last_name}`}
        >
          <UserAvatar uri={item.id === 1 ? 'bad-url' : item.avatar} style={styles.avatar} />
          <View style={styles.info}>
            <Text style={styles.name}>{item.first_name} {item.last_name}</Text>
            <Text style={styles.email}>{item.email}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { padding: 16 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  avatar: { width: 52, height: 52, borderRadius: 26, marginRight: 12 },
  bone: { backgroundColor: '#e0e0e0' },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600', color: '#111' },
  email: { fontSize: 13, color: '#666', marginTop: 2 },
  errorText: { fontSize: 16, fontWeight: '600', color: '#c00', marginBottom: 6 },
  errorDetail: { fontSize: 13, color: '#666' },
  emptyText: { fontSize: 15, color: '#666' },
});
