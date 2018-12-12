<div id="content-transactions" class="container-fluid">
	<div class="row">
		<div class="col-4">
			<div class="card my-3">
				<h3 class="card-header">Spending by Period</h3>
				<ul class="nav nav-tabs nav-fill" role="tablist">
					<li class="nav-item">
						<a class="nav-link active" data-toggle="tab" href="#sbpcategories">Categories</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" data-toggle="tab" href="#sbppayees">Payees</a>
					</li>
				</ul>

				<div class="tab-content">
					<div class="tab-pane fade show active" id="sbpcategories" role="tabpanel">
						<table class="table table-sm table-striped stepper" data-source="SpendingByCategory" data-rows="CategoryNames">
							<thead class="steppable">
								<tr><th></th><th data-year="<?= date('Y'); ?>"></th><th data-month="<?= date('n') == 1 ? 12 : date('n') - 1; ?>" data-year="<?= date('Y'); ?>"></th><th data-month="<?= date('n') ?>" data-year="<?= date('n') == 1 ? date('Y') - 1 : date('Y'); ?>"></th></tr>
							</thead>
							<tbody></tbody>
						</table>
					</div>
					<div class="tab-pane fade show active" id="sbppayees" role="tabpanel">
						<table class="table table-sm table-striped stepper" data-source="SpendingByPayee" data-rows="PayeeNames">
							<thead class="steppable">
								<tr><th></th><th data-year="<?= date('Y'); ?>"></th><th data-month="<?= date('n') == 1 ? 12 : date('n') - 1; ?>" data-year="<?= date('Y'); ?>"></th><th data-month="<?= date('n') ?>" data-year="<?= date('n') == 1 ? date('Y') - 1 : date('Y'); ?>"></th></tr>
							</thead>
							<tbody></tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
		<div class="col-8" id="transactionlist">
			<div class="card my-3">
				<h3 class="card-header">Transactions</h3>
				<table id="transactionlisttable" class="display table table-sm table-striped" style="width:100%">
					<thead>
						<tr><th>Date</th><th>Payee</th><th>Category</th><th>Description</th><th>Amount</th></tr>
					</thead>
				</table>
			</div>
		</div>
	</div>
</div>