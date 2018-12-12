$.fn.dataTableExt.afnFiltering.push(
    function( oSettings, aData, iDataIndex ) {
        var startDate = moment($('#trnlistdatestart').val(), 'M/D/YYYY');
        var endDate = moment($('#trnlistdateend').val(), 'M/D/YYYY');

        var columns = {date: 0, payee: 1, category: 2};

        var trnDate = moment(aData[columns.date]);
        if(!trnDate.isBetween(startDate, endDate)) return false;

        return true;
    }
);

