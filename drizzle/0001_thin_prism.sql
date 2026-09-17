CREATE TABLE `payment_submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`amount` varchar(64) NOT NULL,
	`currency` varchar(64) NOT NULL,
	`txid` varchar(256) NOT NULL,
	`status` enum('pending','verified','rejected') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `payment_submissions_id` PRIMARY KEY(`id`),
	CONSTRAINT `payment_submissions_txid_unique` UNIQUE(`txid`)
);
