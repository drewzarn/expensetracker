if ('serviceWorker' in navigator) {
    if (!navigator.serviceWorker.controller) {
        navigator.serviceWorker.register('/worker.js').then(function (registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function (err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    }
}

const channel = new BroadcastChannel('sw-messages');
channel.addEventListener('message', event => {
    if (event.data.loaded) {
        DB[event.data.loaded].count().then(c => {
            updateCardStats(event.data.loaded, c, event.data.fetch != null);
        });
        DataUI[event.data.loaded].Render(event.data.fetch == null);
        switch (event.data.loaded) {
            case 'accounttypes':
                LoadData('accounts');
                break;
                case 'accounts':
                    LoadData('balances');
                    break;
        }
    }
    if (event.data.fetch) {
        fetch(event.data.fetch);
    }
});

function updateCardStats(item, count, stillLoading) {
    var itemName = item == 'accounttypes' ? 'Account Types' : item[0].toUpperCase() + item.substring(1);
    $('#card_datastats').find('li[data-ref=' + item + '] span').html(count + ' ' + itemName + '<br />' + moment().calendar());
    if (!stillLoading) {
        $('#card_datastats').find('li[data-ref=' + item + '] i').removeClass('fa-spin');
    }
}

function LoadData(item) {
    if ($('#card_datastats li[data-ref=' + item + '] i').hasClass('fa-spin')) return;
    console.log("LoadData -> " + item);
    $('#card_datastats li[data-ref=' + item + '] i').addClass('fa-spin');
    fetch(item + '/list');
}


var CATEGORIES = [],
    IDIDS = {},
    PAYEES = [],
    PAY_IDS = {};
var NOW = new Date();

$(document).ready(async function () {
    if (navigator.serviceWorker.controller == null) {
        location.reload();
    }
    if (!$('body').hasClass('login')) {
        DB.metadata.each(meta => {
                updateCardStats(meta.table, meta.count);
            })
            .then(() => {
                DataUI.categories.Render();
                DataUI.payees.Render();
                DataUI.transactions.Render();
                DataUI.accounttypes.Render();
            });
    }

    Utils.GeoLocation.Init();

    /*DBClass.DB.on('changes', function (changes) {
        var changedObjects = [];
        console.log('Changes fired for ' + changes.length + ' items');
        changes.forEach(function (change) {
            if(changedObjects.indexOf(change.table) < 0) {
                changedObjects.push(change.table);
            }
        });
        console.log(changedObjects);
        changedObjects.forEach(function(changeObject){
            DataUI[changeObject]();
        });
    });
    DBClass.DB.open().catch(function (e) {
        console.error("Open failed: " + e.stack);
    });*/

    $('div.modal').on('hidden.bs.modal', ModalHandler.Hidden.default);
    $('#modal_editaccount').on('shown.bs.modal', ModalHandler.Shown.editaccount);
    $('#modal_editcategory').on('shown.bs.modal', ModalHandler.Shown.editcategory);
    $('#modal_editpayee').on('shown.bs.modal', ModalHandler.Shown.editpayee);
    $('#modal_addtransaction').on('shown.bs.modal', ModalHandler.Shown.addtransaction);
    $('#modal_edittransaction').on('shown.bs.modal', ModalHandler.Shown.edittransaction);

    $('#mainnav ul .nav-link').click(function () {
        var $this = $(this);
        $('.nav-link').removeClass('border-bottom border-success');
        $this.addClass('border-bottom border-success');
        var content = $this.attr('href').substring(1);
        $('div[id^="content-"]').hide();
        $('div[id^="content-' + content + '"]').show();
    });
    if (location.hash != '') {
        $('.nav-link[href="' + location.hash + '"]').click();
    } else {
        $('.nav-link[href="#dashboard"]').click();
    }
    Utils.InitDateInputs();
    StepperTable.Init();
    TransactionListTable.Init();

    $('a#logout:contains("Sandbox")').closest('body').addClass('sandbox');

    $('form').each(function () {
        if (this.id == "frm_login") {
            return;
        }
        $(this).validate({
            submitHandler: formAjaxSubmit,
            showErrors: Utils.ShowValidationErrors
        });
    });
    $('body').on('click', 'i.fa-chevron-down, i.fa-chevron-up', function () {
        var $this = $(this);
        if ($this.hasClass('fa-chevron-down')) {
            $this.nextAll('div').show();
            $this.removeClass('fa-chevron-down').addClass('fa-chevron-up');
        } else {
            $this.nextAll('div').hide();
            $this.removeClass('fa-chevron-up').addClass('fa-chevron-down');
        }
    });

    Utils.TransactionSplit.Init();

    $('input[type=button][data-action=delete]').click(function () {
        var $this = $(this);
        $('input[name="__delete__"]').remove();
        if (confirm('Are you sure you want to delete this item?')) {
            $this.closest('form').append('<input type="hidden" value="1" name="__delete__" />');
            formAjaxSubmit($this.closest('form')[0]);
        }
    });

    $('#card_datastats i').click(function () {
        if ($(this).hasClass('fa-spin')) return;
        LoadData($(this).parent().data('ref'));
    });

    $('#balancetable').on('dblclick', 'td.entry', function () {
        var $td = $(this);
        $('#editbalance_id').val($td.data('balanceid'));
        $('#editbalance_account').val($td.parent().data('accountid'));
        $('#editbalance_date').datepicker('update', moment($td.data('entrydate')).format('M/D/YYYY'));
        $('#editbalance_amount').val($td.data('amount'));
        $('#modal_editbalance').modal();
    });

    Charts.Balances.options.height = ($(window).height() - $('#balancechart').offset().top) + 'px';
    Charts.Balances.options.width = ($(window).width() / 6 * 5 - 40) + 'px';
    $('#balancechart_accountlist').on('change', 'input', Charts.Balances.Draw);

    if (!$('body').hasClass('login')) {
        setTimeout(function () {
            LoadData("categories");
            LoadData("payees");
            LoadData("transactions");
            LoadData("accounttypes");
        }, 5000);
    }
});

var DataUI = {
    Rendering: function () {
        let components = Object.keys(DataUI);
        for (var c = 0; c < components.length; c++) {
            var component = components[c];
            if (typeof DataUI[component] == "object" && DataUI[component].rendering)
                return true;
        }
        return false;
    },
    accounts: {
        rendering: false,
        Render: function (finalData) {
            DataUI.accounts.rendering = true;
            console.log("DataUI.accounts rendering");
            $('#accountlist div ul').empty();
            $('#addbalance_accountlist div').empty();
            $('#editbalance_account optgroup').empty();
            $('#balancetable tbody tr[data-accountid]').remove();
            $('#balancechart_accountlist div.col div label').remove();
            DB.accounts.orderBy('name').each(function (v) {
                $('#accountlist div[data-accounttypeid=' + v.type_id + '] ul').append('<li data-accountid="' + v.id + '" data-accountexcludenetworth="' + v.excludenetworth + '" data-accountactive="' + v.active + '"><span>' + v.name + '</span><a href="#" class="fas fa-pencil-alt ml-2 text-dark light" data-toggle="modal" data-target="#modal_editaccount"></a></li>');
                if (v.active == '1') {
                    $('#addbalance_accountlist_' + v.type_id).append('<div class="form-group"><input class="form-control" type="number" step="0.01" name="addbalance_account' + v.id + '" id="addbalance_account' + v.id + '" placeholder="' + v.name + '" /></div>')
                }
                $('#balancetable tbody[data-accounttypeid=' + v.type_id + ']').append('<tr data-accountid="' + v.id + '" data-accountexcludenetworth="' + v.excludenetworth + '"><td>' + v.name + '</td></tr>');
                $('#editbalance_account optgroup[data-accounttypeid=' + v.type_id + ']').append('<option value="' + v.id + '">' + v.name + '</option>');
                $('#balancechart_accountlist div.col[data-accounttypeid=' + v.type_id + '] div').append('<label class="d-block" for="bca' + v.id + '"><input type="checkbox" data-accountid="' + v.id + '" id="bca' + v.id + '"> ' + v.name + '</label></div>');
            });
            DB.accounts.count().then(c => {
                updateCardStats('accounts', c);
            });
            DataUI.accounts.rendering = false;
            DataUI.balances.Render();
        }
    },
    accounttypes: {
        rendering: false,
        Render: function (finalData) {
            DataUI.accounttypes.rendering = true;
            console.log("DataUI.accounttypes rendering");
            DataReference.AccountTypeNames = [];
            DataReference.AccountTypeNamesById = {};
            $('#addaccount_type').empty();
            $('#accountlist div.row').empty();
            $('#addbalance_accountlist').empty();
            $('#editbalance_account').empty();
            $('#balancetable tbody').remove();
            $('#balancechart_accountlist div.col').remove();
            DB.accounttypes.orderBy('name').each(function (v) {
                DataReference.AccountTypeNames.push(v.name);
                DataReference.AccountTypeNamesById[v.id] = v.name;
                $('#addaccount_type').append('<option value="' + v.id + '">' + v.name + '</option>')
                $('#accountlist div.row').append('<div class="col" data-accounttypeid="' + v.id + '"><h5>' + v.name + ' Accounts</h5><ul></ul></div>');
                $('#addbalance_accountlist').append('<h6>' + v.name + '</h6>');
                $('#addbalance_accountlist').append('<div id="addbalance_accountlist_' + v.id + '"></div>');
                $('#balancetable tfoot').before('<tbody data-accounttypeid="' + v.id + '" data-accounttypeasset="' + v.asset + '"><tr class="table-secondary"><th>' + v.name + '</th></tr></tbody>');
                $('#editbalance_account').append('<optgroup data-accounttypeid="' + v.id + '" label="' + v.name + '" />');
                $('#balancechart_accountlist').append('<div class="col px-0" data-accounttypeid="' + v.id + '"><i class="fas fa-chevron-down float-right mt-2 pointer"></i><h5><input type="checkbox" data-accounttypeid="' + v.id + '" id="bcat' + v.id + '" checked /> <label for="bcat' + v.id + '">' + v.name + '</label></h5><div class="collapse"></div></div>');
            });
            DB.accounttypes.count().then(c => {
                updateCardStats('accounttypes', c);
            });
            DataUI.accounttypes.rendering = false;
            DataUI.accounts.Render();
        }
    },
    balances: {
        rendering: false,
        Render: function (finalData) {
            DataUI.balances.rendering = true;
            console.log("DataUI.balances rendering");
            $('#balancetable th.balancedate, #balancetable th[data-balancedate], #balancetable td.entry, #balancetable tr#netbalance').remove();
            $('#balancetable tfoot').append('<tr id="netbalance" class="table-secondary"><th>Net</th></tr>');
            var entriesByDate = {};
            DB.balances.each(function (v) {
                    v.date = v.date.substring(0, 10);
                    if (entriesByDate[v.date] == null) {
                        entriesByDate[v.date] = new Array();
                    }
                    entriesByDate[v.date].push(v);
                })
                .then(() => {
                    Charts.Balances.labels = Object.keys(entriesByDate).sort();
                    Charts.Balances.allseries = {};
                    var dates = Object.keys(entriesByDate).sort().reverse();
                    for (var date in dates) {
                        var entryDate = dates[date];
                        $('#balancetable thead tr').append('<th class="balancedate">' + entryDate + '</th>');
                        $('#balancetable tbody tr:first-of-type').append('<th data-balancedate="' + entryDate + '"></th>');
                        for (var key in entriesByDate[entryDate]) {
                            var entry = entriesByDate[entryDate][key];
                            if ($('#balancetable tr[data-accountid=' + entry.account_id + '] td.entry[data-entrydate=' + entryDate + ']').addClass('bg-dark').addClass('text-white').addClass('dupebalance').length > 0) {
                                continue;
                            }
                            if (Charts.Balances.allseries[entry.account_id] == null)
                                Charts.Balances.allseries[entry.account_id] = new Array();
                            Charts.Balances.allseries[entry.account_id].push(entry.amount);
                            var td = $('<td class="entry" data-entrydate="' + entryDate + '" data-balanceid="' + entry.id + '" data-netgain="' + entry.netgain + '">' + entry.amount + '</td>');
                            td.data('amount', entry.amount);
                            $('#balancetable tr[data-accountid=' + entry.account_id + ']').append(td);
                        }

                        $('#balancetable tr[data-accountid').each(function (i, tr) {
                            var $tr = $(tr);
                            if ($tr.find('td.entry[data-entrydate=' + entryDate + ']').length == 0) {
                                var td = $('<td class="entry empty" data-entrydate="' + entryDate + '">-</td>');
                                td.data('amount', 0);
                                $tr.append(td);
                            }
                        });
                    }

                    for (var i in Object.keys(Charts.Balances.allseries)) {
                        var accountId = Object.keys(Charts.Balances.allseries)[i];
                        Charts.Balances.allseries[accountId].reverse();
                    }

                    //Add color-coding to entry cells
                    $('#balancetable td.entry').each(function (i, el) {
                        var $el = $(el);
                        if ($el.text() != '-') {
                            if ($el.data('netgain') == '0') {
                                $el.addClass('table-warning');
                            } else if ($el.data('netgain') == '1') {
                                $el.addClass('table-success');
                            } else if ($el.data('netgain') == '-1') {
                                $el.addClass('table-danger');
                            }

                            $el.text(Utils.CurrencyFormatter.format($el.text()));
                        }
                    });
                    $('#balancetable tr[data-accountid] td:last-of-type').removeClass('table-danger').removeClass('table-warning').removeClass('table-success');
                    //Calculate account type sums
                    $('#balancetable tbody').each(function (bi, tbodyEl) {
                        var $tbodyEl = $(tbodyEl);
                        $('#balancetable thead th').each(function (hi, thEl) {
                            var $thEl = $(thEl);
                            if ($thEl.text().trim() == '')
                                return;
                            var sum = 0;
                            $tbodyEl.find('td[data-entrydate=' + $thEl.text() + ']').each(function (di, tdEl) {
                                var $tdEl = $(tdEl);
                                if ($tdEl.parent().data('accountexcludenetworth') != "1") {
                                    sum += ($tdEl.data('amount'));
                                }
                            });
                            $tbodyEl.find('th[data-balancedate=' + $thEl.text() + ']').text(sum).data('amount', sum);
                        });
                    });
                    //Add color-coding to sum cells
                    $('#balancetable th[data-balancedate]').each(function (i, el) {
                        var $el = $(el);
                        var isAsset = $el.closest('tbody').data('accounttypeasset') == "1";
                        if (($el.data('amount')) == ($el.next().data('amount'))) {
                            $el.addClass('text-warning');
                        } else if (($el.data('amount')) > ($el.next().data('amount'))) {
                            $el.addClass(isAsset ? 'text-success' : 'text-danger');
                        } else if (($el.data('amount')) < ($el.next().data('amount'))) {
                            $el.addClass(isAsset ? 'text-danger' : 'text-success');
                        }
                        $el.text(Utils.CurrencyFormatter.format($el.text()));
                    });
                    //Set net sum text
                    $('#balancetable thead th.balancedate').each(function (i, el) {
                        var $el = $(el);
                        var netSum = 0;
                        $('#balancetable').find('th[data-balancedate=' + $el.text() + ']').each(function (typeI, typeEl) {
                            var $typeEl = $(typeEl);
                            if ($typeEl.parent().parent().data('accounttypeasset') == '1') {
                                netSum += $typeEl.data('amount');
                            } else {
                                netSum -= $typeEl.data('amount');
                            }
                        });
                        $('#netbalance').append('<th data-amount="' + netSum + '">' + netSum + '</th>');
                    });
                    //Color-code net balance row
                    $('#netbalance th[data-amount]').each(function (i, el) {
                        var $el = $(el);
                        if (($el.data('amount')) == ($el.next().data('amount'))) {
                            $el.addClass('text-warning');
                        } else if (($el.data('amount')) > ($el.next().data('amount'))) {
                            $el.addClass('text-success');
                        } else if (($el.data('amount')) < ($el.next().data('amount'))) {
                            $el.addClass('text-danger');
                        }
                        $el.text(Utils.CurrencyFormatter.format($el.text()));
                    });
                    Charts.Balances.Draw();
                });
            DB.balances.count().then(c => {
                updateCardStats('balances', c);
            });
            DataUI.balances.rendering = false;
        }
    },
    categories: {
        rendering: false,
        Render: function (finalData) {
            DataUI.categories.rendering = true;
            console.log("DataUI.categories rendering");
            var date = new Date();

            $('#categorylist tbody').empty();
            DB.categories.orderBy('name').each(function (v) {
                if (v.deleted != '1') {
                    DataReference.CategoryNames.push(v.name);
                    DataReference.CategoryNamesById[v.id] = v.name;
                }
                $('#categorylist tbody').append('<tr><td><a href="#" class="fas fa-edit text-dark light mr-2" data-toggle="modal" data-target="#modal_editcategory" data-categoryid="' + v.id + '" />' + v.name + '</td><td><i class="fas fa-' + DataReference.ParityIcons[v.parity] + '" /></td><td>' + (v.deleted == '1' ? '<i class="fas fa-ban" />' : '') + '</td></tr>');
                $('#categorylist tbody').find('a[data-categoryid=' + v.id + ']').data('details', v);
            });
            DataReference.CategoryNames.sort();
            $("#addtransaction_category").typeahead({
                source: DataReference.CategoryNames
            });
            $("#edittransaction_category").typeahead({
                source: DataReference.CategoryNames
            });
            $('#catlist').empty();
            $.each(DataReference.CategoryNames, function (i, v) {
                $('#catlist').append('<button class="btn-sm">' + v + '</button>');
            });
            DB.categories.count().then(c => {
                updateCardStats('categories', c);
            });
            DataUI.categories.rendering = false;
        }
    },
    payees: {
        rendering: false,
        Render: function (finalData) {
            DataUI.payees.rendering = false;
            console.log("DataUI.payees rendering");
            var date = new Date();

            $('#payeelist tbody').empty();
            DataReference.PayeeNames = [];
            DataReference.PayeeNamesById = {}
            DB.payees.orderBy('name').each(function (v) {
                if (v.deleted != '1') {
                    DataReference.PayeeNames.push(v.name);
                    DataReference.PayeeNamesById[v.id] = v.name;
                }

                $('#payeelist tbody').append('<tr><td><a href="#" class="fas fa-edit text-dark light mr-2" data-toggle="modal" data-target="#modal_editpayee" data-payeeid="' + v.id + '" />' + v.name + '</td><td>' + (v.deleted == '1' ? '<i class="fas fa-ban" />' : '') + '</td></tr>');
                $('#payeelist tbody').find('a[data-payeeid=' + v.id + ']').data('details', v);
            });

            DataReference.PayeeNames.sort();
            $("#addtransaction_payee").typeahead({
                source: DataReference.PayeeNames,
                afterSelect: showTransactionsByPayee
            });
            $("#edittransaction_payee").typeahead({
                source: DataReference.PayeeNames,
                afterSelect: showTransactionsByPayee
            });
            DB.payees.count().then(c => {
                updateCardStats('payees', c);
            });
            DataUI.payees.rendering = false;
        }
    },
    transactions: {
        rendering: false,
        Render: function (finalData) {
            DataUI.transactions.rendering = true;
            console.log("DataUI.transactions rendering");
            var dateLimits = {
                max: moment(),
                min: moment()
            };

            DataReference.NetByPeriod = {};
            DataReference.SpendingByCategory = {};
            DataReference.SpendingByPayee = {};
            let transactionListForTable = [];
            DB.transactions.orderBy('date').each(function (v) {
                    var mDate = moment(v.date);
                    if (mDate < dateLimits.min)
                        dateLimits.min = mDate;
                    if (mDate > dateLimits.max)
                        dateLimits.max = mDate;

                    v.date = mDate.format('YYYYMMDD');
                    v.year = mDate.year();
                    v.month = mDate.month() + 1;
                    v.day = mDate.date();
                    v.weekday = mDate.format('dddd');
                    v.monthyear = v.month.toString() + v.year.toString();

                    transactionListForTable.push(v);

                    if (DataReference.NetByPeriod[mDate.year()] == null)
                        DataReference.NetByPeriod[mDate.year()] = {
                            Income: 0,
                            Expenses: 0
                        };
                    if (DataReference.NetByPeriod[mDate.year()][mDate.month()] == null)
                        DataReference.NetByPeriod[mDate.year()][mDate.month()] = {
                            Income: 0,
                            Expenses: 0
                        };
                    if (DataReference.SpendingByCategory[mDate.year()] == null)
                        DataReference.SpendingByCategory[mDate.year()] = {};
                    if (DataReference.SpendingByCategory[mDate.year()][v.category.name] == null)
                        DataReference.SpendingByCategory[mDate.year()][v.category.name] = 0;
                    if (DataReference.SpendingByCategory[mDate.year()][mDate.month()] == null)
                        DataReference.SpendingByCategory[mDate.year()][mDate.month()] = {};
                    if (DataReference.SpendingByCategory[mDate.year()][mDate.month()][v.category.name] == null)
                        DataReference.SpendingByCategory[mDate.year()][mDate.month()][v.category.name] = 0;
                    if (DataReference.SpendingByPayee[mDate.year()] == null)
                        DataReference.SpendingByPayee[mDate.year()] = {};
                    if (DataReference.SpendingByPayee[mDate.year()][v.payee.name] == null)
                        DataReference.SpendingByPayee[mDate.year()][v.payee.name] = 0;
                    if (DataReference.SpendingByPayee[mDate.year()][mDate.month()] == null)
                        DataReference.SpendingByPayee[mDate.year()][mDate.month()] = {};
                    if (DataReference.SpendingByPayee[mDate.year()][mDate.month()][v.payee.name] == null)
                        DataReference.SpendingByPayee[mDate.year()][mDate.month()][v.payee.name] = 0;

                    DataReference.NetByPeriod[mDate.year()][DataReference.ParityNames[v.category.parity]] += (v.amount);
                    DataReference.NetByPeriod[mDate.year()][mDate.month()][DataReference.ParityNames[v.category.parity]] += (v.amount);
                    DataReference.NetByPeriod[mDate.year()].Net = DataReference.NetByPeriod[mDate.year()].Income - DataReference.NetByPeriod[mDate.year()].Expenses;
                    DataReference.NetByPeriod[mDate.year()][mDate.month()].Net = DataReference.NetByPeriod[mDate.year()][mDate.month()].Income - DataReference.NetByPeriod[mDate.year()][mDate.month()].Expenses;
                    DataReference.SpendingByCategory[mDate.year()][v.category.name] += (v.amount);
                    DataReference.SpendingByCategory[mDate.year()][mDate.month()][v.category.name] += (v.amount);
                    DataReference.SpendingByPayee[mDate.year()][v.payee.name] += (v.amount);
                    DataReference.SpendingByPayee[mDate.year()][mDate.month()][v.payee.name] += (v.amount);
                })
                .then(() => {
                    $('#trnlistdatestart').datepicker('update', moment().startOf('month').format('M/D/YYYY')).on('changeDate', TransactionListTable.Draw);
                    $('#trnlistdateend').datepicker('update', dateLimits.max.format('M/D/YYYY')).on('changeDate', TransactionListTable.Draw);

                    TransactionListTable.TableRef.clear().rows.add(transactionListForTable).draw();
                    TransactionListTable.Filters.Category = [];
                    TransactionListTable.Filters.Payee = [];

                    StepperTable.RefreshAll();
                });

            DB.transactions.count().then(c => {
                updateCardStats('transactions', c, !finalData);
            });
            DataUI.transactions.rendering = false;
        }
    }
};

var DataReference = {
    AccountNames: [],
    AccountNamesById: {},
    AccountTypeNames: [],
    AccountTypeNamesById: {},
    CategoryNames: [],
    CategoryNamesById: {},
    PayeeNames: [],
    PayeeNamesById: {},
    SpendingByCategory: {},
    SpendingByPayee: {},
    NetByPeriod: {},
    NetNames: ['Income', 'Expenses', 'Net'],
    ParityIcons: {
        '1': 'plus',
        '0': 'exchange-alt',
        '-1': 'minus'
    },
    ParityNames: {
        '1': 'Income',
        '0': 'Transfers',
        '-1': 'Expenses'
    }
}

var ModalHandler = {
    Hidden: {
        default: function (e) {
            Utils.HideFormMessage($(e.target).find('div.formmsg'));
        }
    },
    Shown: {
        addtransaction: function (e) {
            $('#addtransaction_payee').focus();
            $('#addtransaction_date').datepicker('update', new Date().toLocaleDateString());
            Utils.TransactionSplit.Reset();
            $('#addtransaction_allowdupe').prop('checked', false).parent().addClass('d-none');
        },
        editaccount: function (e) {
            $('#editaccount_name').val($(e.relatedTarget).prev().text());
            $('#editaccount_excludenetworth').prop('checked', $(e.relatedTarget).parent().data('accountexcludenetworth') == "1");
            $('#editaccount_active').prop('checked', $(e.relatedTarget).parent().data('accountactive') == "1");
            $('#editaccount_id').val($(e.relatedTarget).parent().data('accountid'));
        },
        editcategory: function (e) {
            $('#editcategory_id').val($(e.relatedTarget).data('categoryid'));
            var details = $(e.relatedTarget).data('details');
            $('#editcategory_name').val(details.name);
            $('#editcategory_parity').val(details.parity);
            $('#editcategory_deleted').prop('checked', details.deleted == "1");
        },
        editpayee: function (e) {
            $('#editpayee_id').val($(e.relatedTarget).data('payeeid'));
            var details = $(e.relatedTarget).data('details');
            $('#editpayee_name').val(details.name);
            $('#editpayee_deleted').prop('checked', details.deleted == "1");
        },
        edittransaction: function (e) {
            $('#edittransaction_id').val($(e.relatedTarget).data('transactionid'));
            var trnDetails = TransactionListTable.TableRef.row($(e.relatedTarget).parent().parent()[0]).data();
            $('#edittransaction_payee').val(DataReference.PayeeNamesById[trnDetails.payee_id]);
            $('#edittransaction_category').val(DataReference.CategoryNamesById[trnDetails.category_id]);
            $('#edittransaction_amount').val(trnDetails.amount);
            $('#edittransaction_date').datepicker('update', moment(trnDetails.date).format('M/D/YYYY'));
            $('#edittransaction_description').val(trnDetails.description);
            showTransactionsByPayee(DataReference.PayeeNamesById[trnDetails.payee_id]);
        }
    }
}

var DataHandler = {
    Loading: {
        Account: function (e) {
            $('#card_datastats').find('li[data-ref=account] i').addClass('fa-spin');
        },
        AccountType: function (e) {
            $('#card_datastats').find('li[data-ref=accounttype] i').addClass('fa-spin');
        },
        Balance: function (e) {
            $('#card_datastats').find('li[data-ref=balance] i').addClass('fa-spin');
        },
        Category: function (e) {
            $('#card_datastats').find('li[data-ref=category] i').addClass('fa-spin');
        },
        Payee: function (e) {
            $('#card_datastats').find('li[data-ref=payee] i').addClass('fa-spin');
        },
        Transaction: function (e) {
            $('#card_datastats').find('li[data-ref=transaction] i').addClass('fa-spin');
        }
    },
    Loaded: {
        Account: async function (e, data) {},
        AccountType: function (e, data) {

        },
        Balance: function (e, data) {

        },
        Category: async function (e, data) {},
        Payee: async function (e, data) {},
        Transaction: async function (e, data) {

        }
    }
}

var Utils = {
    GeoLocation: {
        Coordinates: {
            latitude: null,
            longitude: null
        },
        Init: function () {
            navigator.geolocation.getCurrentPosition(Utils.GeoLocation.Received);
            navigator.geolocation.watchPosition(Utils.GeoLocation.Received);
        },
        Received: function (position) {
            Utils.GeoLocation.Coordinates.latitude = position.coords.latitude;
            Utils.GeoLocation.Coordinates.longitude = position.coords.longitude;

            $('#status_location').removeClass('text-light');
        }
    },
    TransactionSplit: {
        Count: 0,
        Init: function () {
            $('#splittransaction').click(Utils.TransactionSplit.Add);
            $('#unsplittransaction').click(Utils.TransactionSplit.Remove);
            $('#frm_addtransaction').on('change', 'div.splitwrapper input[name^=addtransaction_amount]', Utils.TransactionSplit.Update);
        },
        Add: function () {
            var splitNumber = ++Utils.TransactionSplit.Count;
            var newSplit = $('#frm_addtransaction div.splitwrapper:first').clone();
            newSplit.find('input').each(function (i, el) {
                var $el = $(el);
                $el.attr('id', $el.attr('id') + '_' + splitNumber);
                $el.attr('name', $el.attr('name') + '_' + splitNumber);
                $el.val('');
            });
            $('input[name^=addtransaction_category]').each(function (i, el) {
                $(el).typeahead({
                    source: DataReference.CategoryNames
                });
            });
            newSplit.insertAfter('#frm_addtransaction div.splitwrapper:last');
            newSplit.find('input:first').focus();
        },
        Remove: function () {
            $('div.splitwrapper:last').remove();
            Utils.TransactionSplit.Update();
        },
        Reset: function () {
            Utils.TransactionSplit.Count = 0;
            var newSplit = $('#frm_addtransaction div.splitwrapper:first').clone();
            $('#frm_addtransaction div.splitwrapper').remove();
            newSplit.find('input').val('');
            newSplit.insertAfter('#frm_addtransaction div.form-group:first');
            $('#splittotal').text('Total: $0.00');
            $('input[name^=addtransaction_category]').typeahead({
                source: DataReference.CategoryNames
            });
        },
        Update: function () {
            var total = 0;
            $('#frm_addtransaction div.splitwrapper input[name^=addtransaction_amount]').each(function (i, el) {
                if ($(el).val() == '')
                    return;
                total += parseFloat($(el).val());
            });
            $('#splittotal').text('Total: ' + Utils.CurrencyFormatter.format(total));
            $('#unsplittransaction').addClass('d-none');
            if ($('div.splitwrapper').length > 1) {
                $('#unsplittransaction').removeClass('d-none');
            }
        }
    },
    CurrencyFormatter: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }),
    InitDateInputs: function () {
        $('input[data-type=date]').datepicker({
            todayHighlight: true,
            format: "m/d/yyyy"
        });
        $('input[data-type=date]').datepicker('update', new Date().toLocaleDateString());
    },
    HideFormMessage: function ($el) {
        $el.addClass('invisible').removeClass('border-danger text-danger border-success text-success');
    },
    ShowFormError: function ($el, text) {
        $el.addClass('border-danger text-danger').removeClass('border-success text-success invisible').text(text);
    },
    ShowFormMessage: function ($el, text) {
        $el.addClass('border-success text-success').removeClass('border-danger text-danger invisible').text(text);
    },
    ShowValidationErrors: function (errorMap, errorList) {
        if (errorList[0] == null)
            return;
        Utils.ShowFormError($(errorList[0].element).closest('form').find('div.formmsg'), 'You seem to be missing some data...');
    },
    SortBeans: function (beans, sortBy = 'name') {
        var sorted = [];
        for (var bean in beans) {
            sorted.push(beans[bean]);
        }
        sorted.sort(function (a, b) {
            return a[sortBy].toLowerCase().localeCompare(b[sortBy].toLowerCase())
        });
        return sorted;
    },
    TransactionListRender: {
        Amount: function (data, type, row) {
            if (type === 'display') {
                var icon = '<i class="light float-right fas fa-' + DataReference.ParityIcons[row.category.parity] + '"></i> ';
                if (row.grouptotal == null) {
                    return icon + Utils.CurrencyFormatter.format(data);
                } else {
                    return icon + Utils.CurrencyFormatter.format(data) + ' of ' + Utils.CurrencyFormatter.format(row.grouptotal) + '';
                }
            }
            return data;
        },
        Date: function (data, type, row) {
            if (type === 'display') {
                var date = moment(data).format('M/D/YY');
                return '<a href="#" class="fas fa-edit text-dark mr-2 light" data-toggle="modal" data-target="#modal_edittransaction" data-transactionid="' + row.id + '"></a>' + date;
            }
            return data;
        },
        Description: function (data, type, row) {
            if (type === 'display') {
                if (data != '' && data != null) {
                    return data.length > 15 ? data.substring(0, 12) + '... <i class="fas fa-search-plus" title="' + data + '"></i>' : data;
                }
            }
            return data;
        }
    }
}

var StepperTable = {
    Init: function () {
        $('table.stepper').each(function (i, table) {
            var $table = $(table);

            var prevMonth = true;
            $.each($table.find('th[data-year]'), function (i, el) {
                var $el = $(el);
                var mDate = moment();
                $el.data('year', mDate.year());
                if ($el.data('month') != null) {
                    mDate.subtract(prevMonth ? 1 : 0, 'months');
                    $el.data('month', mDate.month());
                    $el.data('year', mDate.year());
                    prevMonth = false;
                }
            });

            $table.on('click', 'th i.fas', StepperTable.Step);

            if ($table.data('filtertable') != null) {
                $table.on('click', 'tbody tr', function () {
                    var $parentTable = $(this).closest('table');
                    StepperTable.SelectRow($(this), $parentTable.data('filtertable'), $parentTable.data('filterproperty'), $parentTable.data('filtercounter'));
                });
            }
        });
        $('table.stepper').DataTable({
            ordering: false,
            paging: false,
            searching: false,
            info: false
        });
    },
    RefreshAll: function () {
        $('table.stepper').each(function (i, table) {
            StepperTable.Refresh($(table));
        });
    },
    Refresh: function ($table) {
        var periods = [];
        $.each($table.find('th[data-year]'), function (i, el) {
            var $el = $(el);
            var mDate = moment();
            mDate.year($el.data('year'));
            var period = {
                year: mDate.year()
            };
            $el.html("<span>" + mDate.format('YYYY') + "</span>");
            if ($el.data('month') != null) {
                mDate.month($el.data('month'));
                period.month = mDate.month();
                $el.html("<span>" + mDate.format('MMM YYYY') + "</span>");
            }
            periods.push(period);
        });
        $table.find('thead th i.fas').remove();
        $table.find('thead th:not(:empty)').append('<i class="fas fa-chevron-left mr-2 pointer"></i><i class="fas fa-chevron-right ml-2 pointer"></i>');

        var dataSource = DataReference[$table.data('source')];
        var rowSource = DataReference[$table.data('rows')];

        var $tbody = $table.find('tbody');
        $tbody.empty();
        $.each(rowSource, function (ri, rv) {
            $row = $('<tr><th>' + rv + '</th></tr>');
            $.each(periods, function (pi, pv) {
                if (pv.month == null) {
                    if (dataSource[pv.year] == null)
                        dataSource[pv.year] = {};
                    if (dataSource[pv.year][rv] == null)
                        dataSource[pv.year][rv] = 0;
                    $row.append('<td>' + Utils.CurrencyFormatter.format(dataSource[pv.year][rv]) + '</td>');
                } else {
                    if (dataSource[pv.year] == null)
                        dataSource[pv.year] = {};
                    if (dataSource[pv.year][pv.month] == null)
                        dataSource[pv.year][pv.month] = {};
                    if (dataSource[pv.year][pv.month][rv] == null)
                        dataSource[pv.year][pv.month][rv] = 0;
                    $row.append('<td>' + Utils.CurrencyFormatter.format(dataSource[pv.year][pv.month][rv]) + '</td>');
                }
            });
            $tbody.append($row);
        });
        $tbody.css('max-height', ($(window).height() - $tbody.offset().top - 30) + 'px');
        if ($table.data('filtertable') != null) {
            this.SelectRow(null, $table.data('filtertable'), $table.data('filterproperty'), $table.data('filtercounter'));
        }
    },
    SelectRow: function ($row, filterTable, filterProperty, filterCounter) {
        if ($row != null) {
            $row.toggleClass('table-success');
            var add = $row.hasClass('table-success');
            if (add) {
                window[filterTable].Filters[filterProperty].push($row.find('th:first').text());
            } else {
                window[filterTable].Filters[filterProperty].splice(TransactionListTable.Filters.Category.indexOf($row.find('th:first').text()), 1);
            }
        }
        $(filterCounter).text(window[filterTable].Filters[filterProperty].length == 0 ? 'all' : window[filterTable].Filters[filterProperty].length);
        window[filterTable].Draw();
    },
    Step: function () {
        var $this = $(this);
        var monthStep = $this.parent().data('month') != null;
        var mDate = moment();
        mDate.year($this.parent().data('year'));
        mDate.month($this.parent().data('month'));
        if ($this.hasClass('fa-chevron-left')) {
            mDate.subtract(1, monthStep ? 'months' : 'years');
        } else {
            mDate.add(1, monthStep ? 'months' : 'years');
        }
        $this.parent().data('year', mDate.year());
        if (monthStep) {
            $this.parent().data('month', mDate.month());
        }
        StepperTable.Refresh($this.closest('table'));
    }
}

var TransactionListTable = {
    TableRef: null,
    Filters: {
        Category: [],
        Payee: []
    },
    Init: function () {
        TransactionListTable.TableRef = $('#transactionlisttable').DataTable({
            scrollY: '65vh',
            scrollCollapse: true,
            paging: false,
            info: false,
            data: {
                date: '',
                payee: {
                    name: ''
                },
                category: {
                    name: ''
                },
                description: '',
                amount: ''
            },
            columns: [{
                    data: 'date',
                    render: Utils.TransactionListRender.Date
                },
                {
                    data: 'payee.name'
                },
                {
                    data: 'category.name'
                },
                {
                    data: 'description',
                    render: Utils.TransactionListRender.Description
                },
                {
                    data: 'amount',
                    render: Utils.TransactionListRender.Amount
                }
            ],
            order: [
                [0, "desc"]
            ]
        });
        $('#transactionlisttable_wrapper div.row:first div:first').append('<div class="input-daterange input-group ml-3"><input type="text" class="input-sm form-control" id="trnlistdatestart" /><span class="input-group-text">to</span><input type="text" class="form-control" id="trnlistdateend" /></div>');
        $('#trnlistdatestart').datepicker({
            format: "m/d/yyyy"
        });
        $('#trnlistdateend').datepicker({
            format: "m/d/yyyy"
        });
        $('#transactionlisttable').on('click', 'i.fa-edit', function () {
            loadTransactionToEdit($(this).data('transactionid'));
        });
    },
    Draw: function () {
        TransactionListTable.TableRef.draw();
    }
}

function formAjaxSubmit(form, event) {
    $form = $(form);
    Utils.HideFormMessage($form.find('div.formmsg'));
    var replacePrefix = form.id.replace('frm_', '') + '_';
    var data = {};

    if (form.id == "frm_addtransaction") {
        data.latitude = Utils.GeoLocation.Coordinates.latitude;
        data.longitude = Utils.GeoLocation.Coordinates.longitude;
    }

    $form.find('input').each(function (i, el) {
        if (el.type == 'submit' || el.type == 'button' || (el.name == '' && el.id == ''))
            return;
        switch (el.type) {
            case 'radio':
                data[el.name.replace(replacePrefix, '')] = $('input[name=' + el.name + ']:checked').val();
                break;
            case 'checkbox':
                data[el.name.replace(replacePrefix, '')] = $(el).prop('checked');
                break;
            default:
                data[el.id.replace(replacePrefix, '')] = $(el).val();
                break;
        }
    });
    $form.find('select').each(function (i, el) {
        data[el.id.replace(replacePrefix, '')] = $(el).val();
    });
    if ($form.find('input[name="__delete__"]').val() == "1") {
        data['DELETE'] = true;
    }


    var doneHandler = function (d) {
        Utils.ShowFormMessage($form.find('div.formmsg'), 'Complete');
        $form.find('input').not(':input[type=button], :input[type=submit], :input[type=reset]').val('');
        $form.find('input[type=checkbox]').prop('checked', false);
        $form.find('input[type=radio]').prop('checked', false);
        $form.find('select').val('');
        LoadData($form.data('reload'));
        $form.find('input:first').focus();
        if (form.action.indexOf('/edit') >= 0) {
            $form.closest('div.modal').modal('hide');
        }
    };
    var failHandler = function (d) {
        Utils.ShowFormError($form.find('div.formmsg'), 'There was an error saving this data');
    };
    switch (form.id) {
        case 'frm_addtransaction':
            doneHandler = function (d) {
                Utils.ShowFormMessage($form.find('div.formmsg'), 'Transaction added');
                $form.find('input').not(':input[type=button], :input[type=submit], :input[type=reset]').val('');
                $form.find('input[type=checkbox]').prop('checked', false);
                $('#addtransaction_allowdupe').prop('checked', false).parent().addClass('d-none');
                $('#addtransaction_date').datepicker('update', new Date().toLocaleDateString());
                $('#addtransaction_payee').focus();
                Utils.TransactionSplit.Reset();
                LoadData($form.data('reload'));
            };
            failHandler = function (d) {
                d = JSON.parse(d.responseText);
                var dupe = d.dupe;
                var msg = 'Allow dupe? On ' + dupe.date.substring(0, 10);
                if (dupe.description != '') {
                    msg += ' (<em>' + dupe.description + '</em>)';
                }
                $form.find('label[for=addtransaction_allowdupe]').html(msg).parent().removeClass('d-none');
            };
            break;
        case 'frm_edittransaction':
            doneHandler = function (d) {
                Utils.ShowFormMessage($form.find('div.formmsg'), 'Transaction Updated');
                $form.find('input').not(':input[type=button], :input[type=submit], :input[type=reset]').val('');
                $form.find('input[type=checkbox]').prop('checked', false);
                $('#modal_edittransaction').modal('hide');
                LoadData($form.data('reload'));
            };
            break;
    }

    $.ajax(form.action, {
            method: "POST",
            data: {
                data: data
            }
        })
        .done(doneHandler)
        .fail(failHandler);
}


function loadTransactionToEdit() {
    $('#addtransactionmodal').modal();
    $('#addtransactionmodal').attr('action', 'transaction/edit');
}

async function showTransactionsByPayee(payeeName) {
    var payeeId = 7; //(await IDBInterface.GetRecordsByIndex('payee', 'name', payeeName))[0].id;
    var records = []; //await IDBInterface.GetRecordsByIndex('transaction', 'payee', payeeId);
    var sortedTransactions = Utils.SortBeans(records, 'date').reverse();
    var count = 0;
    $('.payee_transactions tbody').empty();
    $.each(sortedTransactions, function (i, v) {
        if (count++ > 9)
            return;
        $('.payee_transactions tbody').append('<tr><td>' + moment(v.date).format('M/D/YY') + '</td><td>' + v.category.name + '</td><td>' + (v.grouptotal == null ? Utils.CurrencyFormatter.format(v.amount) : Utils.CurrencyFormatter.format(v.amount) + ' of ' + Utils.CurrencyFormatter.format(v.grouptotal)) + '</td></tr>');
    });
}

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}