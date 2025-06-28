import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useDatabase } from './DatabaseProvider';

type Activity = {
  id: number;
  steps: number;
  date: number;
};

type ActivitiesContextType = {
  activities: Activity[];
  refreshActivities: () => void;
};

const ActivitiesContext = createContext<ActivitiesContextType>({
  activities: [],
  refreshActivities: () => {},
});

export const ActivitiesProvider = ({ children }: { children: ReactNode }) => {
  const { db } = useDatabase();
  const [activities, setActivities] = useState<Activity[]>([]);

  const refreshActivities = () => {
    if (!db) return;

    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM activities ORDER BY date DESC;',
        [],
        (_, { rows }) => {
          const loaded: Activity[] = [];
          for (let i = 0; i < rows.length; i++) {
            loaded.push(rows.item(i));
          }
          setActivities(loaded);
        },
        (_, error) => {
          console.error('Failed to fetch activities:', error);
          return true;
        }
      );
    });
  };

  useEffect(() => {
    if (db) refreshActivities();
  }, [db]);

  return (
    <ActivitiesContext.Provider value={{ activities, refreshActivities }}>
      {children}
    </ActivitiesContext.Provider>
  );
};

export const useActivities = () => useContext(ActivitiesContext);
