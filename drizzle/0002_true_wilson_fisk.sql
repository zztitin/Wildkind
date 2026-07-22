CREATE TABLE `paypal_events` (
	`id` text PRIMARY KEY NOT NULL,
	`event_type` text NOT NULL,
	`resource_id` text,
	`processed_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `purchases` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`product_code` text NOT NULL,
	`paypal_order_id` text,
	`paypal_capture_id` text,
	`amount_value` text NOT NULL,
	`currency_code` text NOT NULL,
	`status` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`completed_at` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `purchases_user_product_idx` ON `purchases` (`user_id`,`product_code`);--> statement-breakpoint
CREATE UNIQUE INDEX `purchases_paypal_order_unique` ON `purchases` (`paypal_order_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `purchases_paypal_capture_unique` ON `purchases` (`paypal_capture_id`);