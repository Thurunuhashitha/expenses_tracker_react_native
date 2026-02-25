import { View } from "react-native";
// import AddExpenses from './src/screens/Expenses/AddExpenses';
import Login from './src/screens/Login/Login'
// import Register from './src/screens/Register/Register'
import GetAllExpenses from "./src/screens/Expenses/GetAllExpenses";
import DeleteExpenses from "./src/screens/Expenses/DeleteExpenses";
import SearchExpenses from "./src/screens/Expenses/SearchExpensers";

function App() {
  return (
    <View>
      {/* <Register /> */}
      {/* <Login /> */}
      {/* <AddExpenses /> */}
      {/* <GetAllExpenses /> */}
      {/* <DeleteExpenses /> */}
      <SearchExpenses />
    </View>
  );
}

export default App;
 