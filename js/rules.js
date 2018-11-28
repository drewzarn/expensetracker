var CATEGORIES = [], CAT_IDS = {}, PAYEES = [], PAY_IDS = {};
var NOW = new Date();
var transactionlisttable;

var AccountData = Object.create(DataObject);
var AccountTypeData = Object.create(DataObject);
var BalanceData = Object.create(DataObject);
var CategoryData = Object.create(DataObject);
var PayeeData = Object.create(DataObject);
var TransactionData = Object.create(DataObject);
$(document).ready(function () {
    $(document).on('account:dataloading', DataHandler.Loading.Account);
    $(document).on('accounttype:dataloading', DataHandler.Loading.AccountType);
    $(document).on('balance:dataloading', DataHandler.Loading.Balance);
    $(document).on('category:dataloading', DataHandler.Loading.Category);
    $(document).on('payee:dataloading', DataHandler.Loading.Payee);
    $(document).on('transaction:dataloading', DataHandler.Loading.Transaction);

    $(document).on('account:dataloaded', DataHandler.Loaded.Account);
    $(document).on('accounttype:dataloaded', DataHandler.Loaded.AccountType);
    $(document).on('balance:dataloaded', DataHandler.Loaded.Balance);
    $(document).on('category:dataloaded', DataHandler.Loaded.Category);
    $(document).on('payee:dataloaded', DataHandler.Loaded.Payee);
    $(document).on('transaction:dataloaded', DataHandler.Loaded.Transaction);

    AccountData.Init('Account');
    AccountTypeData.Init('AccountType');
    BalanceData.Init('Balance');
    CategoryData.Init('Category');
    PayeeData.Init('Payee');
    TransactionData.Init('Transaction');

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
    Utils.SetDateInputs();

    $('a#logout:contains("Sandbox")').closest('body').addClass('sandbox');

    $('form').each(function () {
        if (this.id == "frm_login") {
            DataObject.Nuke();
            return;
        }
        $(this).validate({
            submitHandler: formAjaxSubmit,
            showErrors: Utils.ShowValidationErrors
        });
    });
    $('input[type=button][data-action=delete]').click(function () {
        var $this = $(this);
        $('input[name="__delete__"]').remove();
        if (confirm('Are you sure you want to delete this item?')) {
            $this.closest('form').append('<input type="hidden" value="1" name="__delete__" />');
            formAjaxSubmit($this.closest('form')[0]);
        }
    });

    $('#card_datastats i').click(function () {
        Utils.GetDataObject($(this).parent().data('ref')).Refresh();
    });

    $('#transactionlistrange').datepicker({format: 'yyyy-mm-dd'});
    $('#loadtransactionlist').click(fetchTransactionList);
    transactionlisttable = $('#transactionlisttable').DataTable({
        scrollY: '65vh',
        scrollCollapse: true,
        paging: false,
        ajax: '',
        columns: [
            {data: 'shortdate', render: Utils.TransactionEditIcon},
            {data: 'payee.name'},
            {data: 'category.name'},
            {data: 'description'},
            {data: 'amount'}
        ],
        order: [[0, "desc"]]
    });
    $('#transactionlisttable').on('click', 'i.fa-edit', function () {
        loadTransactionToEdit($(this).data('transactionid'));
    });
    $('#balancetable').on('dblclick', 'td.entry', function () {
        var $td = $(this);
        $('#editbalance_id').val($td.data('balanceid'));
        $('#editbalance_account').val($td.parent().data('accountid'));
        $('#editbalance_date').val($td.data('entrydate'));
        $('#editbalance_amount').val($td.data('amount'));
        $('#modal_editbalance').modal();
    });


    $('#catlist').on('click', 'button', function () {
        var $btn = $(this);
        $btn.toggleClass('btn-info');
        fetchCategoriesByMonth();
    });

    $('#balancechart_accountlist').on('change', 'div.col input', Charts.Balances.Draw);
});

var ModalHandler = {
    Hidden: {
        default: function (e) {
            Utils.HideFormMessage($(e.target).find('div.formmsg'));
        }
    },
    Shown: {
        addtransaction: function (e) {
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
            $('#editcategory_income').prop('checked', details.income == "1");
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
            var trnDetails = transactionlisttable.row($(e.relatedTarget).parent().parent()[0]).data();
            fetchTransactionsByPayee(trnDetails.payee);
            $.each(trnDetails, function (i, v) {
                if (i == "date")
                    v = v.substring(0, 10); //Strip off time for setting input value
                $('#edittransaction_' + i).val(v.hasOwnProperty('name') ? v.name : v);
            });
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
        Account: function (e, data) {
            var date = new Date(data.timestamp * 1000);
            $('#card_datastats').find('li[data-ref=account] span').html(Object.keys(data.list).length + ' accounts<br />' + moment(date).calendar());
            $('#card_datastats').find('li[data-ref=account] i').removeClass('fa-spin');

            var d = Utils.SortBeans(data.list);
            $('#accountlist div ul').empty();
            $('#addbalance_accountlist div').empty();
            $('#balancetable tbody tr[data-accountid]').remove();
            $('#balancechart_accountlist div.col div label').remove();
            $.each(d, function (i, v) {
                $('#accountlist div[data-accounttypeid=' + v.type_id + '] ul').append('<li data-accountid="' + v.id + '" data-accountexcludenetworth="' + v.excludenetworth + '" data-accountactive="' + v.active + '"><span>' + v.name + '</span><a href="#" class="fas fa-pencil-alt ml-2 text-dark light" data-toggle="modal" data-target="#modal_editaccount"></a></li>');
                if (v.active == '1') {
                    $('#addbalance_accountlist_' + v.type_id).append('<div class="form-group"><input class="form-control" type="number" step="0.01" name="addbalance_account' + v.id + '" id="addbalance_account' + v.id + '" placeholder="' + v.name + '" /></div>')
                }
                $('#balancetable tbody[data-accounttypeid=' + v.type_id + ']').append('<tr data-accountid="' + v.id + '" data-accountexcludenetworth="' + v.excludenetworth + '"><td>' + v.name + '</td></tr>');
                $('#editbalance_account optgroup[data-accounttypeid=' + v.type_id + ']').append('<option value="' + v.id + '">' + v.name + '</option>');
                $('#balancechart_accountlist div.col[data-accounttypeid=' + v.type_id + '] div').append('<label class="d-block" for="bca' + v.id + '"><input type="checkbox" data-accountid="' + v.id + '" id="bca' + v.id + '"> ' + v.name + '</label></div>');
            });
            BalanceData.Refresh();
        },
        AccountType: function (e, data) {
            var date = new Date(data.timestamp * 1000);
            $('#card_datastats').find('li[data-ref=accounttype] span').html(Object.keys(data.list).length + ' account types<br />' + moment(date).calendar());
            $('#card_datastats').find('li[data-ref=accounttype] i').removeClass('fa-spin');

            var d = Utils.SortBeans(data.list);
            $('#addaccount_type').empty();
            $('#accountlist div.row').empty();
            $('#addbalance_accountlist').empty();
            $('#balancetable tbody').remove();
            $('#balancechart_accountlist div.col').remove();
            $.each(d, function (i, v) {
                $('#addaccount_type').append('<option value="' + v.id + '">' + v.name + '</option>')
                $('#accountlist div.row').append('<div class="col" data-accounttypeid="' + v.id + '"><h5>' + v.name + ' Accounts</h5><ul></ul></div>');
                $('#addbalance_accountlist').append('<h6>' + v.name + '</h6>');
                $('#addbalance_accountlist').append('<div id="addbalance_accountlist_' + v.id + '"></div>');
                $('#balancetable tfoot').before('<tbody data-accounttypeid="' + v.id + '" data-accounttypeasset="' + v.asset + '"><tr class="table-secondary"><th>' + v.name + '</th></tr></tbody>');
                $('#editbalance_account').append('<optgroup data-accounttypeid="' + v.id + '" label="' + v.name + '" />');
                $('#balancechart_accountlist').append('<div class="col" data-accounttypeid="' + v.id + '"><h5><input type="checkbox" data-accounttypeid="' + v.id + '" id="bcat' + v.id + '" checked /> <label for="bcat' + v.id + '">' + v.name + '</label></h5><div></div></div>');

            });
            AccountData.Refresh();
        },
        Balance: function (e, data) {
            var date = new Date(data.timestamp * 1000);
            $('#card_datastats').find('li[data-ref=balance] span').html(Object.keys(data.list).length + ' balance entries<br />' + moment(date).calendar());
            $('#card_datastats').find('li[data-ref=balance] i').removeClass('fa-spin');

            var d = data.list;
            $('#balancetable th.balancedate, #balancetable th[data-balancedate], #balancetable td.entry, #balancetable tr#netbalance').remove();
            $('#balancetable tfoot').append('<tr id="netbalance" class="table-secondary"><th>Net</th></tr>');
            var entriesByDate = {};
            $.each(d, function (i, v) {
                v.date = v.date.substring(0, 10);
                if (entriesByDate[v.date] == null) {
                    entriesByDate[v.date] = new Array();
                }
                entriesByDate[v.date].push(v);
            });
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
                            sum += parseFloat($tdEl.data('amount'));
                        }
                    });
                    $tbodyEl.find('th[data-balancedate=' + $thEl.text() + ']').text(sum).data('amount', sum);
                });
            });
            //Add color-coding to sum cells
            $('#balancetable th[data-balancedate]').each(function (i, el) {
                var $el = $(el);
                var isAsset = $el.closest('tbody').data('accounttypeasset') == "1";
                if (parseFloat($el.data('amount')) == parseFloat($el.next().data('amount'))) {
                    $el.addClass('text-warning');
                } else if (parseFloat($el.data('amount')) > parseFloat($el.next().data('amount'))) {
                    $el.addClass(isAsset ? 'text-success' : 'text-danger');
                } else if (parseFloat($el.data('amount')) < parseFloat($el.next().data('amount'))) {
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
                if (parseFloat($el.data('amount')) == parseFloat($el.next().data('amount'))) {
                    $el.addClass('text-warning');
                } else if (parseFloat($el.data('amount')) > parseFloat($el.next().data('amount'))) {
                    $el.addClass('text-success');
                } else if (parseFloat($el.data('amount')) < parseFloat($el.next().data('amount'))) {
                    $el.addClass('text-danger');
                }
                $el.text(Utils.CurrencyFormatter.format($el.text()));
            });
        },
        Category: function (e, data) {
            var date = new Date(data.timestamp * 1000);
            $('#card_datastats').find('li[data-ref=category] span').html(Object.keys(data.list).length + ' categories<br />' + moment(date).calendar());
            $('#card_datastats').find('li[data-ref=category] i').removeClass('fa-spin');

            var d = Utils.SortBeans(data.list);
            $('#categorylist tbody').empty();
            CATEGORIES = [];
            CAT_IDS = {}
            $.each(d, function (i, v) {
                if (v.deleted != '1') {
                    CATEGORIES.push(v.name);
                    CAT_IDS[v.name] = v.id;
                }
                $('#categorylist tbody').append('<tr><td><a href="#" class="fas fa-edit text-dark light mr-2" data-toggle="modal" data-target="#modal_editcategory" data-categoryid="' + v.id + '" />' + v.name + '</td><td>' + (v.income == '1' ? '<i class="fas fa-check-circle" />' : '') + '</td><td>' + (v.deleted == '1' ? '<i class="fas fa-ban" />' : '') + '</td></tr>');
                $('#categorylist tbody').find('a[data-categoryid=' + v.id + ']').data('details', v);
            });
            CATEGORIES.sort();
            $("#addtransaction_category").typeahead({source: CATEGORIES});
            $("#edittransaction_category").typeahead({source: CATEGORIES});
            $('#catlist').empty();
            $.each(CATEGORIES, function (i, v) {
                $('#catlist').append('<button class="btn-sm">' + v + '</button>');
            });
        },
        Payee: function (e, data) {
            var date = new Date(data.timestamp * 1000);
            $('#card_datastats').find('li[data-ref=payee] span').html(Object.keys(data.list).length + ' payees<br />' + moment(date).calendar());
            $('#card_datastats').find('li[data-ref=payee] i').removeClass('fa-spin');

            var d = Utils.SortBeans(data.list);
            $('#payeelist tbody').empty();
            PAYEES = [];
            PAY_IDS = {}
            $.each(d, function (i, v) {
                if (v.deleted != '1') {
                    PAYEES.push(v.name);
                    PAY_IDS[v.name] = v.id;
                }

                $('#payeelist tbody').append('<tr><td><a href="#" class="fas fa-edit text-dark light mr-2" data-toggle="modal" data-target="#modal_editpayee" data-payeeid="' + v.id + '" />' + v.name + '</td><td>' + (v.deleted == '1' ? '<i class="fas fa-ban" />' : '') + '</td></tr>');
                $('#payeelist tbody').find('a[data-payeeid=' + v.id + ']').data('details', v);
            });
            PAYEES.sort();
            $("#addtransaction_payee").typeahead({source: PAYEES, afterSelect: fetchTransactionsByPayee});
            $("#edittransaction_payee").typeahead({source: PAYEES, afterSelect: fetchTransactionsByPayee});
        },
        Transaction: function (e, data) {
            var date = new Date(data.timestamp * 1000);
            $('#card_datastats').find('li[data-ref=transaction] span').html(Object.keys(data.list).length + ' transactions<br />' + moment(date).calendar());
            $('#card_datastats').find('li[data-ref=transaction] i').removeClass('fa-spin');

            var mtd = {income: 0, expense: 0};
            var ytd = {income: 0, expense: 0};
            $.each(data.list, function (i, v) {
                var mDate = moment(v.date);
                if (mDate.isSame(NOW, 'month')) {
                    if (v.category.income == "1") {
                        mtd.income += parseFloat(v.amount);
                    } else {
                        mtd.expense += parseFloat(v.amount);
                    }
                }
                if (mDate.isSame(NOW, 'year')) {
                    if (v.category.income == "1") {
                        ytd.income += parseFloat(v.amount);
                    } else {
                        ytd.expense += parseFloat(v.amount);
                    }
                }
            });
            $('#dash_mtd li:contains("Income") span').text(Utils.CurrencyFormatter.format(mtd.income));
            $('#dash_mtd li:contains("Expenses") span').text(Utils.CurrencyFormatter.format(mtd.expense));
            $('#dash_mtd li:contains("Net") span').text(Utils.CurrencyFormatter.format(mtd.income - mtd.expense));

            $('#dash_ytd li:contains("Income") span').text(Utils.CurrencyFormatter.format(ytd.income));
            $('#dash_ytd li:contains("Expenses") span').text(Utils.CurrencyFormatter.format(ytd.expense));
            $('#dash_ytd li:contains("Net") span').text(Utils.CurrencyFormatter.format(ytd.income - ytd.expense));
        }
    }
}

var Utils = {
    CurrencyFormatter: new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}),
    SetDateInputs: function (selectorOrElement) {
        if (selectorOrElement == null) {
            selectorOrElement = 'input[type=date]';
        }
        if (typeof selectorOrElement == 'string') {
            $(selectorOrElement).val(new Date().toISOString().substring(0, 10));
        } else {
            selectorOrElement.val(new Date().toISOString().substring(0, 10));
        }
    },
    GetDataObject: function (name) {
        switch (name) {
            case 'account':
                return AccountData;
                break;
            case 'accounttype':
                return AccountTypeData;
                break;
            case 'balance':
                return BalanceData;
                break;
            case 'category':
                return CategoryData;
                break;
            case 'payee':
                return PayeeData;
                break;
            case 'transaction':
                return TransactionData;
                break;
        }
    },
    HideFormMessage: function ($el) {
        $el.addClass('invisible').removeClass('border-danger text-danger border-success text-success');
    },
    LoadInfrastructure: function (load) {
        if (load == null)
            return;
        load = load.split(',');
        if (load.includes('account')) {
            AccountData.Refresh();
        }
        if (load.includes('accounttype')) {
            AccountTypeData.Refresh();
        }
        if (load.includes('balance')) {
            BalanceData.Refresh();
        }
        if (load.includes('category')) {
            CategoryData.Refresh();
        }
        if (load.includes('payee')) {
            PayeeData.Refresh();
        }
        if (load.includes('transaction')) {
            TransactionData.Refresh();
        }
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
    TransactionEditIcon: function (data, type, row) {
        if (type === 'display') {
            return '<a href="#" class="fas fa-edit text-dark mr-2 light" data-toggle="modal" data-target="#modal_edittransaction" data-transactionid="' + row.id + '"></a>' + data;
        }
        return data;
    }
}

function formAjaxSubmit(form, event) {
    $form = $(form);
    Utils.HideFormMessage($form.find('div.formmsg'));
    var replacePrefix = form.id.replace('frm_', '') + '_';
    var data = {};
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
        Utils.LoadInfrastructure($form.data('reload'));
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
                $form.find('input').not(':input[type=button], :input[type=submit], :input[type=reset], :input[type=date]').val('');
                $form.find('input[type=checkbox]').prop('checked', false);
                $('#addtransaction_allowdupe').prop('checked', false).parent().addClass('d-none');
                $('#addtransaction_payee').focus();
                Utils.LoadInfrastructure($form.data('reload'));
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
                transactionlisttable.row($('#transactionlisttable a[data-transactionid=' + d.id + ']').parent().parent()[0]).data(d).draw();
                $('#modal_edittransaction').modal('hide');
                Utils.LoadInfrastructure($form.data('reload'));
            };
            break;
    }

    $.ajax(form.action, {method: "POST", data: {data: data}})
            .done(doneHandler)
            .fail(failHandler);
}


function fetchTransactionList() {
    var start = $('#transactionlistrange input[name=start]').val();
    var end = $('#transactionlistrange input[name=end]').val();
    var url = "transaction/list/datefrom=" + start + "/dateto=" + end;
    transactionlisttable.ajax.url(url).load();
}

function loadTransactionToEdit() {
    $('#addtransactionmodal').modal();
    $('#addtransactionmodal').attr('action', 'transaction/edit');
}

function fetchTransactionsByPayee(selected) {
    var pay_id = PAY_IDS[selected];
    $.get("/transaction/list/dateformat=short/limit=10/payee=" + pay_id)
            .done(drawTransactionsByPayee);
}

function drawTransactionsByPayee(json) {
    $('.payee_transactions tbody').empty();
    $.each(json.data, function (i, v) {
        $('.payee_transactions tbody').append('<tr><td>' + v.date + '</td><td>' + v.category.name + '</td><td>' + Utils.CurrencyFormatter.format(v.amount) + '</td></tr>');
    });
}