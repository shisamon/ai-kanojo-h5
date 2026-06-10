insert into public.characters (name, age, tag, creator_name, image_url, is_public)
values
  ('Yumi Haven', 20, 'Asian', '@Ol''s_Erotes', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80', true),
  ('Sera Muse', 23, 'Caucasian', '@Ol''s_Erotes', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80', true),
  ('Lina Hsu', 21, 'Asian', '@Ol''s_Erotes', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80', true)
on conflict do nothing;

insert into public.works (character_id, title, mode, media_url, thumbnail_url, cost, visibility, likes_count)
select id, 'Yumi Haven 灵感作品', 'image',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
  80, 'public', 1280
from public.characters
where name = 'Yumi Haven'
limit 1;

insert into public.works (character_id, title, mode, media_url, thumbnail_url, cost, visibility, likes_count)
select id, 'Sera Muse 灵感作品', 'image',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80',
  80, 'public', 942
from public.characters
where name = 'Sera Muse'
limit 1;

insert into public.works (character_id, title, mode, media_url, thumbnail_url, cost, visibility, likes_count)
select id, 'Lina Hsu 视频作品', 'video',
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=900&q=80',
  160, 'public', 412
from public.characters
where name = 'Lina Hsu'
limit 1;
