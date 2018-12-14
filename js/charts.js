var Charts = {
    Balances: {
        selector: '#balancechart',
        labels: [],
        allseries: {},
        options: {
            lineSmooth: Chartist.Interpolation.monotoneCubic({
                fillHoles: true,
            }),
            plugins: [
                Chartist.plugins.tooltip({anchorToPoint: true, currency: '$'})
            ]
        },
        Draw: function () {
            BalanceData.GetData().then(function (balances) {
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
                                name: DataReference.AccountTypeNamesByID[accountTypeId],
                                data: balances.byaccounttype[accountTypeId]
                            });
                }
                for (var i in Object.keys(balances.byaccount)) {
                    var accountId = Object.keys(balances.byaccount)[i];
                    if ($('#balancechart_accountlist input#bca' + accountId).prop('checked') == false)
                        continue;
                    series.push(
                            {
                                name: DataReference.AccountNamesByID[accountId],
                                data: balances.byaccount[accountId]
                            });
                }
                new Chartist.Line(Charts.Balances.selector, {labels: Charts.Balances.labels, series: series}, Charts.Balances.options);
            });
        }
    }
};