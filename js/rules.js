var CATEGORIES = [], CAT_IDS = {}, PAYEES = [], PAY_IDS = {};
var NOW = new Date();

var transactionlisttable;
var transactionEditIcon = function (data, type, row) {
    if (type === 'display') {
        return '<a class="fas fa-edit" data-toggle="modal" data-target="#addtransactionmodal" data-transactionid="' + row.id + '"></a>' + data;
    }
    return data;
};

function dateToToday(selectorOrElement) {
    if(selectorOrElement == null) {
        selectorOrElement = 'input[type=date]';
    }
    if(typeof selectorOrElement == 'string') {
        $(selectorOrElement).val(new Date().toISOString().substring(0, 10));
    } else {
        selectorOrElement.val(new Date().toISOString().substring(0, 10));
    }
}

$(document).ready(function () {
    dateToToday();

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
    $('#addtransactionmodal').on('shown.bs.modal', function (e) {
        if($(e.relatedTarget).data('transactionid') == null) {
            $('#addtransaction').attr('action', 'transaction/add');
            $('#addtransactionmodal h5.modal-title').text('Add Transaction');
            $('#addtransactionmodal input[type=submit]').val('Add');
            $('#addtransactionmodal input[id]').val('');
            dateToToday('#addtransactionmodal input[type=date]');
            $('#trn_id').val('');
        } else {
            $('#addtransaction').attr('action', 'transaction/edit');
            $('#addtransactionmodal h5.modal-title').text('Edit Transaction');
            $('#addtransactionmodal input[type=submit]').val('Update');
            $('#trn_id').val($(e.relatedTarget).data('transactionid'));
            var trnDetails = transactionlisttable.row($(e.relatedTarget).parent().parent()[0]).data();
            $.each(trnDetails, function(i, v){
                $('#trn_' + i).val(v);
            });
        }
    })

    for (var i = 1; i <= 12; i++) {
        $('#translist_month').append('<option value="' + i + '">' + i + '</option>');
    }
    for (var i = 2018; i <= new Date().getFullYear(); i++) {
        $('#translist_year').append('<option value="' + i + '">' + i + '</option>');
    }
    $('#translist_month option:contains(' + (NOW.getMonth() + 1) + ')').prop('selected', true);
    $('#translist_year option:contains(' + NOW.getFullYear() + ')').prop('selected', true);
    $('#translist_month').change(fetchTransactionList);
    $('#translist_year').change(fetchTransactionList);

    $('#mainnav ul .nav-link').click(function () {
        var content = $(this).attr('href').substring(1);
        $('div[id^="content-"]').hide();
        $('div[id^="content-' + content + '"]').show();
    });
    if (location.hash != '') {
        $('.nav-link[href="' + location.hash + '"]').click();
    }

    $('#addcontainer').on("click", function (e) {
        e.stopPropagation();
    });
    $('body').on("click", ".ui-autocomplete", function (e) {
        e.stopPropagation();
    });

    $('form#addtransaction').submit(function (e) {
        e.preventDefault();
        var addData = {
            id: $('#trn_id').val().trim(),
            payee: $('#trn_payee').val().trim(),
            category: $('#trn_category').val().trim(),
            amount: $('#trn_amount').val(),
            date: $('#trn_date').val(),
            description: $('#trn_description').val()
        };
        if (addData.payee == '' || addData.category == '' || addData.amount == '')
            return;

        if ($('#trn_skipdupe').prop('checked')) {
            addData.skipdupe = 1;
        }
        $.post(
                $(this).attr('action'),
                addData
                )
                .done(function (d) {
                    if ($('#addtransaction').attr('action') == 'transaction/edit') {
                        $('#addtransactionmodal').modal('hide');
                        transactionlisttable.row($('#transactionlisttable a[data-transactionid=' + $('#trn_id').val() + ']').parent().parent()[0]).data(d).draw();
                    } else {
                        fetchTransactionsByPayee($('#trn_payee').val());
                    $('#trn_payee').focus();
                    }
                    $('form#addtransaction p.message').removeClass('error').empty();
                    $('#trn_id').val('');
                    $('#trn_category').val('');
                    $('#trn_amount').val('');
                    $('#trn_description').val('');
                    drawCharts();
                })
                .fail(function (d) {
                    var d = JSON.parse(d.responseText);
                    var dupe = d.dupe;
                    var msg = '<strong>Possible dupe</strong><br />' + dupe.date.substring(0, 10);
                    if (dupe.description != '') {
                        msg += '<br /><em>' + dupe.description + '</em>';
                    }
                    msg += '<br /><input type="checkbox" id="trn_skipdupe" /><label for="trn_skipdupe">Allow Dupe Entry</label>';
                    $('form#addtransaction p.message').html(msg).addClass('warning');
                });
    });

    $('#catlist').on('click', 'button', function () {
        var $btn = $(this);
        $btn.toggleClass('btn-info');
        fetchCategoriesByMonth();
    });

    loadCategories();
    loadPayees();
});

function loadCategories() {
    $.ajax({
        url: "category/list"
    }).done(function (d) {
        $.each(d, function (i, v) {
            CATEGORIES.push(v);
            CAT_IDS[v] = i;
        });
        CATEGORIES.sort();
        $("#trn_category").typeahead({source: CATEGORIES});
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
        $.each(d, function (i, v) {
            PAYEES.push(v);
            PAY_IDS[v] = i;
        });
        PAYEES.sort();
        $("#trn_payee").typeahead({source: PAYEES, afterSelect: fetchTransactionsByPayee});
    });
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