import { useContext, useEffect, useState } from "react";
import { DatabaseContext } from "@/components/DatabaseProvider";

interface Activity {
  id: number;
  steps: number;
  date: string;
}

export function useActivities() {
  const { db } = useContext(DatabaseContext);
  const [activities, setActivities] = useState<Activity[]>([]);

  const refreshActivities = () => {
    db.transaction((tx: any) => {
      tx.executeSql(
        "SELECT * FROM activities ORDER BY date DESC;",
        [],
        (_, { rows }) => {
          const results: Activity[] = rows._array;
          setActivities(results);
        },
        (error: any) => {
          console.error("Failed to fetch activities:", error);
        }
      );
    });
  };

  useEffect(() => {
    if (db) {
      refreshActivities();
    }
  }, [db]);

  return {
    activities,
    refreshActivities,
  };
}
