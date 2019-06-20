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
                    yAxis_formatString: 'c',
                  });
            });
            return;


            DB.balances.toArray().then(function (balances) {
                var series = [];
                if ($('#balancechart_accountlist input#bcnet').prop('checked')) {
                    series.push({
                        name: 'Net',
                        data: balances.net
                    });
                }
                for (var i in Object.keys(balances.byaccounttype)) {
                    var accountTypeId = Object.keys(balances.byaccounttype)[i];
                    if ($('#balancechart_accountlist input#bcat' + accountTypeId).prop('checked') == false)
                        continue;
                    series.push(
                            {
                                name: DataReference.AccountTypeNamesById[accountTypeId],
                                data: balances.byaccounttype[accountTypeId]
                            });
                }
                for (var i in Object.keys(balances.byaccount)) {
                    var accountId = Object.keys(balances.byaccount)[i];
                    if ($('#balancechart_accountlist input#bca' + accountId).prop('checked') == false)
                        continue;
                    series.push(
                            {
                                name: DataReference.AccountNamesById[accountId],
                                data: balances.byaccount[accountId]
                            });
                }
                new Chartist.Line(Charts.Balances.selector, {labels: Charts.Balances.labels, series: series}, Charts.Balances.options);
            });
        }
    }
};