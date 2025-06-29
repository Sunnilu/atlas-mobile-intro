import { useContext, useEffect, useState } from "react";
import { DatabaseContext } from "@/components/DatabaseProvider";

export interface Activity {
  id: number;
  steps: number;
  date: string;
  timestamp: number; // ← new field
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
        "SELECT id, steps, date FROM activities ORDER BY date DESC;",
        [],
        (_: unknown, { rows }: { rows: { _array: any[] } }) => {
          const parsed: Activity[] = rows._array.map((row) => {
            const dateString = String(row.date);
            const timestamp = new Date(dateString).getTime();
            return {
              id: Number(row.id),
              steps: Number(row.steps),
              date: dateString,
              timestamp,
            };
          });
          setActivities(parsed);
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
