import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { supabase } from '@/lib/supabase';
import Colors from '@/constants/colors';
import Button from '@/components/Button';

interface OfficerFormData {
  name: string;
  badge: string;
  rank: string;
  department: string;
  email: string;
  phone: string;
  avatar: string;
  isSupervisor: boolean;
  vacationBalance: number;
  holidayBalance: number;
  sickBalance: number;
}

const RANKS = [
  'Officer',
  'Corporal',
  'Sergeant',
  'Lieutenant',
  'Captain',
  'Major',
  'Chief',
  'Detective',
];

const DEPARTMENTS = [
  'Patrol',
  'Traffic',
  'Investigations',
  'Administration',
  'K-9',
  'SWAT',
  'Community Relations',
];

export default function CreateOfficerScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<OfficerFormData>({
    name: '',
    badge: '',
    rank: 'Officer',
    department: 'Patrol',
    email: '',
    phone: '',
    avatar: '',
    isSupervisor: false,
    vacationBalance: 120,
    holidayBalance: 40,
    sickBalance: 80,
  });

  const updateFormData = (field: keyof OfficerFormData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Name is required');
      return false;
    }
    if (!formData.badge.trim()) {
      Alert.alert('Error', 'Badge number is required');
      return false;
    }
    if (!formData.email.trim()) {
      Alert.alert('Error', 'Email is required');
      return false;
    }
    if (!formData.email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('officers')
        .insert({
          name: formData.name.trim(),
          badge: formData.badge.trim(),
          rank: formData.rank,
          department: formData.department,
          email: formData.email.trim(),
          phone: formData.phone.trim() || null,
          avatar: formData.avatar.trim() || null,
          is_supervisor: formData.isSupervisor,
          vacation_balance: formData.vacationBalance,
          holiday_balance: formData.holidayBalance,
          sick_balance: formData.sickBalance,
        });

      if (error) throw error;

      Alert.alert('Success', 'Officer created successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to create officer');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Stack.Screen 
        options={{ 
          title: 'Create Officer',
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text.primary,
        }} 
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(value) => updateFormData('name', value)}
                placeholder="Enter full name"
                placeholderTextColor={Colors.text.light}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Badge Number *</Text>
              <TextInput
                style={styles.input}
                value={formData.badge}
                onChangeText={(value) => updateFormData('badge', value)}
                placeholder="B-1234"
                placeholderTextColor={Colors.text.light}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(value) => updateFormData('email', value)}
                placeholder="officer@police.gov"
                placeholderTextColor={Colors.text.light}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone</Text>
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(value) => updateFormData('phone', value)}
                placeholder="555-123-4567"
                placeholderTextColor={Colors.text.light}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Avatar URL</Text>
              <TextInput
                style={styles.input}
                value={formData.avatar}
                onChangeText={(value) => updateFormData('avatar', value)}
                placeholder="https://example.com/avatar.jpg"
                placeholderTextColor={Colors.text.light}
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Department & Rank</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Rank</Text>
              <View style={styles.pickerContainer}>
                {RANKS.map((rank) => (
                  <Button
                    key={rank}
                    title={rank}
                    onPress={() => updateFormData('rank', rank)}
                    variant={formData.rank === rank ? 'primary' : 'secondary'}
                    style={styles.pickerButton}
                  />
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Department</Text>
              <View style={styles.pickerContainer}>
                {DEPARTMENTS.map((dept) => (
                  <Button
                    key={dept}
                    title={dept}
                    onPress={() => updateFormData('department', dept)}
                    variant={formData.department === dept ? 'primary' : 'secondary'}
                    style={styles.pickerButton}
                  />
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Supervisor Status</Text>
              <View style={styles.switchContainer}>
                <Button
                  title={formData.isSupervisor ? 'Supervisor' : 'Officer'}
                  onPress={() => updateFormData('isSupervisor', !formData.isSupervisor)}
                  variant={formData.isSupervisor ? 'primary' : 'secondary'}
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PTO Balances (Hours)</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Vacation Balance</Text>
              <TextInput
                style={styles.input}
                value={formData.vacationBalance.toString()}
                onChangeText={(value) => updateFormData('vacationBalance', parseInt(value) || 0)}
                placeholder="120"
                placeholderTextColor={Colors.text.light}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Holiday Balance</Text>
              <TextInput
                style={styles.input}
                value={formData.holidayBalance.toString()}
                onChangeText={(value) => updateFormData('holidayBalance', parseInt(value) || 0)}
                placeholder="40"
                placeholderTextColor={Colors.text.light}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Sick Balance</Text>
              <TextInput
                style={styles.input}
                value={formData.sickBalance.toString()}
                onChangeText={(value) => updateFormData('sickBalance', parseInt(value) || 0)}
                placeholder="80"
                placeholderTextColor={Colors.text.light}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Cancel"
          onPress={() => router.back()}
          variant="secondary"
          style={styles.footerButton}
        />
        <Button
          title={isLoading ? 'Creating...' : 'Create Officer'}
          onPress={handleSubmit}
          variant="primary"
          style={styles.footerButton}
          disabled={isLoading}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.card,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.text.primary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pickerButton: {
    marginRight: 0,
    marginBottom: 8,
  },
  switchContainer: {
    flexDirection: 'row',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  footerButton: {
    flex: 1,
  },
});
