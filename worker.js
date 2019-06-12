'use strict';

self.importScripts('js/dexie.js');
self.importScripts('js/db.js');

console.log('SW started', self);

const channel = new BroadcastChannel('sw-messages');
channel.addEventListener('message', event => {
    console.log('BC received in SW', event.data);

    if (event.data.load) {
        fetch('/' + event.data.load + '/list', {
                credentials: 'include'
            })
            .then(response => response.json())
            .then(data => {
                DB[event.data.load].clear()
                    .then(async () => {
                        for (const i in data.list) {
                            await DB[event.data.load].put(data.list[i]);
                        }
                        DB.metadata.put({
                            table: event.data.load,
                            count: 0,
                            lastBulk: new Date(),
                            lastUpdate: new Date()
                        });
                        channel.postMessage({
                            loaded: event.data.load
                        });
                    })
            });
    }
});

self.addEventListener('install', function (event) {
    console.log('SW Installed', event);
    event.waitUntil(self.skipWaiting()); // Activate worker immediately
});

self.addEventListener('activate', function (event) {
    console.log('SW Activated', event);
    event.waitUntil(self.clients.claim()); // Become available to all pages
});

self.addEventListener('fetch', event => {
    console.log("Fetching (" + event.request.method + ") " + event.request.url)
    if (event.request.method != 'GET') return;

    if (event.request.url.endsWith('/list')) {
        event.respondWith(
            fetch(event.request)
            .then(response => {
                response.clone().json()
                .then(data => {ProcessDataList(data);});
                return response;
            })
        );
    } else {
        return fetch(event.request);
    }
});

async function ProcessDataList(data) {
    if(DB[data.object] == null) {
        console.error("No table found for " + data.object);
        console.trace();
        return;
    }
    DB[data.object].clear()
        .then(async () => {
            for (const i in data.list) {
                await DB[data.object].put(data.list[i]);
            }
            DB.metadata.put({
                table: data.object,
                count: 0,
                lastBulk: new Date(),
                lastUpdate: new Date()
            });
            channel.postMessage({
                loaded: data.object
            });
        })
}