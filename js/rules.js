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

$(document).ready(function () {
    dateToToday();

    $('form').each(function () {
        $(this).validate({
            submitHandler: formAjaxSubmit,
            showErrors: showFormErrors
        });
    });

    $('#modal_editaccount').on('shown.bs.modal', function (e) {
        $('#editaccount_name').val($(e.relatedTarget).prev().text());
        $('#editaccount_id').val($(e.relatedTarget).parent().data('accountid'));
    });

    $('#modal_addtransaction').on('shown.bs.modal', function (e) {
        $('#addtransaction_allowdupe').prop('checked', false).parent().addClass('d-none');
    })

    $('#modal_edittransaction').on('shown.bs.modal', function (e) {
        $('#edittransaction_id').val($(e.relatedTarget).data('transactionid'));
        var trnDetails = transactionlisttable.row($(e.relatedTarget).parent().parent()[0]).data();
        $.each(trnDetails, function (i, v) {
            $('#edittransaction_' + i).val(v);
        });
    })

    $('#transactionlistrange').datepicker({format: 'yyyy-mm-dd'});
    $('#loadtransactionlist').click(fetchTransactionList);
    transactionlisttable = $('#transactionlisttable').DataTable({
        scrollY: '65vh',
        scrollCollapse: true,
        paging: false,
        ajax: '',
        columns: [
            {data: 'date', render: transactionEditIcon},
            {data: 'payee'},
            {data: 'category'},
            {data: 'description'},
            {data: 'amount'}
        ]
    });
    $('#transactionlisttable').on('click', 'i.fa-edit', function () {
        loadTransactionToEdit($(this).data('transactionid'));
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

    loadInfrastructure();
});

function formAjaxSubmit(form, event) {
    $form = $(form);
    $form.find('div.formerror').remove();
    var replacePrefix = form.id.replace('frm_', '') + '_';
    var data = {};
    $form.find('input').each(function (i, el) {
        if (el.type == 'submit' || el.type == 'button' || (el.name == '' && el.id == ''))
            return;
        if (el.type == 'radio') {
            data[el.name.replace(replacePrefix, '')] = $('input[name=' + el.name + ']:checked').val();
        } else {
            data[el.id.replace(replacePrefix, '')] = $(el).val();
        }
    });
    $form.find('select').each(function (i, el) {
        data[el.id.replace(replacePrefix, '')] = $(el).val();
    });

    var doneHandler = function (d) {
        $form.find('input').not(':input[type=button], :input[type=submit], :input[type=reset]').val('');
        $form.find('input[type=checkbox]').prop('checked', false);
        $form.find('input[type=radio]').prop('checked', false);
        $form.find('select').val('');
        loadInfrastructure($form.data('reload'));
        if (form.action.indexOf('/edit') >= 0) {
            $form.closest('div.modal').modal('hide');
        }
    };
    var failHandler = function (d) {
        $form.prepend('<div class="formerror rounded border border-danger bg-light text-danger p-2">There was an error saving this data</div>');
    };
    switch (form.id) {
        case 'frm_addtransaction':
            doneHandler = function (d) {
                $form.find('input').not(':input[type=button], :input[type=submit], :input[type=reset]').val('');
                $form.find('input[type=checkbox]').prop('checked', false);
                $('#addtransaction_allowdupe').prop('checked', false).parent().addClass('d-none');
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
    $(errorList[0].element).closest('form').find('input[type=submit]').before('<div class="formerror rounded border border-danger bg-light text-danger p-2 mb-3">You seem to be missing some data...</div>');
}

function loadInfrastructure(loadOnly) {
    if (typeof loadOnly == 'string') {
        loadOnly = loadOnly.split(',');
    }
    if (loadOnly == null || loadOnly.indexOf('account') >= 0) {
        $.ajax({
            url: "account/list"
        }).done(function (d) {
            $('#accountlist li ul').empty();
            $.each(d, function (i, v) {
                $('#accountlist li[data-accounttypeid=' + v.type_id + '] ul').append('<li data-accountid="' + i + '"><span>' + v.name + '</span><a href="#" class="fas fa-pencil-alt ml-2 text-dark light" data-toggle="modal" data-target="#modal_editaccount"></a></li>');
            });
        });
    }
    if (loadOnly == null || loadOnly.indexOf('accounttype') >= 0) {
        $.ajax({
            url: "accounttype/list"
        }).done(function (d) {
            $.each(d, function (i, v) {
                $('#addaccount_type').append('<option value="' + i + '">' + v.name + '</option>')
                $('#accountlist').append('<li data-accounttypeid="' + i + '">' + v.name + ' Accounts<ul></ul></li>');
            });
            loadInfrastructure('account');
        });
    }

    if (loadOnly == null || loadOnly.indexOf('category') >= 0) {
        $.ajax({
            url: "category/list"
        }).done(function (d) {
            $.each(d, function (i, v) {
                CATEGORIES.push(v);
                CAT_IDS[v] = i;
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

    if (loadOnly == null || loadOnly.indexOf('payee') >= 0) {
        $.ajax({
            url: "payee/list"
        }).done(function (d) {
            $.each(d, function (i, v) {
                PAYEES.push(v);
                PAY_IDS[v] = i;
            });
            PAYEES.sort();
            $("#addtransaction_payee").typeahead({source: PAYEES, afterSelect: fetchTransactionsByPayee});
            $("#edittransaction_payee").typeahead({source: PAYEES, afterSelect: fetchTransactionsByPayee});
        });
    }
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