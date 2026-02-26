import AddExpenses from './src/screens/Expenses/AddExpenses';
import Login from './src/screens/Login/Login'
import Register from './src/screens/Register/Register'
import GetAllExpenses from "./src/screens/Expenses/GetAllExpenses";
import DeleteExpenses from "./src/screens/Expenses/DeleteExpenses";
import SearchExpenses from "./src/screens/Expenses/SearchExpensers";
import CalculationExpenses from "./src/screens/Expenses/CalculationExpenses";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

function App() {
  return ( 
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="GetAllExpenses" component={GetAllExpenses} />
      <Stack.Screen name="DeleteExpenses" component={DeleteExpenses} />
      <Stack.Screen name="SearchExpenses" component={SearchExpenses} />
      <Stack.Screen name="CalculationExpenses" component={CalculationExpenses} /> 
      <Stack.Screen name="AddExpenses" component={AddExpenses} />
    </Stack.Navigator> 
    </NavigationContainer> 
  );
}

export default App;
 