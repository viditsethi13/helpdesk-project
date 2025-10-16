import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert, Button, Image, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { TicketService } from '../services/ticketService';

export default function CustomerScreen() {
  const [form, setForm] = useState({ name: '', email: '', description: '' });
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const showAlert = (title, message) => {
    if (Platform.OS === "web") window.alert(`${title}\n${message}`);
    else Alert.alert(title, message);
  };

  const submitTicket = async () => {
    if (!form.name) return showAlert("Missing Field", "Please enter your name.");
    if (!form.email) return showAlert("Missing Field", "Please enter your email.");
    if (!form.description) return showAlert("Missing Field", "Please describe your issue.");
    if (!image) return showAlert("Missing Attachment", "Please attach a photo or screenshot.");

    try {
      const res = await TicketService.createTicket({ ...form, attachment: image });
      showAlert("Success", `Ticket submitted! ID: ${res.data.id}`);
      setForm({ name: '', email: '', description: '' });
      setImage(null);
    } catch (err) {
      console.error('Error submitting ticket:', err.response?.data || err.message);
      showAlert('Error submitting ticket', JSON.stringify(err.response?.data || err.message, null, 2));
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text>Name *</Text>
      <TextInput style={{ borderWidth: 1, marginBottom: 8 }} value={form.name} onChangeText={(t) => setForm({ ...form, name: t })} />
      <Text>Email *</Text>
      <TextInput style={{ borderWidth: 1, marginBottom: 8 }} value={form.email} onChangeText={(t) => setForm({ ...form, email: t })} />
      <Text>Description *</Text>
      <TextInput multiline numberOfLines={4} style={{ borderWidth: 1, marginBottom: 8 }} value={form.description} onChangeText={(t) => setForm({ ...form, description: t })} />

      <TouchableOpacity onPress={pickImage}>
        <Text style={{ color: 'blue', marginBottom: 8 }}>Attach Photo/Attachment *</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={{ width: 100, height: 100 }} />}

      <Button title="Submit Ticket" onPress={submitTicket} />
    </View>
  );
}
