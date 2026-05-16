import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
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
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 0 }}>
          <Image
            source={require('../../assets/omise.png')}
            style={{ width: 52, height: 20 }}
            resizeMode="contain"
            accessibilityLabel="Omise"
          />
        </View>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('AddTeammate')}
          accessibilityLabel="Add teammate"
        >
          <Text style={{ fontSize: 28, color: '#000', paddingHorizontal: 8, lineHeight: 32 }}>+</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const fetchUsers = (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    setTimeout(() => {
      api
        .getUsers(1)
        .then((res) => {
          setUsers(res.data);
          setTotalPages(res.total_pages);
          setPage(1);
          setError(null);
        })
        .catch((err: Error) => setError(err.message))
        .finally(() => { setLoading(false); setRefreshing(false); });
    }, 1000);
  };

  const fetchMore = () => {
    if (loadingMore || page >= totalPages) return;
    const nextPage = page + 1;
    setLoadingMore(true);
    setTimeout(() => {
      api
        .getUsers(nextPage)
        .then((res) => { setUsers((prev) => [...prev, ...res.data]); setPage(nextPage); })
        .catch((err: Error) => setError(err.message))
        .finally(() => setLoadingMore(false));
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

  const footer = page < totalPages ? (
    <TouchableOpacity style={styles.loadMore} onPress={fetchMore} disabled={loadingMore} accessibilityLabel="Load more">
      {loadingMore
        ? <ActivityIndicator color="#888" />
        : <Text style={styles.loadMoreText}>Load more</Text>
      }
    </TouchableOpacity>
  ) : null;

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={users.length === 0 ? styles.centered : styles.list}
      ListEmptyComponent={<Text style={styles.emptyText}>No team members found.</Text>}
      ListFooterComponent={footer}
      refreshing={refreshing}
      onRefresh={() => fetchUsers(true)}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.row}
          onPress={() => navigation.navigate('UserDetail', { userId: item.id })}
          accessibilityLabel={`View profile of ${item.first_name} ${item.last_name}`}
        >
          <UserAvatar uri={item.id === 1 ? 'https://reqres.in/img/faces/invalid.jpg' : item.avatar} style={styles.avatar} />
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
  loadMore: {
    marginTop: 16,
    marginBottom: 8,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    alignItems: 'center',
  },
  loadMoreText: { fontSize: 13, color: '#555', letterSpacing: 0.5 },
});
