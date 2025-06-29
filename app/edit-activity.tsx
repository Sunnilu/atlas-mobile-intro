import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, TextInput, Button, StyleSheet, Text, Alert } from "react-native";
import { useDatabase } from "@/components/DatabaseProvider";

export default function EditActivityScreen() {
  const { db } = useDatabase();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [steps, setSteps] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (!db || !id) return;

    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM activities WHERE id = ?;",
        [id],
        (_, { rows }) => {
          if (rows.length > 0) {
            const activity = rows.item(0);
            setSteps(String(activity.steps));
            setDate(activity.date);
          }
        },
        (_, error) => {
          console.error("Failed to load activity:", error);
          return false;
        }
      );
    });
  }, [db, id]);

  const updateActivity = () => {
    if (!db || !id) return;

    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE activities SET steps = ?, date = ? WHERE id = ?;",
        [Number(steps), date, id],
        () => {
          Alert.alert("Activity updated!");
          router.replace("/"); // go back to home
        },
        (_, error) => {
          console.error("Failed to update activity:", error);
          return false;
        }
      );
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Steps:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={steps}
        onChangeText={setSteps}
      />
      <Text style={styles.label}>Date (YYYY-MM-DD):</Text>
      <TextInput
        style={styles.input}
        value={date}
        onChangeText={setDate}
      />
      <Button title="Update Activity" onPress={updateActivity} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
});
