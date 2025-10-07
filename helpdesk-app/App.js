import React, { useState } from 'react';
import { Button, SafeAreaView } from 'react-native';
import CustomerScreen from './screens/CustomerScreen';
import AdminScreen from './screens/AdminScreen';

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Button
        title={isAdmin ? "Switch to Customer" : "Switch to Admin"}
        onPress={() => setIsAdmin(!isAdmin)}
      />
      {isAdmin ? <AdminScreen /> : <CustomerScreen />}
    </SafeAreaView>
  );
}
