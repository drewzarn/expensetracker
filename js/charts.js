var charts = {
    spendingByMonth: null
};

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawCharts);

function drawCharts() {
    fetchSpendingByMonth();
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
            Math.floor(o.income),
            Math.floor(o.expenses),
            Math.floor(o.net)
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
    var selection = charts.spendingByMonth.getSelection();
    var monthsAgo = 6 - selection[0].row;
    var month = new Date().getMonth() + 2 - monthsAgo;
    var year = new Date().getFullYear();
    if(month < 1) {
        month = 11 - month;
        year--;
    }
    var types = ['income', 'expenses', 'net'];
    var type = types[selection[0].column - 1];
    if(type == 'net') return;
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
            o.category + ' - ' + Math.abs(Math.floor(o.amount)),
            Math.abs(Math.floor(o.amount))
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