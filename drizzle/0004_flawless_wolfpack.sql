CREATE TABLE `subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userOpenId` varchar(64) NOT NULL,
	`planId` varchar(40) NOT NULL DEFAULT 'horse_rider',
	`status` enum('active','pending','canceled','expired') NOT NULL DEFAULT 'active',
	`expiresAt` timestamp,
	`isLifetime` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`),
	CONSTRAINT `subscriptions_userOpenId_unique` UNIQUE(`userOpenId`)
);
--> statement-breakpoint
ALTER TABLE `payment_submissions` ADD `userOpenId` varchar(64);--> statement-breakpoint
ALTER TABLE `payment_submissions` ADD `planId` varchar(40) DEFAULT 'horse_rider' NOT NULL;