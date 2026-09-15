CREATE TABLE "teams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"preferred_name" text,
	"photo_url" text,
	"location" text,
	"timezone" text,
	"about" text,
	"skills" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"github" text,
	"linkedin" text,
	"personal_website" text,
	"other_links" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "member" ADD COLUMN "job_title" text;--> statement-breakpoint
ALTER TABLE "member" ADD COLUMN "work_email" text;--> statement-breakpoint
ALTER TABLE "member" ADD COLUMN "start_date" date;--> statement-breakpoint
ALTER TABLE "member" ADD COLUMN "team_id" uuid;--> statement-breakpoint
ALTER TABLE "member" ADD COLUMN "manager_id" uuid;--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_manager_id_member_id_fk" FOREIGN KEY ("manager_id") REFERENCES "public"."member"("id") ON DELETE set null ON UPDATE no action;