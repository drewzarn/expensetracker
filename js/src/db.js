import Dexie from 'dexie';
import 'dexie-observable';
import 'dexie-syncable';

const DB = new Dexie('expensedata');
DB.version(1).stores({
    payees: 'id,name',
    accounts: 'id,accounttype',
    accounttypes: 'id',
    balances: 'id,account',
    categories: 'id,parity,name',
    transactions: 'id,payee,category,date,year,month,day,monthyear,weekday',
    metadata: 'table'
});

const DBWrapper = {
    bulkAdd: function(table, data, force = false) {
        DB.metadata.get(table).then(function(meta){
            if(force==true || new Date().getTime() - meta.lastBulk.getTime() > 60 * 60 * 1000) {
                DB[table].clear();
                DB[table].bulkAdd(data);
                DB.metadata.put({table: table, lastBulk: new Date()});
            } else {
                console.log("Skipping bulk add for " + table + " due to freshness");
            }
        })
        .catch(function(){
            DB[table].clear();
            DB[table].bulkAdd(data);
            DB.metadata.put({table: table, lastBulk: new Date()});
        });
    }
};

export default {DB, DBWrapper};