begin;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'media-quarantine',
    'media-quarantine',
    false,
    52428800,
    array['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime', 'video/webm']
  ),
  (
    'media-published',
    'media-published',
    false,
    52428800,
    array['image/jpeg', 'image/webp', 'video/mp4', 'application/vnd.apple.mpegurl', 'video/mp2t']
  ),
  (
    'data-exports',
    'data-exports',
    false,
    1073741824,
    array['application/zip', 'application/json']
  )
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- No direct browser insert/select policies are created. Express issues short-lived
-- signed upload/download URLs after authorization. Workers use service credentials.

commit;
