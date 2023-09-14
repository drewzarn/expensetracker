<form id="frm_addtransaction" action="transaction/add" method="POST" autocomplete="off" data-reload="transactions">
		<div class="modal-header">
			<h5 class="modal-title" style="flex-grow: 1;">Add Transaction</h5>
			<button class="btn btn-sm btn-primary float-right">Add Trx</button>
		</div>
		<div class="modal-body">
			<div class="form-group clearfix">
				<input type="text" class="form-control w-75 float-left typeahead" data-provide="typeahead" id="addtransaction_payee" name="addtransaction_payee" placeholder="Payee" required />
				<input data-type="date" class="form-control w-25 float-left" id="addtransaction_date" name="addtransaction_date" placeholder="Date" required />
			</div>
			<div class="form-group clearfix payeebuttons"></div>
			<div class="splitwrapper">
				<div class="form-group clearfix">
					<input type="text" class="form-control w-75 float-left typeahead" data-provide="typeahead" id="addtransaction_category" name="addtransaction_category" placeholder="Category" required />
					<input type="number" class="form-control w-25 float-left" id="addtransaction_amount" name="addtransaction_amount" step="0.01" placeholder="Amount" required />
				</div>
				<div class="form-group"><input type="text" class="form-control" id="addtransaction_description" name="addtransaction_description" placeholder="Description" /></div>
			</div>
			<div class="form-group clearfix categorybuttons"></div>
			<div class="form-group"><span id="splittotal" class="float-left"></span>
				<br />
				<a class="btn btn-info btn-sm text-light" id="splittransaction">Add Split</a>
				<a class="btn btn-info btn-sm text-light d-none" id="unsplittransaction">Remove Split</a>
			</div>
		</div>
</form>