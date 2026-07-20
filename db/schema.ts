import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const wildkindState = sqliteTable("wildkind_state", {
  ownerId: text("owner_id").primaryKey(),
  payload: text("payload").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  googleSubject: text("google_subject").notNull(),
  email: text("email").notNull(),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull(),
  name: text("name"),
  avatarUrl: text("avatar_url"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
  lastLoginAt: text("last_login_at").notNull(),
}, (table) => [
  uniqueIndex("users_google_subject_unique").on(table.googleSubject),
  uniqueIndex("users_email_unique").on(table.email),
]);

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: text("created_at").notNull(),
  expiresAt: text("expires_at").notNull(),
  lastSeenAt: text("last_seen_at").notNull(),
}, (table) => [
  index("sessions_user_id_idx").on(table.userId),
  index("sessions_expires_at_idx").on(table.expiresAt),
]);

export const oauthStates = sqliteTable("oauth_states", {
  stateHash: text("state_hash").primaryKey(),
  codeVerifier: text("code_verifier").notNull(),
  returnTo: text("return_to").notNull(),
  ageConfirmed: integer("age_confirmed", { mode: "boolean" }).notNull(),
  serviceConsent: integer("service_consent", { mode: "boolean" }).notNull(),
  researchConsent: integer("research_consent", { mode: "boolean" }).notNull(),
  marketingConsent: integer("marketing_consent", { mode: "boolean" }).notNull(),
  createdAt: text("created_at").notNull(),
  expiresAt: text("expires_at").notNull(),
}, (table) => [index("oauth_states_expires_at_idx").on(table.expiresAt)]);

export const consents = sqliteTable("consents", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  kind: text("kind").notNull(),
  granted: integer("granted", { mode: "boolean" }).notNull(),
  policyVersion: text("policy_version").notNull(),
  source: text("source").notNull(),
  createdAt: text("created_at").notNull(),
}, (table) => [index("consents_user_kind_idx").on(table.userId, table.kind)]);
