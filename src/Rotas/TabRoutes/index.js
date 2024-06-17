
import Home from '../../pages/Home/index';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Contratos from '../../pages/Contratos/index';
import Procurar from '../../pages/Procurar/index'

const Stack = createNativeStackNavigator();

export default function TabRoutes() {
    return (
        <Stack.Navigator>
        <Stack.Screen
          name="Procurar"
          component={Procurar}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Contratos"
          component={Contratos}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    );
}
