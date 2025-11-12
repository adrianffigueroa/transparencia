import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_locale" AS ENUM('es-AR', 'en-US');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'client-admin', 'editor');
  CREATE TYPE "public"."enum_media_category" AS ENUM('logo', 'perfil', 'obra', 'documento', 'banner', 'personalizacion', 'otros');
  CREATE TYPE "public"."enum_organigrama_person_department" AS ENUM('intendencia', 'gabinete', 'secretarias', 'other');
  CREATE TYPE "public"."enum_commitment_status" AS ENUM('not-started', 'in-progress', 'completed');
  CREATE TYPE "public"."enum_participation_personal_id" AS ENUM('dni', 'cedula', 'libreta-civica');
  CREATE TYPE "public"."enum_participation_project_area" AS ENUM('educacion', 'seguridad', 'salud', 'transporte', 'medio-ambiente');
  CREATE TYPE "public"."enum_public_works_work_type" AS ENUM('pavimento', 'alumbrado', 'red-de-agua', 'red-de-cloacas', 'edificio-publico', 'parque-jardin', 'plaza', 'otro');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"first_name" varchar,
  	"last_name" varchar,
  	"display_name" varchar,
  	"avatar_id" integer,
  	"phone" varchar,
  	"bio" varchar,
  	"locale" "enum_users_locale" DEFAULT 'es-AR',
  	"role" "enum_users_role" DEFAULT 'client-admin',
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"caption" varchar,
  	"category" "enum_media_category",
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_profile_url" varchar,
  	"sizes_profile_width" numeric,
  	"sizes_profile_height" numeric,
  	"sizes_profile_mime_type" varchar,
  	"sizes_profile_filesize" numeric,
  	"sizes_profile_filename" varchar
  );
  
  CREATE TABLE "organigrama_person" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"page_text" jsonb,
  	"full_name" varchar NOT NULL,
  	"position" varchar NOT NULL,
  	"department" "enum_organigrama_person_department" DEFAULT 'other',
  	"order" numeric,
  	"manager_id" integer,
  	"photo_id" integer,
  	"summary" jsonb,
  	"cv_id" integer,
  	"contact_email" varchar,
  	"contact_phone" varchar,
  	"start_date" timestamp(3) with time zone,
  	"is_visible" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "official_bulletin" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"page_text" jsonb,
  	"published_date" timestamp(3) with time zone NOT NULL,
  	"summary" jsonb,
  	"file_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "commitment" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"page_text" jsonb,
  	"summary" jsonb,
  	"started_date" timestamp(3) with time zone NOT NULL,
  	"estimated_completion_date" timestamp(3) with time zone NOT NULL,
  	"status" "enum_commitment_status" NOT NULL,
  	"percentage_completed" numeric NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "budget_files" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_id" integer NOT NULL,
  	"summary" jsonb
  );
  
  CREATE TABLE "budget" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"page_text" jsonb,
  	"published_date" timestamp(3) with time zone NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "tenders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"page_text" jsonb,
  	"published_date" timestamp(3) with time zone NOT NULL,
  	"title" varchar NOT NULL,
  	"object" varchar NOT NULL,
  	"official_budget" varchar NOT NULL,
  	"deadline_retiro_pliego" timestamp(3) with time zone,
  	"deadline_ofertas" timestamp(3) with time zone,
  	"opening_date" timestamp(3) with time zone,
  	"opening_time" varchar,
  	"lugar_apertura" varchar,
  	"valor_pliego" varchar,
  	"fecha_valor_pliego" timestamp(3) with time zone,
  	"lugar_entrega" varchar,
  	"info_adicional" varchar,
  	"contact_email" varchar,
  	"attached_file_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "participation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"page_text" jsonb,
  	"title" varchar NOT NULL,
  	"full_name" varchar NOT NULL,
  	"personal_id" "enum_participation_personal_id" NOT NULL,
  	"id_number" numeric NOT NULL,
  	"address" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"project_area" "enum_participation_project_area" NOT NULL,
  	"summary" jsonb NOT NULL,
  	"justification" jsonb NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "public_works_segments_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"latitude" numeric NOT NULL,
  	"longitude" numeric NOT NULL
  );
  
  CREATE TABLE "public_works_segments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"street" varchar
  );
  
  CREATE TABLE "public_works_progress_history" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"progress" numeric NOT NULL,
  	"comment" varchar
  );
  
  CREATE TABLE "public_works" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"contractor" varchar,
  	"work_type" "enum_public_works_work_type" NOT NULL,
  	"location_latitude" numeric,
  	"location_longitude" numeric,
  	"progress" numeric NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "public_works_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"organigrama_person_id" integer,
  	"official_bulletin_id" integer,
  	"commitment_id" integer,
  	"budget_id" integer,
  	"tenders_id" integer,
  	"participation_id" integer,
  	"public_works_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_customization" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"favicon_id" integer,
  	"paleta_de_colores_primary_color" varchar DEFAULT '#005aa7',
  	"paleta_de_colores_secondary_color" varchar DEFAULT '#005aa7',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users" ADD CONSTRAINT "users_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "organigrama_person" ADD CONSTRAINT "organigrama_person_manager_id_organigrama_person_id_fk" FOREIGN KEY ("manager_id") REFERENCES "public"."organigrama_person"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "organigrama_person" ADD CONSTRAINT "organigrama_person_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "organigrama_person" ADD CONSTRAINT "organigrama_person_cv_id_media_id_fk" FOREIGN KEY ("cv_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "official_bulletin" ADD CONSTRAINT "official_bulletin_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "budget_files" ADD CONSTRAINT "budget_files_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "budget_files" ADD CONSTRAINT "budget_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."budget"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tenders" ADD CONSTRAINT "tenders_attached_file_id_media_id_fk" FOREIGN KEY ("attached_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "public_works_segments_points" ADD CONSTRAINT "public_works_segments_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."public_works_segments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "public_works_segments" ADD CONSTRAINT "public_works_segments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."public_works"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "public_works_progress_history" ADD CONSTRAINT "public_works_progress_history_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."public_works"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "public_works_rels" ADD CONSTRAINT "public_works_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."public_works"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "public_works_rels" ADD CONSTRAINT "public_works_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_organigrama_person_fk" FOREIGN KEY ("organigrama_person_id") REFERENCES "public"."organigrama_person"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_official_bulletin_fk" FOREIGN KEY ("official_bulletin_id") REFERENCES "public"."official_bulletin"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_commitment_fk" FOREIGN KEY ("commitment_id") REFERENCES "public"."commitment"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_budget_fk" FOREIGN KEY ("budget_id") REFERENCES "public"."budget"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tenders_fk" FOREIGN KEY ("tenders_id") REFERENCES "public"."tenders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_participation_fk" FOREIGN KEY ("participation_id") REFERENCES "public"."participation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_public_works_fk" FOREIGN KEY ("public_works_id") REFERENCES "public"."public_works"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_customization" ADD CONSTRAINT "site_customization_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_customization" ADD CONSTRAINT "site_customization_favicon_id_media_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_avatar_idx" ON "users" USING btree ("avatar_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_profile_sizes_profile_filename_idx" ON "media" USING btree ("sizes_profile_filename");
  CREATE INDEX "organigrama_person_manager_idx" ON "organigrama_person" USING btree ("manager_id");
  CREATE INDEX "organigrama_person_photo_idx" ON "organigrama_person" USING btree ("photo_id");
  CREATE INDEX "organigrama_person_cv_idx" ON "organigrama_person" USING btree ("cv_id");
  CREATE INDEX "organigrama_person_updated_at_idx" ON "organigrama_person" USING btree ("updated_at");
  CREATE INDEX "organigrama_person_created_at_idx" ON "organigrama_person" USING btree ("created_at");
  CREATE INDEX "official_bulletin_file_idx" ON "official_bulletin" USING btree ("file_id");
  CREATE INDEX "official_bulletin_updated_at_idx" ON "official_bulletin" USING btree ("updated_at");
  CREATE INDEX "official_bulletin_created_at_idx" ON "official_bulletin" USING btree ("created_at");
  CREATE INDEX "commitment_updated_at_idx" ON "commitment" USING btree ("updated_at");
  CREATE INDEX "commitment_created_at_idx" ON "commitment" USING btree ("created_at");
  CREATE INDEX "budget_files_order_idx" ON "budget_files" USING btree ("_order");
  CREATE INDEX "budget_files_parent_id_idx" ON "budget_files" USING btree ("_parent_id");
  CREATE INDEX "budget_files_file_idx" ON "budget_files" USING btree ("file_id");
  CREATE INDEX "budget_updated_at_idx" ON "budget" USING btree ("updated_at");
  CREATE INDEX "budget_created_at_idx" ON "budget" USING btree ("created_at");
  CREATE INDEX "tenders_attached_file_idx" ON "tenders" USING btree ("attached_file_id");
  CREATE INDEX "tenders_updated_at_idx" ON "tenders" USING btree ("updated_at");
  CREATE INDEX "tenders_created_at_idx" ON "tenders" USING btree ("created_at");
  CREATE INDEX "participation_updated_at_idx" ON "participation" USING btree ("updated_at");
  CREATE INDEX "participation_created_at_idx" ON "participation" USING btree ("created_at");
  CREATE INDEX "public_works_segments_points_order_idx" ON "public_works_segments_points" USING btree ("_order");
  CREATE INDEX "public_works_segments_points_parent_id_idx" ON "public_works_segments_points" USING btree ("_parent_id");
  CREATE INDEX "public_works_segments_order_idx" ON "public_works_segments" USING btree ("_order");
  CREATE INDEX "public_works_segments_parent_id_idx" ON "public_works_segments" USING btree ("_parent_id");
  CREATE INDEX "public_works_progress_history_order_idx" ON "public_works_progress_history" USING btree ("_order");
  CREATE INDEX "public_works_progress_history_parent_id_idx" ON "public_works_progress_history" USING btree ("_parent_id");
  CREATE INDEX "public_works_updated_at_idx" ON "public_works" USING btree ("updated_at");
  CREATE INDEX "public_works_created_at_idx" ON "public_works" USING btree ("created_at");
  CREATE INDEX "public_works_rels_order_idx" ON "public_works_rels" USING btree ("order");
  CREATE INDEX "public_works_rels_parent_idx" ON "public_works_rels" USING btree ("parent_id");
  CREATE INDEX "public_works_rels_path_idx" ON "public_works_rels" USING btree ("path");
  CREATE INDEX "public_works_rels_media_id_idx" ON "public_works_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_organigrama_person_id_idx" ON "payload_locked_documents_rels" USING btree ("organigrama_person_id");
  CREATE INDEX "payload_locked_documents_rels_official_bulletin_id_idx" ON "payload_locked_documents_rels" USING btree ("official_bulletin_id");
  CREATE INDEX "payload_locked_documents_rels_commitment_id_idx" ON "payload_locked_documents_rels" USING btree ("commitment_id");
  CREATE INDEX "payload_locked_documents_rels_budget_id_idx" ON "payload_locked_documents_rels" USING btree ("budget_id");
  CREATE INDEX "payload_locked_documents_rels_tenders_id_idx" ON "payload_locked_documents_rels" USING btree ("tenders_id");
  CREATE INDEX "payload_locked_documents_rels_participation_id_idx" ON "payload_locked_documents_rels" USING btree ("participation_id");
  CREATE INDEX "payload_locked_documents_rels_public_works_id_idx" ON "payload_locked_documents_rels" USING btree ("public_works_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_customization_logo_idx" ON "site_customization" USING btree ("logo_id");
  CREATE INDEX "site_customization_favicon_idx" ON "site_customization" USING btree ("favicon_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "organigrama_person" CASCADE;
  DROP TABLE "official_bulletin" CASCADE;
  DROP TABLE "commitment" CASCADE;
  DROP TABLE "budget_files" CASCADE;
  DROP TABLE "budget" CASCADE;
  DROP TABLE "tenders" CASCADE;
  DROP TABLE "participation" CASCADE;
  DROP TABLE "public_works_segments_points" CASCADE;
  DROP TABLE "public_works_segments" CASCADE;
  DROP TABLE "public_works_progress_history" CASCADE;
  DROP TABLE "public_works" CASCADE;
  DROP TABLE "public_works_rels" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_customization" CASCADE;
  DROP TYPE "public"."enum_users_locale";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_media_category";
  DROP TYPE "public"."enum_organigrama_person_department";
  DROP TYPE "public"."enum_commitment_status";
  DROP TYPE "public"."enum_participation_personal_id";
  DROP TYPE "public"."enum_participation_project_area";
  DROP TYPE "public"."enum_public_works_work_type";`)
}
