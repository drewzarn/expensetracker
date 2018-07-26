var CATEGORIES = [], CAT_IDS = {}, PAYEES = [], PAY_IDS = {};

$( document ).ready(function() {
    $('input[type=date]').val(new Date().toISOString().substring(0, 10));

    $('button,input[type=button],input[type=submit]').addClass('ui-button');

    $('form#addtransaction').submit(function(e){
        e.preventDefault();
        var addData = {
            add_payee: $('#add_payee').val(),
            add_category: $('#add_category').val(),
            add_amount: $('#add_amount').val(),
            add_date: $('#add_date').val(),
            add_description: $('#add_description').val()
        };
        if($('#add_skipdupe').prop('checked')) {
            addData.skipdupe = 1;
        }
        $.post(
            $(this).attr('action'),
            addData
        )
        .done(function(){
            $('form#addtransaction p.message').removeClass('error').empty();
            $('form#addtransaction input[type="text"]').val('');
            $('#add_amount').val('');
            $('#add_payee').focus();
            drawCharts();
            $('#payee_transactions').DataTable().destroy();
        })
        .fail(function(d){
            var d = JSON.parse(d.responseText);
            var dupe = d.dupe;
            var msg = '<strong>Possible dupe</strong><br />' + dupe.trn_date.substring(0, 10);
            if(dupe.trn_description != '') {
                msg += '<br /><em>' + dupe.trn_description + '</em>';
            }
            msg += '<br /><input type="checkbox" id="add_skipdupe" /><label for="add_skipdupe">Allow Dupe Entry</label>';
            $('form#addtransaction p.message').html(msg).addClass('warning');
        });
    });

    loadCategories();
    loadPayees();
});

function loadCategories() {
    $.ajax({
        url: "category/list"
    }).done(function(d) {
        $.each(d, function(i, v){
            CATEGORIES.push(v);
            CAT_IDS[v] = i;
        });
        CATEGORIES.sort();
        $("#add_category").autocomplete({source: CATEGORIES});
    });
}

function loadPayees() {
    $.ajax({
        url: "payee/list"
    }).done(function(d) {
        $.each(d, function(i, v){
            PAYEES.push(v);
            PAY_IDS[v] = i;
        });
        PAYEES.sort();
        $("#add_payee").autocomplete({source: PAYEES, select: fetchTransactionsByPayee});
    });
}