import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';

type DatabaseContextType = {
  db: SQLite.SQLiteDatabase | null;
};

const DatabaseContext = createContext<DatabaseContextType>({ db: null });

export const DatabaseProvider = ({ children }: { children: ReactNode }) => {
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);

  useEffect(() => {
    const database = SQLite.openDatabase('activities.db');
    setDb(database);
  }, []);

  return (
    <DatabaseContext.Provider value={{ db }}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => useContext(DatabaseContext);
