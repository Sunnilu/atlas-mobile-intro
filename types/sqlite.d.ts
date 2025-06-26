// // types/sqlite.d.ts

// export interface ResultSet {
//   insertId?: number;
//   rowsAffected: number;
//   rows: {
//     length: number;
//     item: (index: number) => any;
//     _array: any[];
//   };
// }

// export interface SQLTransaction {
//   executeSql(
//     sqlStatement: string,
//     args?: any[],
//     callback?: (tx: SQLTransaction, result: ResultSet) => void,
//     errorCallback?: (tx: SQLTransaction, error: any) => boolean
//   ): void;
// }
// export interface SQLDatabase {
//   transaction(
//     callback: (tx: SQLTransaction) => void,
//     errorCallback?: (error: any) => void,
//     successCallback?: () => void
//   ): void;
// }
// types/expo-sqlite-next.d.ts
// types/expo-sqlite.d.ts
declare module 'expo-sqlite' {
  export type SQLTransaction = any;
  export type SQLResultSet = any;
  export type SQLError = any;
}

