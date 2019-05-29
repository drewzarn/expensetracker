'use strict';

self.importScripts('https://unpkg.com/dexie@2.0.4/dist/dexie.js');
const DB = new Dexie('expensedata');
self.importScripts('js/db-init.js');
console.log('SW started', self);

self.addEventListener('install', function (event) {
    console.log('SW Installed', event);
    event.waitUntil(self.skipWaiting()); // Activate worker immediately
});

self.addEventListener('activate', function (event) {
    console.log('SW Activated', event);
    event.waitUntil(self.clients.claim()); // Become available to all pages
});

self.addEventListener('message', function (event) {
    console.log("SW received message: ", event.data);

    if(event.data.load) {
        fetch('/' + event.data.load + '/list', {credentials: 'include'})
        .then(response => response.json())
        .then(data => {
            DB[event.data.load].clear();
            DB[event.data.load].bulkAdd(data.list);
            DB.metadata.put({table: event.data.load, lastBulk: new Date()});
        });
    }
});