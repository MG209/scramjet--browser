importScripts("https://jsdelivr.net");
const { ScramjetServiceWorker } = $scramjetLoadWorker();
const scramjet = new ScramjetServiceWorker();

self.addEventListener("fetch", (event) => {
    event.respondWith(async () => {
        await scramjet.loadConfig();
    });
});

