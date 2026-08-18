CREATE TABLE `auditLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int,
	`actorId` int,
	`eventType` varchar(100) NOT NULL,
	`payload` json NOT NULL,
	`sha256` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `auditLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `automationScenes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` enum('verse','pre-hook','hook','drop','adlib','final lift') NOT NULL,
	`description` text NOT NULL,
	`actions` json NOT NULL,
	CONSTRAINT `automationScenes_id` PRIMARY KEY(`id`),
	CONSTRAINT `automationScenes_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`deliveryId` int NOT NULL,
	`authorId` int NOT NULL,
	`body` text NOT NULL,
	`timestampMs` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `deliveries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`stemVersionId` int NOT NULL,
	`label` varchar(160) NOT NULL,
	`status` enum('sent','viewed','approved','changes_requested') NOT NULL DEFAULT 'sent',
	`sentAt` timestamp NOT NULL DEFAULT (now()),
	`approvedAt` timestamp,
	CONSTRAINT `deliveries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `metrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`deliveryId` int,
	`lufs` decimal(6,2),
	`truePeak` decimal(6,2),
	`dynamicRange` decimal(6,2),
	`measuredAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `metrics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `plugins` (
	`id` int AUTO_INCREMENT NOT NULL,
	`rank` int NOT NULL,
	`name` varchar(160) NOT NULL,
	`vendor` varchar(160) NOT NULL,
	`role` varchar(200) NOT NULL,
	`format` varchar(160) NOT NULL,
	`officialUrl` text NOT NULL,
	`verification` enum('pending','verified','blocked') NOT NULL DEFAULT 'pending',
	`installationGuide` text NOT NULL,
	CONSTRAINT `plugins_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projectAutomationBindings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`sceneId` int NOT NULL,
	`overrides` json NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `projectAutomationBindings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projectPresetBindings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`presetId` int NOT NULL,
	`parameters` json NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `projectPresetBindings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`clientName` varchar(160) NOT NULL,
	`title` varchar(200) NOT NULL,
	`status` enum('draft','recording','mixing','review','approved','archived') NOT NULL DEFAULT 'draft',
	`tempo` int,
	`musicalKey` varchar(32),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `stemVersions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`name` varchar(160) NOT NULL,
	`versionLabel` varchar(32) NOT NULL,
	`sha256` varchar(64),
	`fileUrl` text,
	`status` enum('working','review','approved','rejected') NOT NULL DEFAULT 'working',
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `stemVersions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vocalPresets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` enum('Vocal Clean','Pop Gloss','Urban Tight','Funk Brasil Pulse','Stage Lead') NOT NULL,
	`description` text NOT NULL,
	`parameters` json NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vocalPresets_id` PRIMARY KEY(`id`),
	CONSTRAINT `vocalPresets_name_unique` UNIQUE(`name`)
);
