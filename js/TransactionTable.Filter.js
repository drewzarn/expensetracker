$.fn.dataTableExt.afnFiltering.push(
    function( oSettings, aData, iDataIndex ) {
        var startDate = moment($('#trnlistdatestart').val(), 'M/D/YYYY');
        var endDate = moment($('#trnlistdateend').val(), 'M/D/YYYY');

        var columns = {date: 0, payee: 1, category: 2};

        var trnDate = moment(aData[columns.date]);
        if(!trnDate.isBetween(startDate, endDate) && !trnDate.isSame(startDate) && !trnDate.isSame(endDate)) return false;

        var categoryMatch = TransactionListTable.Filters.Category.length == 0 || TransactionListTable.Filters.Category.indexOf(aData[columns.category]) >= 0;
        var payeeMatch = TransactionListTable.Filters.Payee.length == 0 || TransactionListTable.Filters.Payee.indexOf(aData[columns.payee]) >= 0;

        return categoryMatch && payeeMatch;
    }
);

