var CATEGORIES = [], CAT_IDS = {}, PAYEES = [], PAY_IDS = {};
var NOW = new Date();

var transactionlisttable;
var transactionEditIcon = function (data, type, row) {
    if (type === 'display') {
        return '<a href="#" class="fas fa-edit text-dark mr-2 light" data-toggle="modal" data-target="#modal_edittransaction" data-transactionid="' + row.id + '"></a>' + data;
    }
    return data;
};

function dateToToday(selectorOrElement) {
    if (selectorOrElement == null) {
        selectorOrElement = 'input[type=date]';
    }
    if (typeof selectorOrElement == 'string') {
        $(selectorOrElement).val(new Date().toISOString().substring(0, 10));
    } else {
        selectorOrElement.val(new Date().toISOString().substring(0, 10));
    }
}

var currencyFormatter = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'});

$(document).ready(function () {
    dateToToday();

    $('a#logout:contains("Sandbox")').closest('body').addClass('sandbox');

    $('form').each(function () {
        if (this.id == "frm_login")
            return;
        $(this).validate({
            submitHandler: formAjaxSubmit,
            showErrors: showFormErrors
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

    BalanceData = Object.create(DataObject);
    BalanceData.Init('Balance');
    var b = BalanceData.GetData('raw');
    
    $('#modal_addtransaction').on('shown.bs.modal', function (e) {
        $('#addtransaction_allowdupe').prop('checked', false).parent().addClass('d-none');
    })

    $('#modal_editaccount').on('shown.bs.modal', function (e) {
        $('#editaccount_name').val($(e.relatedTarget).prev().text());
        $('#editaccount_excludenetworth').prop('checked', $(e.relatedTarget).parent().data('accountexcludenetworth') == "1");
        $('#editaccount_active').prop('checked', $(e.relatedTarget).parent().data('accountactive') == "1");
        $('#editaccount_id').val($(e.relatedTarget).parent().data('accountid'));
    });

    $('#modal_edittransaction').on('shown.bs.modal', function (e) {
        $('#edittransaction_id').val($(e.relatedTarget).data('transactionid'));
        var trnDetails = transactionlisttable.row($(e.relatedTarget).parent().parent()[0]).data();
        fetchTransactionsByPayee(trnDetails.payee);
        $.each(trnDetails, function (i, v) {
            if (i == "date")
                v = v.substring(0, 10); //Strip off time for setting input value
            $('#edittransaction_' + i).val(v.hasOwnProperty('name') ? v.name : v);
        });
    });

    $('#modal_editcategory').on('shown.bs.modal', function (e) {
        $('#editcategory_id').val($(e.relatedTarget).data('categoryid'));
        var details = $(e.relatedTarget).data('details');
        $('#editcategory_name').val(details.name);
        $('#editcategory_income').prop('checked', details.income == "1");
        $('#editcategory_deleted').prop('checked', details.deleted == "1");
    });

    $('#modal_editpayee').on('shown.bs.modal', function (e) {
        $('#editpayee_id').val($(e.relatedTarget).data('payeeid'));
        var details = $(e.relatedTarget).data('details');
        $('#editpayee_name').val(details.name);
        $('#editpayee_deleted').prop('checked', details.deleted == "1");
    });

    $('#transactionlistrange').datepicker({format: 'yyyy-mm-dd'});
    $('#loadtransactionlist').click(fetchTransactionList);
    transactionlisttable = $('#transactionlisttable').DataTable({
        scrollY: '65vh',
        scrollCollapse: true,
        paging: false,
        ajax: '',
        columns: [
            {data: 'shortdate', render: transactionEditIcon},
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

    $('#addaccount').click(function () {
        var data = {
            name: $('#addaccountname').val(),
            type: $('input[name=addaccounttype]:checked').val()
        };
        if (data.name == '' || data.value == '') {
            return;
        }
        $.post(
                'account/add',
                data
                )
                .done(function () {
                    $('#addaccountname').val('').focus();
                    loadAccounts();
                });
    });


    $('#mainnav ul .nav-link').click(function () {
        var content = $(this).attr('href').substring(1);
        $('div[id^="content-"]').hide();
        $('div[id^="content-' + content + '"]').show();
    });
    if (location.hash != '') {
        $('.nav-link[href="' + location.hash + '"]').click();
    }

    $('#catlist').on('click', 'button', function () {
        var $btn = $(this);
        $btn.toggleClass('btn-info');
        fetchCategoriesByMonth();
    });

    $(document).on("accounttype:added", function(event, accounttype){
        $('#balancechart_accountlist').append('<div class="col" data-accounttype="' + accounttype.id + '"><h5>' + accounttype.name + '</h5><ul></ul></div>');
    });

    $(document).on("account:added", function(event, account){
    });

    loadAccountTypes();
    loadCategories();
    loadPayees();
});

function formAjaxSubmit(form, event) {
    $form = $(form);
    $form.find('div.formerror').remove();
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
        $form.find('input').not(':input[type=button], :input[type=submit], :input[type=reset]').val('');
        $form.find('input[type=checkbox]').prop('checked', false);
        $form.find('input[type=radio]').prop('checked', false);
        $form.find('select').val('');
        loadInfrastructure($form.data('reload'));
        $form.find('input:first').focus();
        if (form.action.indexOf('/edit') >= 0) {
            $form.closest('div.modal').modal('hide');
        }
    };
    var failHandler = function (d) {
        $form.find('input[type=submit]').before('<div class="formerror rounded border border-danger bg-light text-danger p-2 my-3">There was an error saving this data</div>');
    };
    switch (form.id) {
        case 'frm_addtransaction':
            doneHandler = function (d) {
                $form.find('input').not(':input[type=button], :input[type=submit], :input[type=reset], :input[type=date]').val('');
                $form.find('input[type=checkbox]').prop('checked', false);
                $('#addtransaction_allowdupe').prop('checked', false).parent().addClass('d-none');
                $('#addtransaction_payee').focus();
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
                $form.find('input').not(':input[type=button], :input[type=submit], :input[type=reset]').val('');
                $form.find('input[type=checkbox]').prop('checked', false);
                transactionlisttable.row($('#transactionlisttable a[data-transactionid=' + d.id + ']').parent().parent()[0]).data(d).draw();
                $('#modal_edittransaction').modal('hide');
            };
            break;
    }

    $.ajax(form.action, {method: "POST", data: {data: data}})
            .done(doneHandler)
            .fail(failHandler);
}

function showFormErrors(errorMap, errorList) {
    if (errorList[0] == null)
        return;
    $(errorList[0].element).closest('form').find('div.formerror').remove();
    $(errorList[0].element).closest('form').find('input[type=submit]').before('<div class="formerror rounded border border-danger bg-light text-danger p-2 my-3">You seem to be missing some data...</div>');
}

function loadInfrastructure(load) {
    if (load == null)
        return;
    load = load.split(',');
    if (load.includes('account')) {
        loadAccounts();
    }
    if (load.includes('accounttype')) {
        loadAccountTypes();
    }
    if (load.includes('balance')) {
        loadBalances();
    }
    if (load.includes('category')) {
        loadCategories();
    }
    if (load.includes('payee')) {
        loadPayees();
    }
}

function loadAccounts() {
    $.ajax({
        url: "account/list"
    }).done(function (d) {
        d = sortBeans(d);
        $('#accountlist div ul').empty();
        $('#addbalance_accountlist div').empty();
        $('#balancetable tbody tr[data-accountid]').remove();
        $.each(d, function (i, v) {
            $(document).trigger("account:added", v);
            $('#accountlist div[data-accounttypeid=' + v.type_id + '] ul').append('<li data-accountid="' + v.id + '" data-accountexcludenetworth="' + v.excludenetworth + '" data-accountactive="' + v.active + '"><span>' + v.name + '</span><a href="#" class="fas fa-pencil-alt ml-2 text-dark light" data-toggle="modal" data-target="#modal_editaccount"></a></li>');
            if (v.active == '1') {
                $('#addbalance_accountlist_' + v.type_id).append('<div class="form-group"><input class="form-control" type="number" step="0.01" name="addbalance_account' + v.id + '" id="addbalance_account' + v.id + '" placeholder="' + v.name + '" /></div>')
            }
            $('#balancetable tbody[data-accounttypeid=' + v.type_id + ']').append('<tr data-accountid="' + v.id + '" data-accountexcludenetworth="' + v.excludenetworth + '"><td>' + v.name + '</td></tr>');
            $('#editbalance_account optgroup[data-accounttypeid=' + v.type_id + ']').append('<option value="' + v.id + '">' + v.name + '</option>');
        });
        loadBalances();
    });
}

function loadAccountTypes() {
    $.ajax({
        url: "accounttype/list"
    }).done(function (d) {
        d = sortBeans(d);
        $('#addaccount_type').empty();
        $('#accountlist div.row').empty();
        $('#addbalance_accountlist').empty();
        $('#balancetable tbody').remove();
        $.each(d, function (i, v) {
            $(document).trigger("accounttype:added", v);
            $('#addaccount_type').append('<option value="' + v.id + '">' + v.name + '</option>')
            $('#accountlist div.row').append('<div class="col" data-accounttypeid="' + v.id + '"><h5>' + v.name + ' Accounts</h5><ul></ul></div>');
            $('#addbalance_accountlist').append('<h6>' + v.name + '</h6>');
            $('#addbalance_accountlist').append('<div id="addbalance_accountlist_' + v.id + '"></div>');
            $('#balancetable tfoot').before('<tbody data-accounttypeid="' + v.id + '" data-accounttypeasset="' + v.asset + '"><tr class="table-secondary"><th>' + v.name + '</th></tr></tbody>');
            $('#editbalance_account').append('<optgroup data-accounttypeid="' + v.id + '" label="' + v.name + '" />');
        });
        loadAccounts();
    });
}

function loadBalances() {
    $.ajax({
        url: "balance/list"
    }).done(function (d) {
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
                if(Charts.Balances.allseries[entry.account_id] == null) Charts.Balances.allseries[entry.account_id] = new Array();
                Charts.Balances.allseries[entry.account_id].push(entry.amount);
                var td = $('<td class="entry" data-entrydate="' + entryDate + '" data-balanceid="' + entry.id + '">' + entry.amount + '</td>');
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

        for(var i in Object.keys(Charts.Balances.allseries)) {
            var accountId = Object.keys(Charts.Balances.allseries)[i];
            Charts.Balances.allseries[accountId].reverse();
        }

        //Add color-coding to entry cells
        $('#balancetable td.entry').each(function (i, el) {
            var $el = $(el);
            if ($el.text() != '-') {
                var isAsset = $el.closest('tbody').data('accounttypeasset') == "1";
                if (parseFloat($el.data('amount')) == parseFloat($el.nextAll(':not(.empty)').filter(':first').data('amount'))) {
                    $el.addClass('table-warning');
                } else if (parseFloat($el.data('amount')) > parseFloat($el.nextAll(':not(.empty)').filter(':first').data('amount'))) {
                    $el.addClass(isAsset ? 'table-success' : 'table-danger');
                } else if (parseFloat($el.data('amount')) < parseFloat($el.nextAll(':not(.empty)').filter(':first').data('amount'))) {
                    $el.addClass(isAsset ? 'table-danger' : 'table-success');
                }
                $el.text(currencyFormatter.format($el.text()));
            }
        });

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
            $el.text(currencyFormatter.format($el.text()));
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
            $el.text(currencyFormatter.format($el.text()));
        });
    });
}

function loadCategories() {
    $.ajax({
        url: "category/list"
    }).done(function (d) {
        d = sortBeans(d);
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
    });
}

function loadPayees() {
    $.ajax({
        url: "payee/list"
    }).done(function (d) {
        d = sortBeans(d);
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
    });
}


function sortBeans(beans, sortBy = 'name') {
    var sorted = [];
    for (var bean in beans) {
        sorted.push(beans[bean]);
    }
    sorted.sort(function (a, b) {
        return a[sortBy].toLowerCase().localeCompare(b[sortBy].toLowerCase())
    });
    return sorted;
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
        $('.payee_transactions tbody').append('<tr><td>' + v.date + '</td><td>' + v.category.name + '</td><td>' + currencyFormatter.format(v.amount) + '</td></tr>');
    });
}