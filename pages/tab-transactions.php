<div id="content-transactions" class="container-fluid">
	<div class="row">
		<div class="col-sm-6" id="transactionlist">
			<h3>Transactions</h3>
			<div class="input-daterange input-group" id="transactionlistrange">
				<input type="text" class="input-sm form-control" name="start" value="<?= date("Y-m-01") ?>" />
				<span class="input-group-addon">to</span>
				<input type="text" class="input-sm form-control" name="end" value="<?= date("Y-m-t") ?>" />
				<button id="loadtransactionlist" class="btn btn-secondary">Load</button>
			</div>
			<table id="transactionlisttable" class="display" style="width:100%">
				<thead>
					<tr><th>Date</th><th>Payee</th><th>Category</th><th>Description</th><th>Amount</th></tr>
				</thead>
			</table>
		</div>
	</div>
</div>