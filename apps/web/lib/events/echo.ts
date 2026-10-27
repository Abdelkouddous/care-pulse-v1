import Echo from "laravel-echo";
import Pusher from "pusher-js";

declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo: Echo<any>;
  }
}

let echoInstance: Echo<any> | null = null;

export const getEcho = (): Echo<any> | null => {
  if (typeof window === "undefined") {
    return null;
  }

  if (echoInstance) {
    return echoInstance;
  }

  window.Pusher = Pusher;

  const appKey = process.env.NEXT_PUBLIC_REVERB_APP_KEY || "vitalbook-key";
  const wsHost = process.env.NEXT_PUBLIC_REVERB_HOST || "localhost";
  const wsPort = Number(process.env.NEXT_PUBLIC_REVERB_PORT || 8080);
  const scheme = process.env.NEXT_PUBLIC_REVERB_SCHEME || "http";
  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const backendUrl = rawApiUrl.replace(/\/api(\/v\d+)?\/?$/, "");
  const authEndpoint = `${backendUrl}/api/broadcasting/auth`;

  echoInstance = new Echo({
    broadcaster: "reverb",
    key: appKey,
    wsHost,
    wsPort,
    wssPort: wsPort,
    forceTLS: scheme === "https",
    enabledTransports: ["ws", "wss"],
    disableStats: true,
    authEndpoint,
    auth: {
      headers: {
        Accept: "application/json",
      },
    },
    authorizer: (channel: any, options: any) => {
      return {
        authorize: (socketId: string, callback: Function) => {
          const token =
            localStorage.getItem("vitalbook_token") ||
            localStorage.getItem("user_token");

          fetch(authEndpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
            body: JSON.stringify({
              socket_id: socketId,
              channel_name: channel.name,
            }),
          })
            .then(async (response) => {
              if (!response.ok) {
                throw new Error(`Broadcast auth failed with status ${response.status}`);
              }
              const data = await response.json();
              callback(null, data);
            })
            .catch((error) => {
              callback(error, null);
            });
        },
      };
    },
  });

  window.Echo = echoInstance;
  return echoInstance;
};

export const echo = typeof window !== "undefined" ? getEcho() : null;