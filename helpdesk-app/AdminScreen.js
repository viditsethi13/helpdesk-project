import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Button, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import axios from 'axios';

// Component to handle the display and interaction for a single ticket
const TicketItem = ({ item, updateStatus, addResponse }) => {
  const [responseText, setResponseText] = useState('');

  const handleResponseSubmit = () => {
    if (responseText.trim()) {
      addResponse(item.id, responseText);
      setResponseText('');
    }
  };

  return (
    <View style={{ borderWidth: 1, padding: 8, marginBottom: 16, borderRadius: 5 }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Ticket #{item.id}</Text>
      <Text>Name: {item.name}</Text>
      <Text>Email: {item.email}</Text>
      <Text style={{ marginTop: 4, fontStyle: 'italic' }}>Description: {item.description}</Text>
      
      <Text style={{ marginTop: 8, fontWeight: 'bold' }}>Status: {item.status}</Text>

      {/* Display Logs/Responses */}
      {item.logs && item.logs.length > 0 && (
        <View style={{ marginTop: 8 }}>
          <Text style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}>Admin Logs:</Text>
          {item.logs.map((log, index) => (
            <Text key={index} style={{ fontSize: 12, color: 'darkgray', marginTop: 2 }}>
              {log}
            </Text>
          ))}
        </View>
      )}
      
      {/* Response/Logging Section - ALWAYS VISIBLE */}
      <View style={{ marginTop: 12, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#eee' }}>
  <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Add New Response/Log:</Text>
  <TextInput
    // ... input styles and props
    placeholder="Type admin response/log here..."
    value={responseText}
    onChangeText={setResponseText}
  />
  <Button 
    title="Send Response/Log" // <-- THE BUTTON TITLE
    onPress={handleResponseSubmit} 
    disabled={!responseText.trim()} 
    color="#4CAF50" 
  />
</View>

      {/* Status Update Buttons */}
      <View style={{ flexDirection: 'row', marginTop: 12, justifyContent: 'space-around' }}>
        <Button 
          title="Mark In Progress" 
          onPress={() => updateStatus(item.id, 'in_progress')}
          color="#FFA500" // Orange button
        />
        <View style={{ width: 10 }} />
        <Button 
          title="Mark Resolved" 
          onPress={() => updateStatus(item.id, 'resolved')} 
          color="#007BFF" // Blue button
        />
      </View>
    </View>
  );
};


export default function AdminScreen() {
  const [tickets, setTickets] = useState([]);

  const fetchTickets = async () => {
    try {
      console.log('Submitting to URL:', 'https://helpdesk-backend-ruby.vercel.app/api/tickets');
      const res = await axios.get('https://helpdesk-backend-ruby.vercel.app/api/tickets');
      setTickets(res.data);
    } catch (err) {
      console.log('Submitting to URL:', 'https://helpdesk-backend-ruby.vercel.app/api/tickets');
      console.error('Error fetching tickets:', err);
      alert('Failed to fetch tickets.');
    }
  };

  const updateStatus = async (id, status) => {
    try {
        await axios.patch(`https://helpdesk-backend-ruby.vercel.app/api/tickets/${id}`, { status });
        fetchTickets();
    } catch (err) {
        console.error('Error updating status:', err);
        alert('Failed to update status.');
    }
  };

  const addResponse = async (id, responseText) => {
    try {
        // Assuming your backend expects a 'log' field to add a new entry
        await axios.patch(`https://helpdesk-backend-ruby.vercel.app/api/tickets/${id}`, {
            log: `[${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}] Admin: ${responseText}`
        });
        fetchTickets();
    } catch (err) {
        console.error('Error adding response:', err);
        alert('Failed to add response/log.');
    }
  };


  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        // Adjust this offset based on your app's header height
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0} 
    >
      <View style={{ padding: 16, flex: 1 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Ticket Management</Text>
        <FlatList
          data={tickets}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TicketItem 
                item={item} 
                updateStatus={updateStatus} 
                addResponse={addResponse} 
            />
          )}
        />
        <Button 
          title="Refresh Tickets" 
          onPress={fetchTickets} 
          color="#607D8B" // Blue-gray color
        />
      </View>
    </KeyboardAvoidingView>
  );
}