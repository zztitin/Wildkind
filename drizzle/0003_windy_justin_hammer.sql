CREATE TABLE `creem_events` (
	`id` text PRIMARY KEY NOT NULL,
	`event_type` text NOT NULL,
	`resource_id` text,
	`processed_at` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE `purchases` ADD `payment_provider` text DEFAULT 'paypal' NOT NULL;--> statement-breakpoint
ALTER TABLE `purchases` ADD `provider_checkout_id` text;--> statement-breakpoint
ALTER TABLE `purchases` ADD `provider_payment_id` text;--> statement-breakpoint
ALTER TABLE `purchases` ADD `provider_customer_id` text;--> statement-breakpoint
CREATE UNIQUE INDEX `purchases_provider_checkout_unique` ON `purchases` (`provider_checkout_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `purchases_provider_payment_unique` ON `purchases` (`provider_payment_id`);