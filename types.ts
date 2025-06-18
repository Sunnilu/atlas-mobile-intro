// types.ts
export type RootStackParamList = {
  Home: undefined;
  AddActivity: undefined; // Or { someParam: string } if it takes params
};
export type TabParamList = {
  Home: undefined;
  Explore: undefined;
  Settings: undefined;
};

export interface Transaction {
  executeSql(sqlQuery: string, args?: any[]): Promise<{ rows: { _array?: any[] } }>;
}

export interface Database {
  withTransactionAsync<T>(callback: (tx: Transaction) => Promise<T>): Promise<T>;
}

declare global {
  namespace ExpoSQLite {
    interface SQLiteDatabase extends Database {}
  }
}