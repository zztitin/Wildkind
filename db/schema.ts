import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const wildkindState = sqliteTable("wildkind_state", {
  ownerId: text("owner_id").primaryKey(),
  payload: text("payload").notNull(),
  updatedAt: text("updated_at").notNull(),
});
