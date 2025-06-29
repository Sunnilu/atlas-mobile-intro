// app/components/DatabaseProvider.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';

type DatabaseType = ReturnType<typeof SQLite.openDatabase>;

type DatabaseContextType = {
  db: DatabaseType | null;
};

export const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<DatabaseType | null>(null);

  useEffect(() => {
    const database = SQLite.openDatabase('activities.db');

    database.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS activities (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          steps INTEGER NOT NULL,
          date TEXT NOT NULL
        );`
      );
    });

    setDb(database);
  }, []);

  return (
    <DatabaseContext.Provider value={{ db }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
}
