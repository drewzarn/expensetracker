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
    event.waitUntil(
        caches.open('expensesinfra')
    );
    event.waitUntil(self.skipWaiting()); // Activate worker immediately
});

self.addEventListener('activate', function (event) {
    console.log('SW Activated', event);
    event.waitUntil(self.clients.claim()); // Become available to all pages
});

self.addEventListener('fetch', event => {
    if (event.request.method != 'GET') return;
    if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {
        return;
    }

    if (event.request.url.indexOf('/list') >= 0) {
        event.respondWith(
            fetch(event.request)
            .then(response => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                response.clone().json()
                    .then(data => {
                        ProcessDataList(data);
                    });
                return response;
            })
        );
    } else {
        event.respondWith(
            caches.open('expensesinfra').then(function (cache) {
                return cache.match(event.request).then(function (response) {
                    return response || fetch(event.request).then(function (response) {
                        cache.put(event.request, response.clone());
                        return response;
                    });
                });
            })
        );
    }
});

async function ProcessDataList(data) {
    if (DB[data.object] == null) {
        console.error("No table found for " + data.object);
        console.trace();
        return;
    }

    (data.paged ? Promise.resolve(100) : DB[data.object].clear())
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
        let msgData = {
            loaded: data.object
        };
        if (data.nextpage != null) {
            msgData.fetch = data.nextpage;
        }
        channel.postMessage(msgData);
    });
}