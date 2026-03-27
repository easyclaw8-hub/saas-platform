// Client for communicating with Mac Mini video_server.py (port 5680)

const VIDEO_SERVER_URL = process.env.VIDEO_SERVER_URL || "http://localhost:5680";

interface ProducePayload {
  videoTitle: string;
  description?: string;
  tags?: string[];
}

export async function submitProduce(payload: ProducePayload) {
  const res = await fetch(`${VIDEO_SERVER_URL}/produce`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  // data.status = "started" | "busy" | "error"
  return data;
}

export async function getHealth() {
  try {
    const res = await fetch(`${VIDEO_SERVER_URL}/health`);
    const data = await res.json();
    return data; // { status: "ok", pipeline_running: true/false }
  } catch {
    return { status: "error", pipeline_running: false };
  }
}

export async function getStatus() {
  try {
    const res = await fetch(`${VIDEO_SERVER_URL}/status`);
    return await res.json();
    // { latest_log, complete, youtube_uploaded, pipeline_running, daily_uploads, tail }
  } catch {
    return { message: "Cannot reach video server" };
  }
}
