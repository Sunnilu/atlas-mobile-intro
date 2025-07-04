// types/sqlite-helper.d.ts
declare module 'expo-sqlite' {
  export interface ResultSet {
    insertId?: number;
    rowsAffected: number;
    rows: {
      length: number;
      item: (index: number) => any;
      _array: any[];
    };
  }

  export interface SQLTransaction {
    executeSql(
      sqlStatement: string,
      args?: any[],
      callback?: (tx: SQLTransaction, result: ResultSet) => void,
      errorCallback?: (tx: SQLTransaction, error: any) => boolean
    ): void;
  }

  export interface SQLDatabase {
    transaction(
      callback: (tx: SQLTransaction) => void,
      errorCallback?: (error: any) => void,
      successCallback?: () => void
    ): void;
    close(): Promise<void>;
  }

  export function openDatabase(name: string): SQLDatabase;
  export function enablePromise(arg0: boolean): void;
}

export default SQLite;