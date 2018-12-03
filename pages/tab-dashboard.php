<div id="content-dashboard" class="container-fluid">
	<div class="row">
		<div class="col-sm-4">
			<div id="dash_spendingbyperiod" class="card my-3">
				<h3 class="card-header">Spending by Period</h3>
				<table class="table table-sm table-striped" id="spendingbyperiod">
					<thead class="steppable">
						<tr><th></th><th data-year="<?= date('Y'); ?>"></th><th data-month="<?= date('n'); ?>" data-year="<?= date('Y'); ?>"></th><th data-month="<?= date('n') == 1 ? 12 : date('n') - 1; ?>" data-year="<?= date('n') == 1 ? date('Y') - 1 : date('Y'); ?>"></th></tr>
					</thead>
					<tbody></tbody>
				</table>
			</div>
		</div>
		<div class="col-sm-2"></div>
		<div class="col-sm-2"></div>
		<div class="col-sm-2"></div>
		<div class="col-sm-2">
			<div class="card my-3">
				<h3 class="card-header">Data Stats</h3>
				<ul class="list-group list-group-flush" id="card_datastats">
					<li class="list-group-item" data-ref="accounttype"><span>Account Types<br />Pending</span><i class="text-muted fas fa-sync-alt"></i></li>
					<li class="list-group-item" data-ref="account"><span>Accounts<br />Pending</span><i class="text-muted fas fa-sync-alt"></i></li>
					<li class="list-group-item" data-ref="balance"><span>Balances<br />Pending</span><i class="text-muted fas fa-sync-alt"></i></li>
					<li class="list-group-item" data-ref="transaction"><span>Transactions<br />Pending</span><i class="text-muted fas fa-sync-alt"></i></li>
					<li class="list-group-item" data-ref="category"><span>Categories<br />Pending</span><i class="text-muted fas fa-sync-alt"></i></li>
					<li class="list-group-item" data-ref="payee"><span>Payees<br />Pending</span><i class="text-muted fas fa-sync-alt"></i></li>
				</ul>
			</div>
		</div>
	</div>
</div>