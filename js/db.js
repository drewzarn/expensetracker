const DB = new Dexie('expensedata');
DB.version(1).stores({
    payees: 'id,name',
    accounts: 'id,accounttype,name',
    accounttypes: 'id,name',
    balances: 'id,account_id,date',
    categories: 'id,parity,name',
    transactions: 'id,payee,category,date,year,month,day,monthyear,weekday',
    metadata: 'table'
});
DB.open().then(function(){
    console.log("DB opened");
})
.catch(function (err) {
    console.error (err.stack || err);
});

const DBWrapper = {
    bulkAdd: function(table, data, force = false) {
        return;
        DB.metadata.get(table).then(function(meta){
            if(force==true || new Date().getTime() - meta.lastBulk.getTime() > 60 * 60 * 1000) {
                DB[table].clear();
                DB[table].bulkAdd(data);
                DB.metadata.put({table: table, lastBulk: new Date()});
            } else {
                console.log("Skipping bulk add for " + table + " due to freshness");
                DataUI[table]();
            }
        })
        .catch(function(){
            DB[table].clear();
            DB[table].bulkAdd(data);
            DB.metadata.put({table: table, lastBulk: new Date()});
        });
    }
};