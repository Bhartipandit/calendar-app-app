// src/components/Home.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Calendar } from "react-native-calendars";

type Holiday = {
  title: string;
  date: string;
  color?: string;
};

type CalendarDay = {
  dateString: string; // YYYY-MM-DD
  day: number;
  month: number;
  year: number;
  timestamp: number;
};

type Note = {
  id?: string;
  title: string;
  date: string;
  color: string;
};

type HomeProps = {
  userEmail: string;
};

const Home: React.FC<HomeProps> = ({ userEmail }) => {
  const [selectedState, setSelectedState] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);

  // Fetch holidays
  useEffect(() => {
    if (!selectedState) return;

    fetch(`${process.env.EXPO_PUBLIC_API_URL}/holidays/${selectedState}`)
      .then((res) => res.json())
      .then((data) => {
        const gazettedEvents = data.holidays.gazetted.map((h: Holiday) => ({
          ...h,
          color: "#1e90ff",
        }));
        const restrictedEvents = data.holidays.restricted.map((h: Holiday) => ({
          ...h,
          color: "#ff4040",
        }));
        setHolidays([...gazettedEvents, ...restrictedEvents]);
      })
      .catch((err) => console.error(err));
  }, [selectedState]);

  // Fetch user notes
  useEffect(() => {
    if (!userEmail) return;
    const fetchNotes = async () => {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/notes?user_id=${userEmail}`,
        { cache: "no-store" }
      );
      const data: Note[] = await res.json();
      setNotes(data);
    };
    fetchNotes();
  }, [userEmail]);

  // Add note
  const handleAddNote = async () => {
    if (!noteText || !selectedDate) return;

    const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/notes?user_id=${userEmail}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: noteText, date: selectedDate, color: "#32CD32" }),
    });

    const data = await res.json();
    setNotes((prev) => [...prev, data]);
    setNoteText("");
  };

  // Marked dates for react-native-calendars
  const getMarkedDates = () => {
    const marked: { [key: string]: any } = {};

    holidays.forEach((h) => {
      marked[h.date] = { marked: true, dotColor: h.color || "#1e90ff" };
    });

    notes.forEach((n) => {
      marked[n.date] = { ...(marked[n.date] || {}), marked: true, dotColor: n.color || "#32CD32" };
    });

    if (selectedDate) {
      marked[selectedDate] = { ...(marked[selectedDate] || {}), selected: true, selectedColor: "#ffa500" };
    }

    return marked;
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* State Selector */}
        <View style={styles.stateSelector}>
          {[
            { label: "Select State", value: "" },
            { label: "Bihar", value: "br" },
            { label: "Andhra Pradesh", value: "ap" },
            { label: "West Bengal", value: "wb" },
          ].map((state) => (
            <TouchableOpacity
              key={state.value}
              onPress={() => setSelectedState(state.value)}
              style={[
                styles.stateOption,
                selectedState === state.value && styles.selectedState,
              ]}
            >
              <Text style={styles.stateText}>{state.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Calendar */}
        <Calendar
          onDayPress={(day: CalendarDay) => setSelectedDate(day.dateString)}
          markedDates={getMarkedDates()}
          markingType={"dot"}
        />

        {/* Legend */}
        <View style={styles.legend}>
          <Text style={[styles.legendText, { color: "#1e90ff" }]}>🔵 Gazetted</Text>
          <Text style={[styles.legendText, { color: "#ff4040" }]}>🔴 Restricted</Text>
          <Text style={[styles.legendText, { color: "#32CD32" }]}>🟢 Notes</Text>
        </View>

        {/* Notes List */}
        <View style={styles.notesList}>
          {notes
            .filter((n) => n.date === selectedDate)
            .map((n) => (
              <Text key={n.id} style={[styles.noteItem, { color: n.color }]}>
                • {n.title}
              </Text>
            ))}
        </View>
      </ScrollView>

      {/* Add Note Box */}
      <View style={styles.noteBox}>
        <TextInput
          placeholder={`Add note for ${selectedDate || "..."}`}
          value={noteText}
          onChangeText={setNoteText}
          style={styles.noteInput}
        />
        <TouchableOpacity
          style={styles.noteButton}
          onPress={handleAddNote}
          disabled={!selectedDate}
        >
          <Text style={styles.noteButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  stateSelector: { flexDirection: "row", marginVertical: 10, flexWrap: "wrap" },
  stateOption: {
    backgroundColor: "#2c3e50",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedState: { backgroundColor: "#1a252f" },
  stateText: { color: "#fff", fontSize: 16 },
  legend: { flexDirection: "row", marginVertical: 10 },
  legendText: { marginRight: 10, fontSize: 14 },
  notesList: { marginTop: 10, paddingHorizontal: 5 },
  noteItem: { fontSize: 14, marginVertical: 2 },
  noteBox: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 8,
    elevation: 5,
    alignItems: "center",
  },
  noteInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    paddingHorizontal: 10,
    fontSize: 16,
    marginRight: 5,
  },
  noteButton: {
    backgroundColor: "#2c3e50",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 4,
  },
  noteButtonText: { color: "#fff", fontSize: 16 },
});

export default Home;
