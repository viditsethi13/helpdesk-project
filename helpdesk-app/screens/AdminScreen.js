import { useEffect, useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { TicketService } from '../services/ticketService';

const TicketItem = ({ item, updateTicket }) => {
  const [responseText, setResponseText] = useState('');

  const showAlert = (title, message) => {
    if (Platform.OS === "web") window.alert(`${title}\n${message}`);
    else Alert.alert(title, message);
  };

  return (
    <View style={{ borderWidth: 1, padding: 12, marginBottom: 16, borderRadius: 8, backgroundColor: '#fff', elevation: 2 }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Ticket #{item.id}</Text>
      <Text>Name: {item.name}</Text>
      <Text>Email: {item.email}</Text>
      <Text style={{ marginTop: 4, fontStyle: 'italic' }}>Description: {item.description}</Text>
      <Text style={{ marginTop: 8, fontWeight: 'bold' }}>Status: {item.status}</Text>

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

      <View style={{ marginTop: 12, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#eee' }}>
        <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Add New Response/Log:</Text>
        <TextInput
          placeholder="Type admin response/log here..."
          value={responseText}
          onChangeText={setResponseText}
          style={{ borderWidth: 1, borderColor: '#ccc', padding: 6, marginBottom: 8, borderRadius: 5 }}
        />
        <TouchableOpacity
          style={{ backgroundColor: '#4CAF50', padding: 10, borderRadius: 5 }}
          onPress={() => {
            if (responseText.trim()) {
              updateTicket(item.id, null, responseText);
              setResponseText('');
            } else {
              showAlert('Empty Response', 'Please type a log to send.');
            }
          }}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Send Response/Log</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', marginTop: 12, justifyContent: 'space-between' }}>
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: '#FFA500', padding: 10, marginRight: 5, borderRadius: 5 }}
          onPress={() => updateTicket(item.id, 'in_progress', null)}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Mark In Progress</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ flex: 1, backgroundColor: '#007BFF', padding: 10, marginLeft: 5, borderRadius: 5 }}
          onPress={() => updateTicket(item.id, 'resolved', null)}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Mark Resolved</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function AdminScreen() {
  const [tickets, setTickets] = useState([]);

  const fetchTickets = async () => {
    try {
      const res = await TicketService.getTickets();
      setTickets(res.data);
    } catch (err) {
      console.error('Error fetching tickets:', err.response?.data || err.message);
      showAlert('Error', 'Failed to fetch tickets.');
    }
  };

  const updateTicket = async (id, newStatus = null, newLog = null) => {
    try {
      const payload = {};
      if (newStatus) payload.status = newStatus;
      if (newLog) payload.log = `[${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}] Admin: ${newLog}`;
      await TicketService.updateTicket(id, payload);
      fetchTickets();
    } catch (err) {
      console.error('Error updating ticket:', err.response?.data || err.message);
      showAlert('Error', 'Failed to update ticket.');
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Ticket Management</Text>
        {tickets.length === 0 ? (
          <Text>No tickets available.</Text>
        ) : (
          <FlatList data={tickets} keyExtractor={(item) => item.id.toString()} renderItem={({ item }) => <TicketItem item={item} updateTicket={updateTicket} />} scrollEnabled={false} />
        )}

        <TouchableOpacity
          style={{ backgroundColor: '#607D8B', padding: 12, borderRadius: 5, marginTop: 16 }}
          onPress={fetchTickets}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Refresh Tickets</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
