PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_inscriptions_formation` (
	`certificat_r2_key` text,
	`created_at` text,
	`id` text PRIMARY KEY NOT NULL,
	`membre_id` text NOT NULL,
	`formation_id` text,
	`session_id` text,
	`statut` text
);
--> statement-breakpoint
INSERT INTO `__new_inscriptions_formation`("certificat_r2_key", "created_at", "id", "membre_id", "formation_id", "session_id", "statut") SELECT "certificat_r2_key", "created_at", "id", "membre_id", "formation_id", "session_id", "statut" FROM `inscriptions_formation`;--> statement-breakpoint
DROP TABLE `inscriptions_formation`;--> statement-breakpoint
ALTER TABLE `__new_inscriptions_formation` RENAME TO `inscriptions_formation`;--> statement-breakpoint
PRAGMA foreign_keys=ON;