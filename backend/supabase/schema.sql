create table if not exists profiles (
  user_id uuid primary key,
  email text,
  premium boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists progress (
  user_id uuid not null,
  language_pair text not null,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, language_pair)
);

create table if not exists leaderboard_scores (
  user_id uuid primary key,
  display_name text not null default 'Player',
  xp bigint not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists subscriptions (
  user_id uuid primary key,
  provider text not null,
  customer_id text,
  subscription_id text,
  status text,
  current_period_end timestamptz,
  updated_at timestamptz not null default now()
);

alter table profiles enable row level security;
alter table progress enable row level security;
alter table leaderboard_scores enable row level security;
alter table subscriptions enable row level security;
