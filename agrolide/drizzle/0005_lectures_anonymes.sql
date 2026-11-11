CREATE TABLE IF NOT EXISTS `lectures_anonymes` (
	`id` text PRIMARY KEY NOT NULL,
	`empreinte` text NOT NULL,
	`document_id` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_lectures_anonymes_empreinte` ON `lectures_anonymes` (`empreinte`,`created_at`);