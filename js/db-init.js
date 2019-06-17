DB.version(1).stores({
    payee: 'id,name',
    account: 'id,accounttype,name',
    accounttype: 'id',
    balance: 'id,account',
    category: 'id,parity,name',
    transaction: 'id,payee,category,date,year,month,day,monthyear,weekday',
    metadata: 'table'
});