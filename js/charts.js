var charts = {
    spendingByMonth: null
};

google.charts.load('current', {'packages':['corechart', 'table']});
google.charts.setOnLoadCallback(drawCharts);

function drawCharts() {
    fetchSpendingByMonth();
    fetchMTDComparison();
    fetchTransactionList();

    fetchTransactionsByMonthAndType(true);
}

function fetchSpendingByMonth() {
    $.get('/summary/list/preset=spendingbymonth')
        .done(drawSpendingByMonth);
}

function drawSpendingByMonth(json) {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Month');
    data.addColumn('number', 'Income');
    data.addColumn('number', 'Expenses');
    data.addColumn('number', 'Net');
    $.each(json.data, function(i, o){
        data.addRow([
            o.month,
            parseFloat(o.income),
            parseFloat(o.expenses),
            parseFloat(o.net)
        ])
    });

    charts.spendingByMonth = new google.visualization.ColumnChart(document.getElementById('spendingbymonth'));
    var options = {
        legend: { position: 'bottom' },
        colors: ['green', 'red', 'blue']
    };
    charts.spendingByMonth.draw(data, options);

    google.visualization.events.addListener(charts.spendingByMonth, 'select', fetchTransactionsByMonthAndType);
}

function fetchTransactionsByMonthAndType(e) {
    if(e == true) {
        var month = new Date().getMonth() + 1;
        var type = 'expenses';
    } else {
        var selection = charts.spendingByMonth.getSelection();
        var monthsAgo = 6 - selection[0].row;
        var month = new Date().getMonth() + 2 - monthsAgo;
        if(month < 1) {
            month = 11 - month;
            year--;
        }
        var types = ['income', 'expenses', 'net'];
        var type = types[selection[0].column - 1];
        if(type == 'net') return;
    }
    var year = new Date().getFullYear();
    console.log(month + ' ' + type);
    $.get('/summary/list/preset=spendingbymonthandtype/type=' + type + '/year=' + year + '/month=' + month)
        .done(drawSpendingByMonthAndType);
}

function drawSpendingByMonthAndType(json) {
    charts.pie = new google.visualization.PieChart($('#categorypie div')[0]);
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Category');
    data.addColumn('number', 'Amount');
    $.each(json.data, function(i, o){
        data.addRow([
            o.category + ' - $' + Math.abs(Math.floor(o.amount)),
            Math.abs(parseFloat(o.amount))
        ])
    });
    var options = {
        height: '100%',
        width: '100%',
        chartArea: {
            top: 10,
            height: '100%',
            width: '100%'
        }
    };

    charts.pie.draw(data, options);
}

function fetchMTDComparison() {
    $.get('/summary/list/preset=mtdcomparison')
        .done(drawMTDComparison);
}

function drawMTDComparison(json) {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Month');
    data.addColumn('number', 'Income');
    data.addColumn('number', 'Exp to date');
    data.addColumn('number', 'Expenses');
    $.each(json.data, function(i, o){
        data.addRow([
            o.month,
            parseFloat(o.income),
            parseFloat(o.expensestodate),
            parseFloat(o.expenses)
        ])
    });

    var table = new google.visualization.Table($('#mtdcomparison div')[0]);
    var options = {
        showRowNumber: true,
        width: '100%',
        height: '100%'
    };
    table.draw(data, options);
}

function fetchTransactionList() {
    var d = new Date();
    d.setUTCDate(1);
    $.get('transaction/list/datatable/cols=trn_date,pay_name,trn_amount,trn_description,cat_name,cat_income_flag/limit=0/datefrom=' + d.toISOString().substring(0, 10) + '/orderby=trn_date desc')
        .done(drawTransactionList);
}

function drawTransactionList(json) {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Date');
    data.addColumn('string', 'Payee');
    data.addColumn('number', 'Amount');
    $.each(json.data, function(i, o){
        data.addRow([
            o.trn_date,
            o.pay_name,
            parseFloat(o.trn_amount)
        ]);
        data.setFormattedValue(i, 1, '<span title="' + o.cat_name + '">' + o.pay_name + (o.trn_description=='' ? '' : ' (' + o.trn_description + ')') + '</span>');
        if(o.cat_income_flag == "1") {
            data.setFormattedValue(i, 2, '<span class="income">' + Math.abs(parseFloat(o.trn_amount)) + '</span>');
        }
    });

    var table = new google.visualization.Table($('#transactionlist div')[0]);
    var options = {
        width: '100%',
        height: '100%',
        allowHtml: true
    };
    table.draw(data, options);
}

function fetchTransactionsByPayee(event, ui) {
    var pay_id = PAY_IDS[ui.item.value];
    $.get("/transaction/list/datatable/columns=trn_date,cat_name,trn_amount/limit=10/payee=" + pay_id)
        .done(drawTransactionsByPayee);
}

function drawTransactionsByPayee(json) {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Date');
    data.addColumn('string', 'Category');
    data.addColumn('number', 'Amount');
    $.each(json.data, function(i, o){
        data.addRow([
            o.trn_date,
            o.cat_name,
            parseFloat(o.trn_amount)
        ]);
    });

    var table = new google.visualization.Table($('#payee_transactions')[0]);
    var options = {
        width: '100%',
        height: '100%',
        allowHtml: true
    };
    table.draw(data, options);
}