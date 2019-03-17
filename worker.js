'use strict';

// Licensed under a CC0 1.0 Universal (CC0 1.0) Public Domain Dedication
// http://creativecommons.org/publicdomain/zero/1.0/

(function() {
    if (typeof idb === "undefined") {
        self.importScripts('js/idb.js');
    }
    var CACHE_NAME = 'expenses-cache-1';

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
            navigator.serviceWorker.register('/worker.js').then(function (registration) {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }, function (err) {
                console.log('ServiceWorker registration failed: ', err);
            });
        });
    }

    self.addEventListener('install', function (event) {
        event.waitUntil(
            caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log('Opened cache');
                return cache.addAll([]);
            })
            );
        expensedb = idb.openDb('expensedb', 2, function (upgradeDb) {
            console.log('making a new object store');
            if (!upgradeDb.objectStoreNames.contains('category')) {
                upgradeDb.createObjectStore('category', {keyPath: 'id', autoIncrement: true});
            }
        });
    });

    self.addEventListener('fetch', function (event) {
        console.log(event.request.url);
        if(event.request.url.endsWith('/list')) {
            var urlChunks = event.request.url.split('/');
            var dataObject = urlChunks[urlChunks.length - 2];
            console.log(dataObject);
        }
        event.respondWith(
            caches.match(event.request)
            .then(function (response) {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                return fetch(event.request);
            }
            )
            );
    });
})();