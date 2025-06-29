import { useContext, useEffect, useState } from "react";
import { DatabaseContext } from "@/components/DatabaseProvider";

export interface Activity {
  id: number;
  steps: number;
  date: string;
}

export function useActivities() {
  const context = useContext(DatabaseContext);
  const db = context?.db;
  const [activities, setActivities] = useState<Activity[]>([]);

  const refreshActivities = () => {
    if (!db) {
      console.error("Database is not available.");
      return;
    }

    db.transaction((tx: any) => {
      tx.executeSql(
        "SELECT * FROM activities ORDER BY date DESC;",
        [],
        (_: unknown, { rows }: { rows: { _array: Activity[] } }) => {
          setActivities(rows._array);
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
