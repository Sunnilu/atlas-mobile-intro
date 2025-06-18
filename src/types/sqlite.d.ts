// types/sqlite.d.ts
declare module 'expo-sqlite' {
  export type WebSQLDatabase = {
    transaction: (
      callback: (tx: SQLTransaction) => void
    ) => void;
  };

  export interface SQLTransaction {
    executeSql(
      sqlStatement: string,
      args?: any[],
      callback?: (tx: SQLTransaction, resultSet: ResultSet) => void,
      errorCallback?: (tx: SQLTransaction, error: any) => boolean
    ): void;
  }

  export interface ResultSet {
    insertId?: number;
    rowsAffected: number;
    rows: {
      length: number;
      item: (index: number) => any;
      _array: any[];
    };
  }

  export function openDatabase(
    name: string
  ): WebSQLDatabase;
}
