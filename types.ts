// ---------- Classic SQLite Transaction Types ----------
export type SQLiteResultSet = {
  rows: {
    length: number;
    item: (index: number) => any;
    _array: any[];
  };
};

export type SQLiteTransaction = {
  executeSql: (
    sqlStatement: string,
    args?: any[],
    callback?: (tx: SQLiteTransaction, resultSet: SQLiteResultSet) => void,
    errorCallback?: (tx: SQLiteTransaction, error: any) => boolean
  ) => void;
};

// ---------- App Navigation Param Lists ----------
export type RootStackParamList = {
  Home: undefined;
  AddActivity: undefined; // Add params if needed in the future
};

export type TabParamList = {
  Home: undefined;
  Explore: undefined;
  Settings: undefined;
};

// ---------- Async SQLite Wrapper Interfaces ----------
export interface Transaction {
  executeSql(sqlQuery: string, args?: any[]): Promise<{ rows: { _array?: any[] } }>;
}

export interface Database {
  withTransactionAsync<T>(callback: (tx: Transaction) => Promise<T>): Promise<T>;
}

// ---------- Extend SQLiteDatabase Type Globally ----------
declare global {
  namespace ExpoSQLite {
    interface SQLiteDatabase extends Database {}
  }
}
