CREATE TABLE `formation_lecons` (
	`id` text PRIMARY KEY NOT NULL,
	`module_id` text NOT NULL,
	`titre` text NOT NULL,
	`contenu` text NOT NULL,
	`duree_minutes` integer,
	`ordre` integer NOT NULL,
	`quiz_json` text,
	`created_at` text
);
--> statement-breakpoint
CREATE TABLE `formation_modules` (
	`id` text PRIMARY KEY NOT NULL,
	`formation_id` text NOT NULL,
	`titre` text NOT NULL,
	`description` text,
	`ordre` integer NOT NULL,
	`created_at` text
);
--> statement-breakpoint
CREATE TABLE `progression_lecons` (
	`id` text PRIMARY KEY NOT NULL,
	`membre_id` text NOT NULL,
	`lecon_id` text NOT NULL,
	`completed_at` text
);
--> statement-breakpoint
ALTER TABLE `formations` ADD `cover_image_url` text;