var CATEGORIES = [], CAT_IDS = {}, PAYEES = [], PAY_IDS = {};
var monthBarChart;

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
            updateDashboard();
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

    updateDashboard();
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
        $("#add_payee").autocomplete({source: PAYEES, select: loadTransactionsByPayee});
    });
}

function loadTransactionsByPayee(event, ui) {
    var pay_id = PAY_IDS[ui.item.value];
    $('#payee_transactions tbody').empty();
    $('#payee_transactions').DataTable().destroy();
    $('#payee_transactions').DataTable({paging: false, searching: false, info: false, order: [0, "desc"], "ajax": "/transaction/list/datatable/limit=10/payee=" + pay_id, columns: [{data: "trn_date"}, {data: "trn_amount"}]});
}

function updateDashboard() {
    $('#last6months table').DataTable().destroy();
    $('#last6months table').DataTable({paging: false, searching: false, info: false, order: [0, "desc"]});
    $('#mtdcompare table').DataTable().destroy();
    $('#mtdcompare table').DataTable({paging: false, searching: false, info: false, order: [0, "asc"], ajax: "transaction/list/preset=mtdcompare", columns: [{data: "Month"}, {data: "Income"}, {data: "Expenses"}, {data: "Net"}]});
    $('#last10trn table').DataTable().destroy();
    $('#last10trn table').DataTable({paging: false, searching: false, info: false, order: [0, "desc"], ajax: "transaction/list/datatable/cols=trn_date,pay_name,trn_amount/limit=10/orderby=trn_date desc", columns: [{data: "trn_date"}, {data: "pay_name"}, {data: "trn_amount"}]});

    fetchMonthToDate();

    var labels = [], data = [];



}

function fetchMonthToDate() {
    return;
    $.get('/transaction/list/preset=spendbymonth')
        .done(function(json){
            var ctx = $('#monthtodate canvas');
            var ctxParent = $('#monthtodate');
            ctx[0].style.width = $('#monthtodate').width() + 'px';
            ctx[0].style.height = $('#monthtodate').height() + 'px';
            ctx[0].width  = ctx[0].offsetWidth;
            ctx[0].height = ctx[0].offsetHeight;

            var mtdPoints = [];
            var mtdDays = [];
            for(d=1; d<= new Date(new Date().getFullYear(), new Date().getMonth()+1, 0).getDate(); d++) {
                mtdDays.push(d);
            }
            for(i=0; i<json.data.length;i++) {
                mtdPoints.push(json.data[i].Expense);
            }
            var data = {
                labels: mtdDays,
                datasets: [{
                        label: 'Expenses',
                        backgroundColor: '#cc2222',
                        data: mtdPoints
                }]
            };
            monthBarChart = new Chart(ctx, {
                type: 'bar',
                data: data,
                options: {}
            });
            ctx.on('click', function(evt) {
                var day = monthBarChart.getElementsAtEvent(evt)[0]._model.label;
                var d = new Date();
                var trnDate = d.getFullYear() + '-' + (d.getMonth() < 9 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)) + '-' + day;
                $('#trnbyday h2').text('Transactions for ' + trnDate);
                $('#trnbyday table').DataTable().destroy();
                $('#trnbyday table').DataTable({paging: false, searching: false, info: false, order: [0, "desc"], ajax: "transaction/list/datatable/cols=pay_name,cat_name,trn_amount/orderby=pay_name desc/datefrom=" + trnDate + "/dateto=" + trnDate, columns: [{data: "pay_name"}, {data: "cat_name"}, {data: "trn_amount"}]});
            });
        })
}