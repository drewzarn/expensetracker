var IDBInterface = {
    DB: null,
    DBName: 'expensedb',
    DBVersion: 2,
    Init: async function () {
        console.log('Init IDBInterface for ' + IDBInterface.DBName + ' version ' + IDBInterface.DBVersion);
        IDBInterface.DB = await idb.openDB(IDBInterface.DBName, IDBInterface.DBVersion, {
            upgrade(db, oldVersion, newVersion, transaction) {
                console.log('Upgrading DB from ' + oldVersion + ' to ' + newVersion);
                if (!db.objectStoreNames.contains('category')) {
                    var categoryStore = db.createObjectStore('category', {keyPath: 'id'});
                    categoryStore.createIndex("parity", "parity", {unique: false});
                    categoryStore.createIndex("name", "name", {unique: false});
                }
                if (!db.objectStoreNames.contains('payee')) {
                    var payeeStore = db.createObjectStore('payee', {keyPath: 'id'});
                    payeeStore.createIndex("name", "name", {unique: false});
                }
                if (!db.objectStoreNames.contains('transaction')) {
                    var transactionStore = db.createObjectStore('transaction', {keyPath: 'id'});
                    transactionStore.createIndex("payee", "payee_id", {unique: false});
                    transactionStore.createIndex("category", "category_id", {unique: false});
                    transactionStore.createIndex("date", "date", {unique: false});
                    transactionStore.createIndex("year", "year", {unique: false});
                    transactionStore.createIndex("month", "month", {unique: false});
                    transactionStore.createIndex("day", "day", {unique: false});
                    transactionStore.createIndex("monthyear", "monthyear", {unique: false});
                    transactionStore.createIndex("weekday", "weekday", {unique: false});
                }
                if (!db.objectStoreNames.contains('accounttype')) {
                    var accountTypeStore = db.createObjectStore('accounttype', {keyPath: 'id'});
                }
                if (!db.objectStoreNames.contains('account')) {
                    var accountStore = db.createObjectStore('account', {keyPath: 'id'});
                    accountStore.createIndex("accounttype", "account_type_id", {unique: false});
                }
                if (!db.objectStoreNames.contains('balance')) {
                    var balanceStore = db.createObjectStore('balance', {keyPath: 'id'});
                    balanceStore.createIndex("account", "account_id", {unique: false});
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
        await IDBInterface.DB.put(store, record);
    },
    QueuedRecords: {},
    QueueRecord: async function (store, record) {
        console.log('Queueing record for ' + store);
        if(IDBInterface.QueuedRecords[store] == null) IDBInterface.QueuedRecords[store] = [];
        IDBInterface.QueuedRecords[store].push(record);
        return IDBInterface.QueuedRecords[store].length;
    },
    CommitQueuedRecords: async function(store) {
        var tx = IDBInterface.DB.transaction(store, 'readwrite');
        console.log('Committing ' + IDBInterface.QueuedRecords[store].length + ' records to ' + store);
        /*IDBInterface.QueuedRecords[store].forEach(function(item, i){
            if(item.hasOwnProperty('id')) {
                tx.store.add(item);
            } else {
                tx.store.add(item, 33);
            }
        });*/
        IDBInterface.QueuedRecords[store] = [];
        await tx.done;
    },
    GetAllKeys: async function(store) {
        return await IDBInterface.DB.getAllKeys(store);
    },
    GetAll: async function(store) {
        return await IDBInterface.DB.getAll(store);
    },
    GetRecordByID: async function (store, id) {
        console.log('Getting record ' + id + ' from ' + store);
        return await IDBInterface.DB.get(store, id);
    },
    GetRecordsByIndex: async function (store, index, value) {
        console.log('Getting records from ' + store + ' for ' + index + ' of ' + value);
        return await IDBInterface.DB.getAllFromIndex(store, index, value);
    }
}

