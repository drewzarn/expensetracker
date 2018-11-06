var CATEGORIES = [], CAT_IDS = {}, PAYEES = [], PAY_IDS = {};
var NOW = new Date();

$(document).ready(function () {
    $('input[type=date]').val(new Date().toISOString().substring(0, 10));

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
            add_payee: $('#add_payee').val().trim(),
            add_category: $('#add_category').val().trim(),
            add_amount: $('#add_amount').val(),
            add_date: $('#add_date').val(),
            add_description: $('#add_description').val()
        };
        if (addData.add_payee == '' || addData.add_category == '' || addData.add_amount == '')
            return;

        if ($('#add_skipdupe').prop('checked')) {
            addData.skipdupe = 1;
        }
        $.post(
                $(this).attr('action'),
                addData
                )
                .done(function () {
                    $('form#addtransaction p.message').removeClass('error').empty();
                    $('#add_category').val('');
                    $('#add_amount').val('');
                    $('#add_description').val('');
                    $('#add_payee').focus();
                    fetchTransactionsByPayee($('#add_payee').val());
                    drawCharts();
                })
                .fail(function (d) {
                    var d = JSON.parse(d.responseText);
                    var dupe = d.dupe;
                    var msg = '<strong>Possible dupe</strong><br />' + dupe.trn_date.substring(0, 10);
                    if (dupe.trn_description != '') {
                        msg += '<br /><em>' + dupe.trn_description + '</em>';
                    }
                    msg += '<br /><input type="checkbox" id="add_skipdupe" /><label for="add_skipdupe">Allow Dupe Entry</label>';
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
        $("#add_category").typeahead({source: CATEGORIES});
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
        $("#add_payee").typeahead({source: PAYEES, afterSelect: fetchTransactionsByPayee});
    });
}