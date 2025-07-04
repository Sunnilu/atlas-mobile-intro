import { useActivities } from "@/hooks/useActivities";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  const { activities = [], refreshActivities } = useActivities();

  // Auto-refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refreshActivities();
    }, [])
  );

  return (
    <View style={styles.container}>
      {activities.length > 0 ? (
        activities.map((activity) => (
          <Text key={activity.id}>
            {activity.steps} steps on{" "}
            {new Date(activity.date).toLocaleDateString()}
          </Text>
        ))
      ) : (
        <Text>No activities yet.</Text>
      )}

      <Link style={styles.link} href="/add-activity" replace>
        <Text style={styles.buttonText}>Add Activity</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  link: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#007AFF",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
