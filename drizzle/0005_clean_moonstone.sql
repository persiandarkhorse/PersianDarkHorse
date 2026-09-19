CREATE TABLE `user_api_credentials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userOpenId` varchar(64) NOT NULL,
	`provider` varchar(80) NOT NULL,
	`label` varchar(120) NOT NULL,
	`ciphertext` text NOT NULL,
	`iv` varchar(64) NOT NULL,
	`authTag` varchar(64) NOT NULL,
	`lastFour` varchar(8) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_api_credentials_id` PRIMARY KEY(`id`)
);
