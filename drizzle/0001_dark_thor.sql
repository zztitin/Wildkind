CREATE TABLE `consents` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`kind` text NOT NULL,
	`granted` integer NOT NULL,
	`policy_version` text NOT NULL,
	`source` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `consents_user_kind_idx` ON `consents` (`user_id`,`kind`);--> statement-breakpoint
CREATE TABLE `oauth_states` (
	`state_hash` text PRIMARY KEY NOT NULL,
	`code_verifier` text NOT NULL,
	`return_to` text NOT NULL,
	`age_confirmed` integer NOT NULL,
	`service_consent` integer NOT NULL,
	`research_consent` integer NOT NULL,
	`marketing_consent` integer NOT NULL,
	`created_at` text NOT NULL,
	`expires_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `oauth_states_expires_at_idx` ON `oauth_states` (`expires_at`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`created_at` text NOT NULL,
	`expires_at` text NOT NULL,
	`last_seen_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `sessions_user_id_idx` ON `sessions` (`user_id`);--> statement-breakpoint
CREATE INDEX `sessions_expires_at_idx` ON `sessions` (`expires_at`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`google_subject` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer NOT NULL,
	`name` text,
	`avatar_url` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`last_login_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_google_subject_unique` ON `users` (`google_subject`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);