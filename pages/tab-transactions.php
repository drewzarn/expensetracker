<div id="content-transactions" class="container-fluid">
	<div class="row">
		<div class="col-4">
			<div class="card my-3">
				<h3 class="card-header">Category Spending by Period</h3>
				<table class="table table-sm table-striped stepper" data-source="SpendingByCategory">
					<thead class="steppable">
						<tr><th></th><th data-year="<?= date('Y'); ?>"></th><th data-month="<?= date('n'); ?>" data-year="<?= date('Y'); ?>"></th><th data-month="<?= date('n') == 1 ? 12 : date('n') - 1; ?>" data-year="<?= date('n') == 1 ? date('Y') - 1 : date('Y'); ?>"></th></tr>
					</thead>
					<tbody></tbody>
				</table>
			</div>
			<div class="card my-3">
				<h3 class="card-header">Payee Spending by Period</h3>
				<table class="table table-sm table-striped stepper" data-source="SpendingByPayee">
					<thead class="steppable">
						<tr><th></th><th data-year="<?= date('Y'); ?>"></th><th data-month="<?= date('n'); ?>" data-year="<?= date('Y'); ?>"></th><th data-month="<?= date('n') == 1 ? 12 : date('n') - 1; ?>" data-year="<?= date('n') == 1 ? date('Y') - 1 : date('Y'); ?>"></th></tr>
					</thead>
					<tbody></tbody>
				</table>
			</div>
		</div>
		<div class="col-8" id="transactionlist">
			<h3>Transactions</h3>
			<table id="transactionlisttable" class="display table table-sm table-striped" style="width:100%">
				<thead>
					<tr><th>Date</th><th>Payee</th><th>Category</th><th>Description</th><th>Amount</th></tr>
				</thead>
			</table>
		</div>
	</div>
</div>