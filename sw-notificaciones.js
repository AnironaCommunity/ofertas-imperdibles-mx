const CACHE_VERSION = "oi-avisos-v77.6";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const destino = event.notification?.data?.url || "/";
  event.waitUntil((async () => {
    const ventanas = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const ventana of ventanas) {
      if ("focus" in ventana) {
        await ventana.focus();
        if ("navigate" in ventana) await ventana.navigate(destino);
        return;
      }
    }
    if (self.clients.openWindow) await self.clients.openWindow(destino);
  })());
});
