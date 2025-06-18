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
