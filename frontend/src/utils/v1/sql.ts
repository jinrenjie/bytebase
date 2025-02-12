import { NullValue } from "@/types/proto/google/protobuf/struct";
import { Engine } from "@/types/proto/v1/common";
import { RowValue } from "@/types/proto/v1/sql_service";

export const extractSQLRowValue = (value: RowValue) => {
  if (value.nullValue === NullValue.NULL_VALUE) {
    return null;
  }

  const plainObject = RowValue.toJSON(value) as Record<string, any>;
  const keys = Object.keys(plainObject);
  if (keys.length === 0) {
    console.debug("empty row value", value);
    return null;
  }
  if (keys.length > 1) {
    console.debug("mixed type in row value", value);
  }
  const key = keys[0];
  return plainObject[key];
};

export const wrapSQLIdentifier = (id: string, engine: Engine) => {
  if (engine === Engine.MSSQL) {
    return `[${id}]`;
  }
  if (
    [
      Engine.POSTGRES,
      Engine.SQLITE,
      Engine.SNOWFLAKE,
      Engine.ORACLE,
      Engine.OCEANBASE_ORACLE,
      Engine.REDSHIFT,
    ].includes(engine)
  ) {
    return `"${id}"`;
  }

  return "`" + id + "`";
};
