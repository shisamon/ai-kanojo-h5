# AIAI RunPod Worker

This is the first Serverless worker for `/api/generate-video`.

It accepts the shape already sent by the web app:

```json
{
  "input": {
    "prompt": "short video prompt",
    "image": "data:image/png;base64,...",
    "character": {},
    "template": {}
  }
}
```

The current version is a deployable smoke-test worker. It returns the incoming preview image as the media URL so the website can verify authentication, diamond spending, job creation, and response parsing.

Replace `generate_video` in `handler.py` with the real ComfyUI/Wan/AnimateDiff pipeline when the model runtime is ready. For production, upload generated MP4 files to object storage and return:

```json
{
  "output": {
    "video_url": "https://your-storage/result.mp4",
    "thumbnail_url": "https://your-storage/thumb.jpg"
  }
}
```

## Deploy

In RunPod:

1. Serverless
2. New Endpoint
3. Custom deployment
4. Deploy from GitHub
5. Select this repository
6. Set the build context to `runpod-worker`
7. Use `runpod-worker/Dockerfile`

After deployment, set the endpoint URL in Vercel as `RUNPOD_VIDEO_ENDPOINT`.
