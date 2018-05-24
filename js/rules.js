var CATEGORIES = [], PAYEES = [];

$( document ).ready(function() {
    $('input[type=date]').val(new Date().toISOString().substring(0, 10));

    $('button,input[type=button],input[type=submit]').addClass('ui-button');
    $('#nav').accordion();

    $('form').submit(function(e){
        e.preventDefault();
    });

    loadCategories();
    loadPayees();
});

function loadCategories() {
    $.ajax({
        url: "category/list"
    }).done(function(d) {
        CATEGORIES = d;
        $("#add_category").autocomplete({source: CATEGORIES});
    });
}

function loadPayees() {
    $.ajax({
        url: "payee/list"
    }).done(function(d) {
        PAYEES = d;
        $("#add_payee").autocomplete({source: PAYEES});
    });
}