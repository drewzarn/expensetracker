<div id="content-dashboard" class="container-fluid">
	<div class="row">
		<div id="dash_mtd" class="card m-3">
			<h2 class="card-header"><?= date('F Y'); ?></h2>
			<ul class="list-group list-group-flush">
				<li class="list-group-item"><strong>Income: </strong> <span>$0</span></li>
				<li class="list-group-item"><strong>Expenses: </strong> <span>$0</span></li>
				<li class="list-group-item"><strong>Net: </strong> <span>$0</span></li>
			</ul>
		</div>
	</div>
	<div id="dash_ytd" class="card m-3">
		<h2 class="card-header"><?= date('Y'); ?></h2>
		<ul class="list-group list-group-flush">
			<li class="list-group-item"><strong>Income: </strong> <span>$0</span></li>
			<li class="list-group-item"><strong>Expenses: </strong> <span>$0</span></li>
			<li class="list-group-item"><strong>Net: </strong> <span>$0</span></li>
		</ul>
	</div>

	<div class="card m-3">
		<h2 class="card-header">Data Stats</h2>
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