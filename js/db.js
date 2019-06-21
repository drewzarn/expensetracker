const DB = new Dexie('expensedata');

DB.version(3).stores({
    balances: 'id,account_id,accounttype_id,date',
});
DB.version(2).stores({
    accounts: 'id,accounttype_id,name',
    transactions: 'id,payee_id,category_id,date,year,month,day,monthyear,weekday'
});
DB.version(1).stores({
    payees: 'id,name',
    accounts: 'id,accounttype,name',
    accounttypes: 'id,name',
    balances: 'id,account_id,date',
    categories: 'id,parity,name',
    transactions: 'id,payee,category,date,year,month,day,monthyear,weekday',
    metadata: 'table'
});