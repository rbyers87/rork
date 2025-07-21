import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Filter } from 'lucide-react-native';
import { useScheduleStore } from '@/store/scheduleStore';
import Colors from '@/constants/colors';
import ShiftCard from '@/components/ShiftCard';
import Button from '@/components/Button';

export default function ShiftsScreen() {
  const router = useRouter();
  const { shifts, fetchShifts, isLoading, error, clearError } = useScheduleStore();
  const [filter, setFilter] = useState<'all' | 'recurring' | 'upcoming'>('all');

  useEffect(() => {
    fetchShifts();
  }, []);

  const filteredShifts = () => {
    if (filter === 'all') return shifts;
    
    if (filter === 'recurring') {
      return shifts.filter(shift => 'recurrence' in shift);
    }
    
    if (filter === 'upcoming') {
      const now = new Date();
      return shifts.filter(shift => new Date(shift.startTime) > now);
    }
    
    return shifts;
  };

  const handleCreateShift = () => {
    router.push('/shifts/create');
  };

  const handleRetry = () => {
    clearError();
    fetchShifts();
  };

  if (isLoading && shifts.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading shifts...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Error Loading Shifts</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Button 
          title="Retry"
          onPress={handleRetry}
          variant="primary"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>All Shifts</Text>
        <Button 
          title="Create"
          onPress={handleCreateShift}
          variant="primary"
          size="small"
          icon={<Plus size={16} color="white" />}
        />
      </View>
      
      <View style={styles.filterContainer}>
        <Pressable
          style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>
            All
          </Text>
        </Pressable>
        <Pressable
          style={[styles.filterButton, filter === 'recurring' && styles.activeFilter]}
          onPress={() => setFilter('recurring')}
        >
          <Text style={[styles.filterText, filter === 'recurring' && styles.activeFilterText]}>
            Recurring
          </Text>
        </Pressable>
        <Pressable
          style={[styles.filterButton, filter === 'upcoming' && styles.activeFilter]}
          onPress={() => setFilter('upcoming')}
        >
          <Text style={[styles.filterText, filter === 'upcoming' && styles.activeFilterText]}>
            Upcoming
          </Text>
        </Pressable>
      </View>
      
      {filteredShifts().length > 0 ? (
        <FlatList
          data={filteredShifts()}
          renderItem={({ item }) => <ShiftCard shift={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.shiftsList}
          showsVerticalScrollIndicator={false}
          refreshing={isLoading}
          onRefresh={fetchShifts}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No shifts found</Text>
          <Text style={styles.emptyDescription}>
            There are no shifts matching your current filter. Try changing the filter or create a new shift.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: Colors.border,
    borderRadius: 8,
    padding: 4,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeFilter: {
    backgroundColor: Colors.card,
  },
  filterText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  activeFilterText: {
    color: Colors.primary,
    fontWeight: '500',
  },
  shiftsList: {
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.text.secondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: Colors.background,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.error,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
});
