-- Demo seed data for the H5 prototype.
-- Safe to run multiple times: IDs are fixed and rows are upserted.

insert into public.characters (id, name, age, tag, creator_name, image_url, is_public, created_at)
values
  ('11111111-1111-4111-8111-111111111111', 'Lina Hsu', 21, 'Asian', '@Ol''s_Erotes', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80', true, now() - interval '10 days'),
  ('22222222-2222-4222-8222-222222222222', 'Yumi Haven', 20, 'Asian', '@KanojoLab', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80', true, now() - interval '9 days'),
  ('33333333-3333-4333-8333-333333333333', 'Sera Muse', 23, 'Cinematic', '@MuseStudio', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80', true, now() - interval '8 days'),
  ('44444444-4444-4444-8444-444444444444', 'Tessa Thorn', 22, 'Neon', '@NightFrame', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80', true, now() - interval '7 days'),
  ('55555555-5555-4555-8555-555555555555', 'Priya Srisuk', 25, 'Travel', '@DreamClip', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80', true, now() - interval '6 days'),
  ('66666666-6666-4666-8666-666666666666', 'Jenna Park', 24, 'Soft', '@VelvetAI', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=900&q=80', true, now() - interval '5 days'),
  ('77777777-7777-4777-8777-777777777777', 'Mina Cloud', 19, 'Campus', '@KanojoLab', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80', true, now() - interval '4 days'),
  ('88888888-8888-4888-8888-888888888888', 'Freya Lane', 26, 'Fashion', '@MuseStudio', 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=900&q=80', true, now() - interval '3 days')
on conflict (id) do update set
  name = excluded.name,
  age = excluded.age,
  tag = excluded.tag,
  creator_name = excluded.creator_name,
  image_url = excluded.image_url,
  is_public = excluded.is_public;

insert into public.works (id, character_id, title, mode, media_url, thumbnail_url, cost, visibility, likes_count, created_at)
values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', '11111111-1111-4111-8111-111111111111', '雨夜霓虹 · 回眸短片', 'video', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80', 96, 'public', 2388, now() - interval '12 minutes'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', '22222222-2222-4222-8222-222222222222', '晨光窗边 · 温柔镜头', 'video', 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=900&q=80', 96, 'public', 2194, now() - interval '34 minutes'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3', '33333333-3333-4333-8333-333333333333', '电影感街拍 · 慢动作', 'video', 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=80', 120, 'public', 2066, now() - interval '1 hour'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa4', '44444444-4444-4444-8444-444444444444', '赛博灯牌 · 近景运镜', 'video', 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=80', 120, 'public', 1950, now() - interval '2 hours'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa5', '55555555-5555-4555-8555-555555555555', '海边风格 · 轻旅行', 'video', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80', 96, 'public', 1888, now() - interval '3 hours'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa6', '66666666-6666-4666-8666-666666666666', '复古胶片 · 眨眼片段', 'video', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80', 96, 'public', 1732, now() - interval '4 hours'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa7', '77777777-7777-4777-8777-777777777777', '校园日常 · 手持镜头', 'video', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80', 96, 'public', 1624, now() - interval '5 hours'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa8', '88888888-8888-4888-8888-888888888888', '杂志封面 · 时装走动', 'video', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80', 120, 'public', 1511, now() - interval '6 hours'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa9', '11111111-1111-4111-8111-111111111111', '居家柔光 · 侧脸特写', 'video', 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=900&q=80', 96, 'public', 1486, now() - interval '7 hours'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa10', '22222222-2222-4222-8222-222222222222', '夜景散步 · 拉近镜头', 'video', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80', 96, 'public', 1390, now() - interval '8 hours'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa11', '33333333-3333-4333-8333-333333333333', '高对比大片 · 定格微笑', 'video', 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=80', 120, 'public', 1288, now() - interval '9 hours'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa12', '44444444-4444-4444-8444-444444444444', '霓虹走廊 · 轻微摇镜', 'video', 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=80', 120, 'public', 1204, now() - interval '10 hours'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa13', '55555555-5555-4555-8555-555555555555', '日落海岸 · 回头动作', 'video', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80', 96, 'public', 1155, now() - interval '11 hours'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa14', '66666666-6666-4666-8666-666666666666', '暖色室内 · 坐姿短片', 'video', 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=900&q=80', 96, 'public', 1098, now() - interval '12 hours'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa15', '77777777-7777-4777-8777-777777777777', '午后教室 · 眨眼微笑', 'video', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80', 96, 'public', 1033, now() - interval '13 hours'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa16', '88888888-8888-4888-8888-888888888888', '秀场后台 · 转身动作', 'video', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80', 120, 'public', 986, now() - interval '14 hours')
on conflict (id) do update set
  character_id = excluded.character_id,
  title = excluded.title,
  mode = excluded.mode,
  media_url = excluded.media_url,
  thumbnail_url = excluded.thumbnail_url,
  cost = excluded.cost,
  visibility = excluded.visibility,
  likes_count = excluded.likes_count,
  created_at = excluded.created_at;
