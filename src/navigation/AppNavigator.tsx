import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserListScreen } from '../screens/UserListScreen';
import { UserDetailScreen } from '../screens/UserDetailScreen';

export type RootStackParamList = {
  UserList: undefined;
  UserDetail: { userId: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerBackButtonDisplayMode: 'minimal' }}>
      <Stack.Screen name="UserList" component={UserListScreen} options={{ title: 'Team Directory' }} />
      <Stack.Screen name="UserDetail" component={UserDetailScreen} options={{ title: 'Profile' }} />
    </Stack.Navigator>
  );
}
