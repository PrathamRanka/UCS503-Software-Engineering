begin;

create extension if not exists pgcrypto;
create extension if not exists citext;
create extension if not exists pg_trgm;

create schema if not exists app;

create type app.user_role as enum ('member', 'admin', 'super_admin');
create type app.account_status as enum ('active', 'warned', 'suspended', 'banned', 'pending_deletion');
create type app.content_type as enum ('post', 'reel');
create type app.visibility as enum ('campus', 'followers', 'community');
create type app.moderation_status as enum ('pending_scan', 'approved', 'flagged', 'rejected');
create type app.media_status as enum ('uploading', 'quarantined', 'processing', 'approved', 'rejected', 'deleted');
create type app.community_request_status as enum ('pending', 'changes_requested', 'approved', 'rejected');
create type app.community_role as enum ('member', 'moderator', 'owner');
create type app.conversation_type as enum ('direct', 'group');
create type app.message_status as enum ('pending_scan', 'delivered', 'rejected', 'deleted');
create type app.case_status as enum ('open', 'assigned', 'reviewing', 'decided', 'appealed', 'appeal_decided', 'closed');
create type app.report_target as enum ('profile', 'content', 'comment', 'message', 'community', 'story');

create table app.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username citext not null unique check (username::text ~ '^[a-z0-9_]{3,30}$'),
  display_name text not null check (char_length(display_name) between 1 and 80),
  bio text check (char_length(bio) <= 500),
  avatar_asset_id uuid,
  role app.user_role not null default 'member',
  account_status app.account_status not null default 'active',
  suspended_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  version integer not null default 1
);

create table app.user_private (
  user_id uuid primary key references app.profiles(id) on delete cascade,
  email citext not null unique,
  provider_subject text not null unique,
  last_eligibility_check_at timestamptz not null default now(),
  export_requested_at timestamptz,
  export_expires_at timestamptz,
  deletion_requested_at timestamptz,
  deletion_due_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (right(lower(email::text), 11) = '@thapar.edu')
);

create table app.consent_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references app.profiles(id) on delete cascade,
  document_type text not null check (document_type in ('terms', 'privacy', 'guidelines')),
  document_version text not null,
  accepted_at timestamptz not null default now(),
  request_id text not null,
  unique (user_id, document_type, document_version)
);

create table app.legal_documents (
  document_type text not null check (document_type in ('terms', 'privacy', 'guidelines')),
  version text not null,
  content_sha256 text not null check (content_sha256 ~ '^[a-f0-9]{64}$'),
  effective_at timestamptz not null,
  is_current boolean not null default false,
  created_by uuid references app.profiles(id),
  created_at timestamptz not null default now(),
  primary key (document_type, version)
);

create table app.role_assignments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references app.profiles(id),
  role app.user_role not null,
  assigned_by uuid not null references app.profiles(id),
  reason text not null check (char_length(reason) between 10 and 1000),
  assigned_at timestamptz not null default now(),
  revoked_at timestamptz,
  revoked_by uuid references app.profiles(id),
  check (user_id <> assigned_by)
);

create table app.follows (
  follower_id uuid not null references app.profiles(id) on delete cascade,
  followed_id uuid not null references app.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, followed_id),
  check (follower_id <> followed_id)
);

create table app.blocks (
  blocker_id uuid not null references app.profiles(id) on delete cascade,
  blocked_id uuid not null references app.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);

create table app.community_requests (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references app.profiles(id),
  name text not null check (char_length(name) between 3 and 80),
  slug citext not null unique check (slug::text ~ '^[a-z0-9-]{3,50}$'),
  purpose text not null check (char_length(purpose) between 20 and 1000),
  status app.community_request_status not null default 'pending',
  reviewed_by uuid references app.profiles(id),
  review_reason text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create table app.communities (
  id uuid primary key default gen_random_uuid(),
  request_id uuid unique references app.community_requests(id),
  owner_id uuid not null references app.profiles(id),
  name text not null check (char_length(name) between 3 and 80),
  slug citext not null unique check (slug::text ~ '^[a-z0-9-]{3,50}$'),
  description text not null default '',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table app.community_memberships (
  community_id uuid not null references app.communities(id) on delete cascade,
  user_id uuid not null references app.profiles(id) on delete cascade,
  role app.community_role not null default 'member',
  joined_at timestamptz not null default now(),
  primary key (community_id, user_id)
);

create table app.community_rules (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references app.communities(id) on delete cascade,
  position smallint not null check (position >= 0),
  rule_text text not null check (char_length(rule_text) between 3 and 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (community_id, position)
);

create table app.media_assets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references app.profiles(id),
  purpose text not null check (purpose in ('avatar', 'post', 'reel', 'story', 'message')),
  status app.media_status not null default 'uploading',
  quarantine_key text not null unique,
  published_key text unique,
  original_filename text not null,
  mime_type text not null,
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 52428800),
  checksum_sha256 text not null check (checksum_sha256 ~ '^[a-f0-9]{64}$'),
  width integer check (width > 0),
  height integer check (height > 0),
  duration_ms integer check (duration_ms >= 0),
  metadata jsonb not null default '{}'::jsonb,
  upload_expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table app.profiles
  add constraint profiles_avatar_asset_fk
  foreign key (avatar_asset_id) references app.media_assets(id) deferrable initially deferred;

create table app.content (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references app.profiles(id),
  community_id uuid references app.communities(id),
  type app.content_type not null,
  visibility app.visibility not null default 'campus',
  moderation_status app.moderation_status not null default 'pending_scan',
  caption text check (char_length(caption) <= 2200),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  version integer not null default 1,
  check ((visibility = 'community') = (community_id is not null))
);

create table app.content_media (
  content_id uuid not null references app.content(id) on delete cascade,
  media_asset_id uuid not null references app.media_assets(id),
  position smallint not null check (position between 0 and 9),
  primary key (content_id, media_asset_id),
  unique (content_id, position)
);

create table app.hashtags (
  id uuid primary key default gen_random_uuid(),
  tag citext not null unique check (tag::text ~ '^[a-z0-9_]{1,50}$'),
  usage_count bigint not null default 0,
  created_at timestamptz not null default now()
);

create table app.content_hashtags (
  content_id uuid not null references app.content(id) on delete cascade,
  hashtag_id uuid not null references app.hashtags(id) on delete cascade,
  primary key (content_id, hashtag_id)
);

create table app.mentions (
  id uuid primary key default gen_random_uuid(),
  source_type text not null check (source_type in ('content', 'comment', 'message', 'story')),
  source_id uuid not null,
  mentioned_user_id uuid not null references app.profiles(id) on delete cascade,
  created_by uuid not null references app.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (source_type, source_id, mentioned_user_id)
);

create table app.comments (
  id uuid primary key default gen_random_uuid(),
  content_id uuid not null references app.content(id) on delete cascade,
  author_id uuid not null references app.profiles(id),
  parent_comment_id uuid references app.comments(id),
  body text not null check (char_length(body) between 1 and 2000),
  moderation_status app.moderation_status not null default 'pending_scan',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table app.reactions (
  content_id uuid not null references app.content(id) on delete cascade,
  user_id uuid not null references app.profiles(id) on delete cascade,
  reaction_type text not null default 'like' check (reaction_type in ('like')),
  created_at timestamptz not null default now(),
  primary key (content_id, user_id, reaction_type)
);

create table app.saves (
  content_id uuid not null references app.content(id) on delete cascade,
  user_id uuid not null references app.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (content_id, user_id)
);

create table app.content_metrics (
  content_id uuid primary key references app.content(id) on delete cascade,
  reactions_count bigint not null default 0,
  comments_count bigint not null default 0,
  saves_count bigint not null default 0,
  impressions_count bigint not null default 0,
  completions_count bigint not null default 0,
  watch_ms_total bigint not null default 0,
  ranking_features jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table app.feed_impressions (
  id bigint generated always as identity primary key,
  viewer_id uuid not null references app.profiles(id),
  content_id uuid not null references app.content(id),
  ranking_version text not null,
  position integer not null check (position >= 0),
  watch_ms integer not null default 0 check (watch_ms >= 0),
  completed boolean not null default false,
  skipped boolean not null default false,
  occurred_at timestamptz not null default now()
);

create table app.conversations (
  id uuid primary key default gen_random_uuid(),
  type app.conversation_type not null,
  title text check (char_length(title) <= 80),
  direct_pair_key text unique,
  created_by uuid not null references app.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((type = 'direct') = (direct_pair_key is not null))
);

create table app.conversation_participants (
  conversation_id uuid not null references app.conversations(id) on delete cascade,
  user_id uuid not null references app.profiles(id) on delete cascade,
  role text not null default 'member' check (role in ('member', 'owner')),
  muted_until timestamptz,
  last_read_message_id uuid,
  joined_at timestamptz not null default now(),
  left_at timestamptz,
  primary key (conversation_id, user_id)
);

create table app.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references app.conversations(id) on delete cascade,
  sender_id uuid not null references app.profiles(id),
  reply_to_message_id uuid references app.messages(id),
  body text check (char_length(body) <= 4000),
  status app.message_status not null default 'pending_scan',
  created_at timestamptz not null default now(),
  delivered_at timestamptz,
  deleted_at timestamptz,
  check (body is not null or status = 'pending_scan')
);

alter table app.conversation_participants
  add constraint conversation_last_read_message_fk
  foreign key (last_read_message_id) references app.messages(id) deferrable initially deferred;

create table app.message_media (
  message_id uuid not null references app.messages(id) on delete cascade,
  media_asset_id uuid not null references app.media_assets(id),
  position smallint not null check (position between 0 and 3),
  primary key (message_id, media_asset_id),
  unique (message_id, position)
);

create table app.stories (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references app.profiles(id),
  media_asset_id uuid not null references app.media_assets(id),
  visibility text not null check (visibility in ('campus', 'followers')),
  overlays jsonb not null default '[]'::jsonb,
  moderation_status app.moderation_status not null default 'pending_scan',
  published_at timestamptz,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  check (expires_at > created_at)
);

create table app.story_views (
  story_id uuid not null references app.stories(id) on delete cascade,
  viewer_id uuid not null references app.profiles(id) on delete cascade,
  first_viewed_at timestamptz not null default now(),
  primary key (story_id, viewer_id)
);

create table app.story_polls (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null unique references app.stories(id) on delete cascade,
  question text not null check (char_length(question) between 1 and 140),
  options jsonb not null check (jsonb_typeof(options) = 'array'),
  created_at timestamptz not null default now()
);

create table app.story_poll_votes (
  poll_id uuid not null references app.story_polls(id) on delete cascade,
  voter_id uuid not null references app.profiles(id) on delete cascade,
  option_index smallint not null check (option_index >= 0),
  created_at timestamptz not null default now(),
  primary key (poll_id, voter_id)
);

create table app.highlights (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references app.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 40),
  cover_asset_id uuid references app.media_assets(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table app.highlight_items (
  highlight_id uuid not null references app.highlights(id) on delete cascade,
  story_id uuid not null references app.stories(id),
  position smallint not null check (position >= 0),
  added_at timestamptz not null default now(),
  primary key (highlight_id, story_id),
  unique (highlight_id, position)
);

create table app.moderation_jobs (
  id uuid primary key default gen_random_uuid(),
  target_type app.report_target not null,
  target_id uuid not null,
  provider text not null,
  model_versions jsonb not null default '{}'::jsonb,
  policy_version text not null,
  status text not null check (status in ('queued', 'running', 'allow', 'review', 'reject', 'failed')),
  attempts integer not null default 0 check (attempts >= 0),
  result jsonb,
  last_error_code text,
  created_at timestamptz not null default now(),
  started_at timestamptz,
  completed_at timestamptz
);

create table app.moderation_findings (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references app.moderation_jobs(id) on delete cascade,
  category text not null,
  score numeric(5,4) not null check (score between 0 and 1),
  timestamp_ms integer check (timestamp_ms >= 0),
  evidence_ref text,
  created_at timestamptz not null default now()
);

create table app.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references app.profiles(id),
  target_type app.report_target not null,
  target_id uuid not null,
  category text not null,
  description text check (char_length(description) <= 2000),
  status text not null default 'open' check (status in ('open', 'triaged', 'merged', 'resolved', 'dismissed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (reporter_id, target_type, target_id, category)
);

create table app.moderation_cases (
  id uuid primary key default gen_random_uuid(),
  target_type app.report_target not null,
  target_id uuid not null,
  status app.case_status not null default 'open',
  priority smallint not null default 3 check (priority between 1 and 5),
  assigned_to uuid references app.profiles(id),
  opened_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  closed_at timestamptz
);

create table app.case_reports (
  case_id uuid not null references app.moderation_cases(id) on delete cascade,
  report_id uuid not null unique references app.reports(id) on delete cascade,
  primary key (case_id, report_id)
);

create table app.moderation_decisions (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references app.moderation_cases(id),
  decided_by uuid not null references app.profiles(id),
  action text not null check (action in ('approve', 'reject', 'warn', 'suspend_24h', 'suspend_7d', 'escalate', 'ban')),
  reason_code text not null,
  explanation text not null check (char_length(explanation) between 10 and 2000),
  created_at timestamptz not null default now()
);

create table app.appeals (
  id uuid primary key default gen_random_uuid(),
  decision_id uuid not null unique references app.moderation_decisions(id),
  appellant_id uuid not null references app.profiles(id),
  argument text not null check (char_length(argument) between 10 and 2000),
  status text not null default 'pending' check (status in ('pending', 'upheld', 'overturned', 'dismissed')),
  reviewed_by uuid references app.profiles(id),
  review_reason text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create table app.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references app.profiles(id) on delete cascade,
  actor_id uuid references app.profiles(id) on delete set null,
  type text not null,
  target_type text,
  target_id uuid,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create table app.data_exports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references app.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'processing', 'ready', 'failed', 'expired')),
  object_key text,
  requested_at timestamptz not null default now(),
  ready_at timestamptz,
  expires_at timestamptz,
  last_error_code text
);

create table app.feature_flags (
  key text primary key check (key ~ '^[a-z][a-z0-9_.-]{2,80}$'),
  description text not null,
  enabled boolean not null default false,
  rollout_percentage smallint not null default 0 check (rollout_percentage between 0 and 100),
  allowed_user_ids uuid[] not null default '{}',
  updated_by uuid references app.profiles(id),
  updated_at timestamptz not null default now()
);

create table app.outbox_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  event_version integer not null check (event_version > 0),
  aggregate_id uuid not null,
  actor_id uuid references app.profiles(id) on delete set null,
  correlation_id text not null,
  topic text not null,
  partition_key text not null,
  payload jsonb not null,
  occurred_at timestamptz not null default now(),
  available_at timestamptz not null default now(),
  published_at timestamptz,
  attempts integer not null default 0,
  last_error text
);

create table app.processed_events (
  consumer_name text not null,
  event_id uuid not null,
  processed_at timestamptz not null default now(),
  primary key (consumer_name, event_id)
);

create table app.idempotency_records (
  actor_id uuid not null references app.profiles(id) on delete cascade,
  idempotency_key text not null,
  request_fingerprint text not null,
  response_status integer,
  response_body jsonb,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  primary key (actor_id, idempotency_key)
);

create table app.admin_audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid references app.profiles(id) on delete set null,
  action text not null,
  target_type text not null,
  target_id text,
  reason text,
  request_id text not null,
  ip_hash text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index content_feed_idx on app.content (published_at desc, id desc)
  where moderation_status = 'approved' and deleted_at is null;
create index content_author_idx on app.content (author_id, created_at desc) where deleted_at is null;
create index content_community_idx on app.content (community_id, published_at desc)
  where community_id is not null and moderation_status = 'approved' and deleted_at is null;
create index content_caption_search_idx on app.content using gin (to_tsvector('simple', coalesce(caption, '')));
create index hashtags_tag_trgm_idx on app.hashtags using gin ((tag::text) gin_trgm_ops);
create index profile_username_trgm_idx on app.profiles using gin ((username::text) gin_trgm_ops);
create index profile_display_name_trgm_idx on app.profiles using gin (display_name gin_trgm_ops);
create index comments_content_idx on app.comments (content_id, created_at desc) where deleted_at is null;
create index impressions_viewer_idx on app.feed_impressions (viewer_id, occurred_at desc);
create index impressions_occurred_brin on app.feed_impressions using brin (occurred_at);
create index conversation_participant_user_idx on app.conversation_participants (user_id, joined_at desc) where left_at is null;
create index messages_conversation_idx on app.messages (conversation_id, created_at desc) where deleted_at is null;
create index stories_active_idx on app.stories (expires_at, published_at desc)
  where moderation_status = 'approved' and deleted_at is null;
create index moderation_cases_queue_idx on app.moderation_cases (priority, opened_at) where status in ('open', 'assigned', 'reviewing', 'appealed');
create index outbox_pending_idx on app.outbox_events (available_at, occurred_at) where published_at is null;
create index notifications_recipient_idx on app.notifications (recipient_id, created_at desc);
create index notifications_unread_idx on app.notifications (recipient_id, created_at desc) where read_at is null;

create function app.set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on app.profiles
for each row execute function app.set_updated_at();
create trigger user_private_set_updated_at before update on app.user_private
for each row execute function app.set_updated_at();
create trigger communities_set_updated_at before update on app.communities
for each row execute function app.set_updated_at();
create trigger community_rules_set_updated_at before update on app.community_rules
for each row execute function app.set_updated_at();
create trigger media_assets_set_updated_at before update on app.media_assets
for each row execute function app.set_updated_at();
create trigger content_set_updated_at before update on app.content
for each row execute function app.set_updated_at();
create trigger comments_set_updated_at before update on app.comments
for each row execute function app.set_updated_at();
create trigger conversations_set_updated_at before update on app.conversations
for each row execute function app.set_updated_at();
create trigger stories_set_updated_at before update on app.stories
for each row execute function app.set_updated_at();
create trigger reports_set_updated_at before update on app.reports
for each row execute function app.set_updated_at();
create trigger moderation_cases_set_updated_at before update on app.moderation_cases
for each row execute function app.set_updated_at();

create function app.current_role() returns app.user_role
language sql stable security definer set search_path = app, public as $$
  select role from app.profiles where id = auth.uid() and deleted_at is null;
$$;

create function app.is_admin() returns boolean
language sql stable security definer set search_path = app, public as $$
  select coalesce(app.current_role() in ('admin', 'super_admin'), false);
$$;

create function app.is_super_admin() returns boolean
language sql stable security definer set search_path = app, public as $$
  select coalesce(app.current_role() = 'super_admin', false);
$$;

create function app.is_conversation_participant(conversation uuid) returns boolean
language sql stable security definer set search_path = app, public as $$
  select exists (
    select 1 from app.conversation_participants
    where conversation_id = conversation and user_id = auth.uid() and left_at is null
  );
$$;

create function app.can_view_story(target app.stories) returns boolean
language sql stable security definer set search_path = app, public as $$
  select
    target.deleted_at is null
    and (
      target.author_id = auth.uid()
      or (
        target.moderation_status = 'approved'
        and target.expires_at > now()
        and not exists (
          select 1 from app.blocks
          where (blocker_id = auth.uid() and blocked_id = target.author_id)
             or (blocker_id = target.author_id and blocked_id = auth.uid())
        )
        and (
          target.visibility = 'campus'
          or exists (
            select 1 from app.follows where follower_id = auth.uid() and followed_id = target.author_id
          )
        )
      )
    );
$$;

create function app.can_view_content(target app.content) returns boolean
language sql stable security definer set search_path = app, public as $$
  select
    target.deleted_at is null
    and (
      target.author_id = auth.uid()
      or (
        target.moderation_status = 'approved'
        and not exists (
          select 1 from app.blocks
          where (blocker_id = auth.uid() and blocked_id = target.author_id)
             or (blocker_id = target.author_id and blocked_id = auth.uid())
        )
        and (
          target.visibility = 'campus'
          or (target.visibility = 'followers' and exists (
            select 1 from app.follows where follower_id = auth.uid() and followed_id = target.author_id
          ))
          or (target.visibility = 'community' and exists (
            select 1 from app.community_memberships
            where community_id = target.community_id and user_id = auth.uid()
          ))
        )
      )
    );
$$;

create function app.enqueue_event(
  target_event_type text,
  target_event_version integer,
  target_aggregate_id uuid,
  target_topic text,
  target_partition_key text,
  target_payload jsonb,
  target_correlation_id text
) returns uuid
language plpgsql security definer set search_path = app, public as $$
declare
  new_event_id uuid := gen_random_uuid();
begin
  if auth.uid() is null then
    raise exception 'authentication required';
  end if;
  if target_event_version < 1 or target_topic not like 'tiet-social.%' then
    raise exception 'invalid event metadata';
  end if;
  insert into app.outbox_events (
    id, event_type, event_version, aggregate_id, actor_id, correlation_id,
    topic, partition_key, payload
  ) values (
    new_event_id, target_event_type, target_event_version, target_aggregate_id,
    auth.uid(), target_correlation_id, target_topic, target_partition_key, target_payload
  );
  return new_event_id;
end;
$$;

grant usage on schema app to authenticated;
grant select, insert, update, delete on all tables in schema app to authenticated;
grant usage, select on all sequences in schema app to authenticated;
grant execute on function app.enqueue_event(text, integer, uuid, text, text, jsonb, text) to authenticated;

-- Column grants prevent owners from promoting themselves or bypassing moderation.
revoke insert, update, delete on app.profiles from authenticated;
grant update (username, display_name, bio, avatar_asset_id) on app.profiles to authenticated;
revoke insert, update, delete on app.user_private from authenticated;
revoke insert, update, delete on app.role_assignments from authenticated;
grant insert, update on app.role_assignments to authenticated;
revoke insert, update, delete on app.legal_documents from authenticated;
grant insert, update on app.legal_documents to authenticated;
revoke insert, update, delete on app.community_requests from authenticated;
grant insert (requester_id, name, slug, purpose) on app.community_requests to authenticated;
grant update (status, reviewed_by, review_reason, reviewed_at) on app.community_requests to authenticated;
revoke insert, update, delete on app.community_memberships from authenticated;
grant insert (community_id, user_id) on app.community_memberships to authenticated;
grant delete on app.community_memberships to authenticated;
revoke insert, update, delete on app.hashtags from authenticated;
revoke insert, update, delete on app.mentions from authenticated;
grant insert (source_type, source_id, mentioned_user_id, created_by) on app.mentions to authenticated;
revoke insert, update, delete on app.media_assets from authenticated;
grant insert (owner_id, purpose, quarantine_key, original_filename, mime_type, size_bytes,
  checksum_sha256, upload_expires_at) on app.media_assets to authenticated;
grant delete on app.media_assets to authenticated;
revoke insert on app.content from authenticated;
grant insert (author_id, community_id, type, visibility, caption) on app.content to authenticated;
revoke update on app.content from authenticated;
grant update (caption, visibility, community_id, deleted_at) on app.content to authenticated;
revoke insert on app.comments from authenticated;
grant insert (content_id, author_id, parent_comment_id, body) on app.comments to authenticated;
revoke update on app.comments from authenticated;
grant update (body, deleted_at) on app.comments to authenticated;
revoke insert, update, delete on app.conversations from authenticated;
grant insert (type, title, direct_pair_key, created_by) on app.conversations to authenticated;
grant update (title) on app.conversations to authenticated;
revoke insert, update, delete on app.conversation_participants from authenticated;
grant insert (conversation_id, user_id, role) on app.conversation_participants to authenticated;
grant update (muted_until, last_read_message_id, left_at) on app.conversation_participants to authenticated;
revoke insert, update, delete on app.messages from authenticated;
grant insert (conversation_id, sender_id, reply_to_message_id, body) on app.messages to authenticated;
revoke insert, update, delete on app.stories from authenticated;
grant insert (author_id, media_asset_id, visibility, overlays, expires_at) on app.stories to authenticated;
revoke insert, update, delete on app.reports from authenticated;
grant insert (reporter_id, target_type, target_id, category, description) on app.reports to authenticated;
revoke insert, update, delete on app.appeals from authenticated;
grant insert (decision_id, appellant_id, argument) on app.appeals to authenticated;
grant update (status, reviewed_by, review_reason, reviewed_at) on app.appeals to authenticated;
grant update (status) on app.reports to authenticated;
revoke insert, update, delete on app.data_exports from authenticated;
grant insert (user_id) on app.data_exports to authenticated;
revoke insert, update, delete on app.idempotency_records from authenticated;
revoke insert, delete on app.notifications from authenticated;
revoke update on app.notifications from authenticated;
grant update (read_at) on app.notifications to authenticated;
revoke insert, update, delete on app.moderation_jobs, app.moderation_findings,
  app.outbox_events, app.processed_events, app.admin_audit_log from authenticated;

alter table app.profiles enable row level security;
alter table app.user_private enable row level security;
alter table app.consent_records enable row level security;
alter table app.legal_documents enable row level security;
alter table app.role_assignments enable row level security;
alter table app.follows enable row level security;
alter table app.blocks enable row level security;
alter table app.community_requests enable row level security;
alter table app.communities enable row level security;
alter table app.community_memberships enable row level security;
alter table app.community_rules enable row level security;
alter table app.media_assets enable row level security;
alter table app.content enable row level security;
alter table app.content_media enable row level security;
alter table app.hashtags enable row level security;
alter table app.content_hashtags enable row level security;
alter table app.mentions enable row level security;
alter table app.comments enable row level security;
alter table app.reactions enable row level security;
alter table app.saves enable row level security;
alter table app.content_metrics enable row level security;
alter table app.feed_impressions enable row level security;
alter table app.conversations enable row level security;
alter table app.conversation_participants enable row level security;
alter table app.messages enable row level security;
alter table app.message_media enable row level security;
alter table app.stories enable row level security;
alter table app.story_views enable row level security;
alter table app.story_polls enable row level security;
alter table app.story_poll_votes enable row level security;
alter table app.highlights enable row level security;
alter table app.highlight_items enable row level security;
alter table app.moderation_jobs enable row level security;
alter table app.moderation_findings enable row level security;
alter table app.reports enable row level security;
alter table app.moderation_cases enable row level security;
alter table app.case_reports enable row level security;
alter table app.moderation_decisions enable row level security;
alter table app.appeals enable row level security;
alter table app.notifications enable row level security;
alter table app.data_exports enable row level security;
alter table app.feature_flags enable row level security;
alter table app.outbox_events enable row level security;
alter table app.processed_events enable row level security;
alter table app.idempotency_records enable row level security;
alter table app.admin_audit_log enable row level security;

create policy profiles_campus_read on app.profiles for select to authenticated
using (deleted_at is null or id = auth.uid() or app.is_admin());
create policy profiles_self_update on app.profiles for update to authenticated
using (id = auth.uid()) with check (id = auth.uid());

create policy user_private_self_read on app.user_private for select to authenticated
using (user_id = auth.uid() or app.is_admin());
create policy user_private_self_update on app.user_private for update to authenticated
using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy consents_self_read on app.consent_records for select to authenticated
using (user_id = auth.uid() or app.is_admin());
create policy consents_self_insert on app.consent_records for insert to authenticated
with check (user_id = auth.uid());
create policy legal_documents_read on app.legal_documents for select to authenticated
using (effective_at <= now());
create policy legal_documents_super_admin_write on app.legal_documents for all to authenticated
using (app.is_super_admin()) with check (app.is_super_admin());

create policy role_assignments_admin_read on app.role_assignments for select to authenticated
using (user_id = auth.uid() or app.is_admin());
create policy role_assignments_super_admin_write on app.role_assignments for all to authenticated
using (app.is_super_admin()) with check (app.is_super_admin());

create policy follows_read on app.follows for select to authenticated using (true);
create policy follows_self_write on app.follows for all to authenticated
using (follower_id = auth.uid()) with check (follower_id = auth.uid());
create policy blocks_self on app.blocks for all to authenticated
using (blocker_id = auth.uid()) with check (blocker_id = auth.uid());

create policy community_requests_self_or_admin_read on app.community_requests for select to authenticated
using (requester_id = auth.uid() or app.is_admin());
create policy community_requests_self_insert on app.community_requests for insert to authenticated
with check (requester_id = auth.uid());
create policy community_requests_admin_update on app.community_requests for update to authenticated
using (app.is_admin()) with check (app.is_admin());
create policy communities_read on app.communities for select to authenticated using (is_active or app.is_admin());
create policy communities_admin_write on app.communities for all to authenticated
using (app.is_admin()) with check (app.is_admin());
create policy memberships_read on app.community_memberships for select to authenticated using (true);
create policy memberships_self_insert on app.community_memberships for insert to authenticated
with check (user_id = auth.uid());
create policy memberships_self_delete on app.community_memberships for delete to authenticated
using (user_id = auth.uid() or app.is_admin());
create policy community_rules_read on app.community_rules for select to authenticated using (true);
create policy community_rules_moderator_write on app.community_rules for all to authenticated
using (exists (
  select 1 from app.community_memberships cm
  where cm.community_id = community_id and cm.user_id = auth.uid() and cm.role in ('moderator', 'owner')
)) with check (exists (
  select 1 from app.community_memberships cm
  where cm.community_id = community_id and cm.user_id = auth.uid() and cm.role in ('moderator', 'owner')
));

create policy media_owner_or_admin_read on app.media_assets for select to authenticated
using (owner_id = auth.uid() or app.is_admin());
create policy media_owner_insert on app.media_assets for insert to authenticated
with check (owner_id = auth.uid());

create policy content_visible_read on app.content for select to authenticated using (app.can_view_content(content));
create policy content_owner_insert on app.content for insert to authenticated with check (author_id = auth.uid());
create policy content_owner_update on app.content for update to authenticated
using (author_id = auth.uid() or app.is_admin()) with check (author_id = auth.uid() or app.is_admin());

create policy content_media_visible_read on app.content_media for select to authenticated
using (exists (select 1 from app.content c where c.id = content_id and app.can_view_content(c)));
create policy content_media_owner_write on app.content_media for all to authenticated
using (exists (select 1 from app.content c where c.id = content_id and c.author_id = auth.uid()))
with check (
  exists (select 1 from app.content c where c.id = content_id and c.author_id = auth.uid())
  and exists (select 1 from app.media_assets m where m.id = media_asset_id and m.owner_id = auth.uid())
);
create policy hashtags_read on app.hashtags for select to authenticated using (true);
create policy content_hashtags_visible_read on app.content_hashtags for select to authenticated using (
  exists (select 1 from app.content c where c.id = content_id and app.can_view_content(c))
);
create policy content_hashtags_owner_write on app.content_hashtags for all to authenticated
using (exists (select 1 from app.content c where c.id = content_id and c.author_id = auth.uid()))
with check (exists (select 1 from app.content c where c.id = content_id and c.author_id = auth.uid()));
create policy mentions_subject_or_creator_read on app.mentions for select to authenticated
using (mentioned_user_id = auth.uid() or created_by = auth.uid());
create policy mentions_creator_insert on app.mentions for insert to authenticated
with check (created_by = auth.uid());

create policy comments_visible_read on app.comments for select to authenticated
using (deleted_at is null and (author_id = auth.uid() or moderation_status = 'approved') and exists (
  select 1 from app.content c where c.id = content_id and app.can_view_content(c)
));
create policy comments_self_insert on app.comments for insert to authenticated with check (author_id = auth.uid());
create policy comments_self_update on app.comments for update to authenticated
using (author_id = auth.uid() or app.is_admin()) with check (author_id = auth.uid() or app.is_admin());

create policy reactions_visible_read on app.reactions for select to authenticated using (
  exists (select 1 from app.content c where c.id = content_id and app.can_view_content(c))
);
create policy reactions_self_write on app.reactions for all to authenticated
using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy saves_self on app.saves for all to authenticated
using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy content_metrics_visible_read on app.content_metrics for select to authenticated using (
  exists (select 1 from app.content c where c.id = content_id and app.can_view_content(c))
);
create policy impressions_self_insert on app.feed_impressions for insert to authenticated with check (viewer_id = auth.uid());
create policy impressions_self_read on app.feed_impressions for select to authenticated using (viewer_id = auth.uid());

create policy conversations_participant_read on app.conversations for select to authenticated
using (app.is_conversation_participant(id));
create policy conversations_creator_insert on app.conversations for insert to authenticated
with check (created_by = auth.uid());
create policy conversations_owner_update on app.conversations for update to authenticated
using (exists (
  select 1 from app.conversation_participants cp
  where cp.conversation_id = id and cp.user_id = auth.uid() and cp.role = 'owner' and cp.left_at is null
)) with check (created_by = auth.uid() or app.is_conversation_participant(id));
create policy participants_conversation_read on app.conversation_participants for select to authenticated
using (app.is_conversation_participant(conversation_id));
create policy participants_creator_insert on app.conversation_participants for insert to authenticated
with check (exists (
  select 1 from app.conversations c
  where c.id = conversation_id and c.created_by = auth.uid()
    and (role = 'member' or (user_id = auth.uid() and role = 'owner'))
));
create policy participants_self_update on app.conversation_participants for update to authenticated
using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy messages_participant_read on app.messages for select to authenticated
using (app.is_conversation_participant(conversation_id));
create policy messages_participant_insert on app.messages for insert to authenticated
with check (sender_id = auth.uid() and app.is_conversation_participant(conversation_id));
create policy message_media_participant_read on app.message_media for select to authenticated using (
  exists (select 1 from app.messages m where m.id = message_id and app.is_conversation_participant(m.conversation_id))
);
create policy message_media_sender_insert on app.message_media for insert to authenticated with check (
  exists (select 1 from app.messages m where m.id = message_id and m.sender_id = auth.uid())
  and exists (select 1 from app.media_assets a where a.id = media_asset_id and a.owner_id = auth.uid())
);

create policy stories_visible_read on app.stories for select to authenticated using (
  app.can_view_story(stories)
);
create policy stories_self_insert on app.stories for insert to authenticated with check (author_id = auth.uid());
create policy story_views_author_or_viewer on app.story_views for select to authenticated using (
  viewer_id = auth.uid() or exists (select 1 from app.stories s where s.id = story_id and s.author_id = auth.uid())
);
create policy story_views_self_insert on app.story_views for insert to authenticated with check (
  viewer_id = auth.uid() and exists (
    select 1 from app.stories s where s.id = story_id and app.can_view_story(s)
  )
);
create policy story_polls_visible_read on app.story_polls for select to authenticated using (
  exists (select 1 from app.stories s where s.id = story_id and app.can_view_story(s))
);
create policy story_polls_author_insert on app.story_polls for insert to authenticated with check (
  exists (select 1 from app.stories s where s.id = story_id and s.author_id = auth.uid())
);
create policy story_votes_visible_read on app.story_poll_votes for select to authenticated using (
  voter_id = auth.uid() or exists (
    select 1 from app.story_polls p join app.stories s on s.id = p.story_id
    where p.id = poll_id and s.author_id = auth.uid()
  )
);
create policy story_votes_self_insert on app.story_poll_votes for insert to authenticated
with check (voter_id = auth.uid());
create policy highlights_owner_write on app.highlights for all to authenticated
using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy highlights_campus_read on app.highlights for select to authenticated using (true);
create policy highlight_items_campus_read on app.highlight_items for select to authenticated using (true);
create policy highlight_items_owner_write on app.highlight_items for all to authenticated
using (exists (select 1 from app.highlights h where h.id = highlight_id and h.owner_id = auth.uid()))
with check (
  exists (select 1 from app.highlights h where h.id = highlight_id and h.owner_id = auth.uid())
  and exists (select 1 from app.stories s where s.id = story_id and s.author_id = auth.uid())
);

create policy reports_self_insert on app.reports for insert to authenticated with check (reporter_id = auth.uid());
create policy reports_self_or_admin_read on app.reports for select to authenticated
using (reporter_id = auth.uid() or app.is_admin());
create policy reports_admin_update on app.reports for update to authenticated
using (app.is_admin()) with check (app.is_admin());
create policy moderation_cases_admin on app.moderation_cases for all to authenticated
using (app.is_admin()) with check (app.is_admin());
create policy case_reports_admin on app.case_reports for all to authenticated
using (app.is_admin()) with check (app.is_admin());
create policy decisions_subject_or_admin_read on app.moderation_decisions for select to authenticated
using (app.is_admin() or exists (
  select 1 from app.moderation_cases mc
  where mc.id = case_id and mc.target_id = auth.uid() and mc.target_type = 'profile'
));
create policy decisions_admin_insert on app.moderation_decisions for insert to authenticated with check (app.is_admin());
create policy appeals_self_insert on app.appeals for insert to authenticated with check (appellant_id = auth.uid());
create policy appeals_self_or_admin_read on app.appeals for select to authenticated
using (appellant_id = auth.uid() or app.is_admin());
create policy appeals_admin_update on app.appeals for update to authenticated
using (app.is_admin()) with check (app.is_admin());

create policy notifications_self on app.notifications for select to authenticated using (recipient_id = auth.uid());
create policy notifications_self_update on app.notifications for update to authenticated
using (recipient_id = auth.uid()) with check (recipient_id = auth.uid());
create policy data_exports_self_read on app.data_exports for select to authenticated
using (user_id = auth.uid() or app.is_admin());
create policy data_exports_self_insert on app.data_exports for insert to authenticated
with check (user_id = auth.uid());
create policy feature_flags_read on app.feature_flags for select to authenticated using (true);
create policy feature_flags_super_admin_write on app.feature_flags for all to authenticated
using (app.is_super_admin()) with check (app.is_super_admin());
create policy idempotency_self on app.idempotency_records for all to authenticated
using (actor_id = auth.uid()) with check (actor_id = auth.uid());
create policy audit_admin_read on app.admin_audit_log for select to authenticated using (app.is_admin());

-- No authenticated policies are intentionally created for outbox_events,
-- processed_events, moderation_jobs, or moderation_findings. They are service-only.

commit;
