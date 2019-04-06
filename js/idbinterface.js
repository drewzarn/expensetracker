var IDBInterface = {
    DB: null,
    DBName: 'expensedb',
    DBVersion: 1,
    Init: async function () {
        console.log('Init IDBInterface for ' + IDBInterface.DBName + ' version ' + IDBInterface.DBVersion);
        IDBInterface.DB = await idb.openDB(IDBInterface.DBName, IDBInterface.DBVersion, {
            upgrade(db, oldVersion, newVersion, transaction) {
                console.log('Upgrading DB from ' + oldVersion + ' to ' + newVersion);
                if (!db.objectStoreNames.contains('category')) {
                    var categoryStore = db.createObjectStore('category', {});
                    categoryStore.createIndex("parity", "parity", {unique: false});
                    var payeeStore = db.createObjectStore('payee', {});
                    var transactionStore = db.createObjectStore('transaction', {});
                    transactionStore.createIndex("payee", "payee_id", {unique: false});
                    transactionStore.createIndex("category", "category_id", {unique: false});
                    transactionStore.createIndex("date", "date", {unique: false});
                    transactionStore.createIndex("year", "year", {unique: false});
                    transactionStore.createIndex("month", "month", {unique: false});
                    transactionStore.createIndex("day", "day", {unique: false});
                    transactionStore.createIndex("weekday", "weekday", {unique: false});
                }
            },
            blocked() {
                console.log('Blocked');
            },
            blocking() {
                console.log('Blocking');
            }
        });
    },
    AddRecord: async function (store, record) {
        console.log('Adding record to ' + store);
        await IDBInterface.DB.put(store, record, record.id);
    },
    GetRecordByID: async function (store, id) {
        console.log('Getting record ' + id + ' from ' + store);
        return await IDBInterface.DB.get(store, id);
    }
}

