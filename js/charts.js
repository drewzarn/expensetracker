var Charts = {
    Balances: {
        Draw: function () {
            let series = {
                Net: {
                    name: 'Net',
                    points: {}
                }
            };
            DB.balances.toArray().then(balances => {
                balances.forEach(balance => {
                    if (balance.account.excludenetworth) return;

                    if (series[balance.accounttype.name] == null) {
                        series[balance.accounttype.name] = {
                            name: balance.accounttype.name,
                            points: {}
                        };
                    }
                    if (series[balance.accounttype.name].points[balance.date] == null) {
                        series[balance.accounttype.name].points[balance.date] = 0;
                    }
                    if (series.Net.points[balance.date] == null) {
                        series.Net.points[balance.date] = 0;
                    }
                    series[balance.accounttype.name].points[balance.date] += balance.amount;
                    series.Net.points[balance.date] += (balance.accounttype.asset ? 1 : -1) * balance.amount;
                });

                let seriesArray = [];
                let seriesColors = {
                    Net: 'blue',
                    Asset: 'green',
                    'Credit Card': 'red',
                    Loan: 'yellow'
                };
                for (var accountType in series) {
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
                    defaultPoint_tooltip: function (point) {
                        return '<strong>' + moment(point.options("x")).format("MM/DD/YYYY") + '</strong><br/>' + point.series.name + '<br/>' + Utils.CurrencyFormatter.format(point.options("y"));
                    },
                    yAxis_formatString: 'c',
                });
            });
        }
    },
    SpendTree: {
        Draw: function () {
            let series = {
                Income: {},
                Expenses: {},
                Transfers: {}
            };
            let paritySeries = {
                1: 'Income',
                0: 'Transfers',
                '-1': 'Expenses'
            };
            DB.transactions.where('monthyear').equals(new moment().format('MMYYYY')).toArray().then(trans => {
                trans.forEach(tran => {
                    if (series[paritySeries[tran.category.parity]][tran.category.name] == null) {
                        series[paritySeries[tran.category.parity]][tran.category.name] = {
                            name: tran.category.name,
                            amount: 0
                        };
                    }
                    series[paritySeries[tran.category.parity]][tran.category.name].amount += tran.amount;
                });

                let seriesArray = [];
                for (var seriesName in series) {
                    let seriesPoints = [];
                    for (var categoryName in series[seriesName]) {
                        seriesPoints.push({
                            name: categoryName,
                            y: series[seriesName][categoryName].amount
                        });
                    }
                    seriesArray.push({
                        name: seriesName,
                        points: seriesPoints
                    });
                }
                var chart = JSC.chart('spendtree', {
                    debug: true,
                    type: 'treemapCushion',
                    title_label_text: 'Amount by Category for ' + new moment().format('MMMM'),
                    series: seriesArray,
                    yAxis_formatString: 'c',
                });
            });
        }
    }
};