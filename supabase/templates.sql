-- Generation templates (styles) table + seed.
-- Run after schema.sql. Safe to run multiple times: IDs are fixed and rows are upserted.

create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  mode text not null check (mode in ('image', 'video')),
  name_zh text not null,
  name_ja text not null,
  cost integer not null default 0,
  image_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.templates enable row level security;

drop policy if exists "Active templates are readable" on public.templates;
create policy "Active templates are readable"
  on public.templates for select
  using (is_active = true);

-- Video templates (mirrors current app.js videoTemplates)
insert into public.templates (id, mode, name_zh, name_ja, cost, sort_order)
values
  ('bbbbbbbb-bbbb-4bbb-8bbb-000000000001', 'video', '脱衣', '脱衣', 96, 1),
  ('bbbbbbbb-bbbb-4bbb-8bbb-000000000002', 'video', '亲密口部', '口元シーン', 96, 2),
  ('bbbbbbbb-bbbb-4bbb-8bbb-000000000003', 'video', '道具演示', '道具シーン', 96, 3),
  ('bbbbbbbb-bbbb-4bbb-8bbb-000000000004', 'video', '胸部按摩', '胸元マッサージ', 96, 4),
  ('bbbbbbbb-bbbb-4bbb-8bbb-000000000005', 'video', '私密展示', 'プライベート表示', 96, 5),
  ('bbbbbbbb-bbbb-4bbb-8bbb-000000000006', 'video', '俯身姿势', 'バックポーズ', 96, 6),
  ('bbbbbbbb-bbbb-4bbb-8bbb-000000000007', 'video', '手部亲密', '手元シーン', 96, 7),
  ('bbbbbbbb-bbbb-4bbb-8bbb-000000000008', 'video', '侧身亲密', '横向き口元', 96, 8),
  ('bbbbbbbb-bbbb-4bbb-8bbb-000000000009', 'video', '骑乘姿势', '騎乗ポーズ', 96, 9),
  ('bbbbbbbb-bbbb-4bbb-8bbb-000000000010', 'video', '胸部亲密', '胸元シーン', 96, 10),
  ('bbbbbbbb-bbbb-4bbb-8bbb-000000000011', 'video', '正面姿势', '正面ポーズ', 96, 11),
  ('bbbbbbbb-bbbb-4bbb-8bbb-000000000012', 'video', '淋浴', 'シャワー', 96, 12),
  ('bbbbbbbb-bbbb-4bbb-8bbb-000000000013', 'video', '自定义视频', 'カスタム動画', 120, 13)
on conflict (id) do update set
  mode = excluded.mode,
  name_zh = excluded.name_zh,
  name_ja = excluded.name_ja,
  cost = excluded.cost,
  sort_order = excluded.sort_order;

-- Image templates (mirrors current app.js imageTemplates)
insert into public.templates (id, mode, name_zh, name_ja, cost, sort_order)
values
  ('cccccccc-cccc-4ccc-8ccc-000000000001', 'image', '脱衣', '脱衣', 40, 1),
  ('cccccccc-cccc-4ccc-8ccc-000000000002', 'image', '俯身姿势', 'バックポーズ', 40, 2),
  ('cccccccc-cccc-4ccc-8ccc-000000000003', 'image', '骑乘姿势', '騎乗ポーズ', 40, 3),
  ('cccccccc-cccc-4ccc-8ccc-000000000004', 'image', '亲密口部', '口元シーン', 40, 4),
  ('cccccccc-cccc-4ccc-8ccc-000000000005', 'image', '正面姿势', '正面ポーズ', 40, 5),
  ('cccccccc-cccc-4ccc-8ccc-000000000006', 'image', '侧身亲密', '横向き口元', 40, 6),
  ('cccccccc-cccc-4ccc-8ccc-000000000007', 'image', '胸部亲密', '胸元シーン', 40, 7),
  ('cccccccc-cccc-4ccc-8ccc-000000000008', 'image', '手部亲密', '手元シーン', 40, 8),
  ('cccccccc-cccc-4ccc-8ccc-000000000009', 'image', '足部亲密', '足元シーン', 40, 9),
  ('cccccccc-cccc-4ccc-8ccc-000000000010', 'image', '雨衣', 'レインコート', 20, 10),
  ('cccccccc-cccc-4ccc-8ccc-000000000011', 'image', '情趣酒店', 'ラブホテル', 20, 11),
  ('cccccccc-cccc-4ccc-8ccc-000000000012', 'image', '豪宅', '邸宅', 20, 12),
  ('cccccccc-cccc-4ccc-8ccc-000000000013', 'image', '蒙眼', '目隠し', 20, 13),
  ('cccccccc-cccc-4ccc-8ccc-000000000014', 'image', '自定义姿势', 'カスタムポーズ', 40, 14),
  ('cccccccc-cccc-4ccc-8ccc-000000000015', 'image', '淋浴', 'シャワー', 40, 15),
  ('cccccccc-cccc-4ccc-8ccc-000000000016', 'image', '俯身', '前かがみ', 40, 16)
on conflict (id) do update set
  mode = excluded.mode,
  name_zh = excluded.name_zh,
  name_ja = excluded.name_ja,
  cost = excluded.cost,
  sort_order = excluded.sort_order;
