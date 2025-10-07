import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

export default function CustomerScreen() {
  const [form, setForm] = useState({ name: '', email: '', description: '' });
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const submitTicket = async () => {
    if (!form.name || !form.email || !form.description || !image) {
      Alert.alert(
        'Required Fields Missing',
        'Please fill in your Name, Email, Description, and attach a Photo/Attachment.'
      );
      return;
    }

    try {
      const res = await axios.post('https://helpdesk-backend-ruby.vercel.app/api/tickets', {
        ...form,
        attachment: image,
      });
      Alert.alert('Success', `Ticket submitted! ID: ${res.data.id}`);
      setForm({ name: '', email: '', description: '' });
      setImage(null);
    } catch (err) {
      console.log('Error submitting ticket:', err.response?.data || err.message);
      Alert.alert(
        'Error submitting ticket',
        JSON.stringify(err.response?.data || err.message, null, 2)
      );
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text>Name *</Text>
      <TextInput
        style={{ borderWidth: 1, marginBottom: 8 }}
        value={form.name}
        onChangeText={(t) => setForm({ ...form, name: t })}
      />
      <Text>Email *</Text>
      <TextInput
        style={{ borderWidth: 1, marginBottom: 8 }}
        value={form.email}
        onChangeText={(t) => setForm({ ...form, email: t })}
      />
      <Text>Description *</Text>
      <TextInput
        multiline
        numberOfLines={4}
        style={{ borderWidth: 1, marginBottom: 8 }}
        value={form.description}
        onChangeText={(t) => setForm({ ...form, description: t })}
      />

      <TouchableOpacity onPress={pickImage}>
        <Text style={{ color: 'blue', marginBottom: 8 }}>Attach Photo/Attachment *</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={{ width: 100, height: 100 }} />}

      <Button title="Submit Ticket" onPress={submitTicket} />
    </View>
  );
}
