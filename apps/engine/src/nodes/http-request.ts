import axios from "axios";

export async function runHttpRequest(metadata: any) {
  const method = (metadata?.method || "GET").toUpperCase();
  const url = metadata?.url;

  if (!url) {
    throw new Error("HTTP node needs a url");
  }

  console.log(`[http-request] ${method} ${url}`);

  let headers = metadata?.headers;
  if (typeof headers === "string") {
    headers = JSON.parse(headers);
  }

  let body = metadata?.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      // keep as string
    }
  }

  const response = await axios({
    method,
    url,
    headers,
    data: ["POST", "PUT", "PATCH"].includes(method) ? body : undefined,
    timeout: 30000,
  });

  return {
    status: response.status,
    data: response.data,
  };
}
