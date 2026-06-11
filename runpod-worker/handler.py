import os
import re
from typing import Any, Dict

import requests
import runpod


BLOCKED_RE = re.compile(
    r"(未成年|未滿|未满|儿童|兒童|小孩|幼女|萝莉|蘿莉|初中|高中|minor|underage|loli|"
    r"rape|强迫|強迫|偷拍|非自愿|非自願|non[-\s]?consensual|celebrity|明星|名人|deepfake)",
    re.IGNORECASE,
)


def clean_text(value: Any, fallback: str = "") -> str:
    if not isinstance(value, str):
        return fallback
    return re.sub(r"\s+", " ", value).strip()[:1000]


def validate_input(payload: Dict[str, Any]) -> Dict[str, Any]:
    prompt = clean_text(payload.get("prompt"))
    image = clean_text(payload.get("image"))
    character = payload.get("character") if isinstance(payload.get("character"), dict) else {}
    template = payload.get("template") if isinstance(payload.get("template"), dict) else {}

    age = character.get("age")
    if age not in (None, ""):
        try:
            if float(age) < 18:
                raise ValueError("adult_only")
        except ValueError as exc:
            if str(exc) == "adult_only":
                raise

    safety_text = " ".join(
        [
            prompt,
            clean_text(character.get("name")),
            clean_text(character.get("tag")),
            clean_text(template.get("name")),
        ]
    )
    if BLOCKED_RE.search(safety_text):
        raise ValueError("safety_blocked")
    if not image.startswith("data:image/") and not image.startswith("http"):
        raise ValueError("missing_image")

    return {
        "prompt": prompt,
        "image": image,
        "character": character,
        "template": template,
    }


def call_external_provider(request: Dict[str, Any]) -> Dict[str, Any] | None:
    provider_url = os.environ.get("VIDEO_PROVIDER_URL")
    provider_key = os.environ.get("VIDEO_PROVIDER_API_KEY")
    if not provider_url:
        return None

    headers = {"Content-Type": "application/json"}
    if provider_key:
        headers["Authorization"] = f"Bearer {provider_key}"

    response = requests.post(provider_url, json=request, headers=headers, timeout=900)
    response.raise_for_status()
    payload = response.json()
    output = payload.get("output") if isinstance(payload, dict) else None
    if isinstance(output, dict):
        return output
    return payload if isinstance(payload, dict) else None


def generate_video(request: Dict[str, Any]) -> Dict[str, Any]:
    provider_output = call_external_provider(request)
    if provider_output:
        video_url = provider_output.get("video_url") or provider_output.get("videoUrl") or provider_output.get("url")
        thumbnail_url = provider_output.get("thumbnail_url") or provider_output.get("thumbnailUrl")
        if video_url:
            return {
                "video_url": video_url,
                "thumbnail_url": thumbnail_url or request["image"],
                "provider": "external",
            }

    return {
        "video_url": request["image"],
        "thumbnail_url": request["image"],
        "provider": "demo",
        "message": "RunPod worker is connected. Replace generate_video with a real video pipeline.",
    }


def handler(job: Dict[str, Any]) -> Dict[str, Any]:
    try:
        job_input = job.get("input") or {}
        request = validate_input(job_input)
        return {"output": generate_video(request)}
    except ValueError as exc:
        return {"error": str(exc)}
    except Exception as exc:
        return {"error": f"worker_failed: {exc}"}


runpod.serverless.start({"handler": handler})
