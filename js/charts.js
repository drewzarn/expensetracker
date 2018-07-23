google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawCharts);

function drawCharts() {
    fetch12MonthREIN();
}

function fetch12MonthREIN() {
    $.get('/summary/list/preset=12monthrein')
        .done(draw12MonthREIN);
}

function draw12MonthREIN(json) {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Month');
    data.addColumn('number', 'Income');
    data.addColumn('number', 'Returns');
    data.addColumn('number', 'Expenses');
    data.addColumn('number', 'Net');
    $.each(json.data, function(i, o){
        data.addRow([
            o.month,
            Math.floor(o.income),
            Math.floor(o.returns),
            Math.floor(o.expenses),
            Math.floor(o.net)
        ])
    });

    var chart = new google.visualization.ColumnChart(document.getElementById('12monthrein'));
    var options = {
        legend: { position: 'bottom' },
        colors: ['green', 'grey', 'red', 'blue']
    };
    chart.draw(data, options);
}