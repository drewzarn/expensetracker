var Charts = {
    Balances: {
        selector: '#balancechart',
        labels: [],
        allseries: {},
        Draw: function () {
            let series = {Net: {name: 'Net', points: {}}};
            DB.balances.toArray().then(balances => {
                balances.forEach(balance => {
                    if(balance.account.excludenetworth) return;

                    if(series[balance.accounttype.name] == null) {
                        series[balance.accounttype.name] = {name: balance.accounttype.name, points: {}};
                    }
                    if(series[balance.accounttype.name].points[balance.date] == null) {
                        series[balance.accounttype.name].points[balance.date] = 0;
                    }
                    if(series.Net.points[balance.date] == null) {
                        series.Net.points[balance.date] = 0;
                    }
                    series[balance.accounttype.name].points[balance.date] += balance.amount;
                    series.Net.points[balance.date] += (balance.accounttype.asset ? 1 : -1 ) * balance.amount;
                });

                let seriesArray = [];
                let seriesColors = {Net: 'blue', Asset: 'green', 'Credit Card': 'red', Loan: 'yellow'};
                for(var accountType in series) {
                    var seriesData = {
                        name: accountType,
                        color: seriesColors[accountType],
                        points: []
                    }
                    Object.keys(series[accountType].points).sort().forEach(date => {
                        seriesData.points.push([date, series[accountType].points[date]]);
                    });
                    seriesArray.push(seriesData);
                }

                const chart = new JSC.Chart("balancechart", {
                    series: seriesArray,
                    defaultSeries_type: 'spline',
                    legend_template: '%icon %name',
                    defaultPoint_tooltip: function(point){ return '<strong>' + moment(point.options("x")).format("MM/DD/YYYY") + '</strong><br/>' + point.series.name + '<br/>' + Utils.CurrencyFormatter.format(point.options("y")); },
                    yAxis_formatString: 'c',
                  });
            });
        }
    }
};