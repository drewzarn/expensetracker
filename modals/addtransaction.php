<div class="modal" tabindex="-1" role="dialog" id="modal_addtransaction">
	<div class="modal-dialog" role="document">
		<form id="frm_addtransaction" action="transaction/add" method="POST" autocomplete="off" data-reload="transactions">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Add Transaction</h5>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<div class="form-group clearfix">
						<input type="text" class="form-control w-75 float-left typeahead" data-provide="typeahead" id="addtransaction_payee" name="addtransaction_payee" placeholder="Payee" required />
						<input data-type="date" class="form-control w-25 float-left" id="addtransaction_date" name="addtransaction_date" placeholder="Date" required />
					</div>
					<div class="splitwrapper">
						<div class="form-group clearfix">
							<input type="text" class="form-control w-75 float-left typeahead" data-provide="typeahead" id="addtransaction_category" name="addtransaction_category" placeholder="Category" required />
							<input type="number" class="form-control w-25 float-left" id="addtransaction_amount" name="addtransaction_amount" step="0.01" placeholder="Amount" required />
						</div> 
						<div class="form-group"><input type="text" class="form-control" id="addtransaction_description" name="addtransaction_description" placeholder="Description" /></div>
					</div>
					<div class="form-group"><span id="splittotal" class="float-left"></span>
						<br />
						<a class="btn btn-info btn-sm text-light" id="splittransaction">Add Split</a>
						<a class="btn btn-info btn-sm text-light d-none" id="unsplittransaction">Remove Split</a>
					</div>
				</div>
				<div class="modal-footer">
					<div class="formmsg rounded border bg-light p-2 my-3 invisible"></div><input type="submit" class="btn btn-primary" value="Add Transaction" />
					<table class="payee_transactions table table-sm mt-3">
						<thead>
							<tr><th>Date</th><th>Category</th><th>Amount</th></tr>
						</thead>
						<tbody></tbody>
					</table>
				</div>
			</div>
		</form>
	</div>
</div>