import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserListScreen } from '../screens/UserListScreen';
import { UserDetailScreen } from '../screens/UserDetailScreen';
import { AddTeammateScreen } from '../screens/AddTeammateScreen';

export type RootStackParamList = {
  UserList: undefined;
  UserDetail: { userId: number };
  AddTeammate: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerBackButtonDisplayMode: 'minimal' }}>
      <Stack.Screen name="UserList" component={UserListScreen} options={{ title: 'Team Directory' }} />
      <Stack.Screen name="UserDetail" component={UserDetailScreen} options={{ title: 'Profile' }} />
      <Stack.Screen name="AddTeammate" component={AddTeammateScreen} options={{ title: 'Add Teammate' }} />
    </Stack.Navigator>
  );
}
