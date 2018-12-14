<div class="modal" tabindex="-1" role="dialog" id="modal_edittransaction">
	<div class="modal-dialog" role="document">
		<form id="frm_edittransaction" action="transaction/edit" method="POST" autocomplete="off" data-reload="transaction">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Edit Transaction</h5>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<input type="hidden" id="edittransaction_id" />
					<div class="form-group clearfix">
						<input type="text" class="form-control w-75 float-left typeahead" data-provide="typeahead" id="edittransaction_payee" name="edittransaction_payee" placeholder="Payee"/>
						<input data-type="date" class="form-control w-25 float-left" id="edittransaction_date" name="edittransaction_date" placeholder="Date" />
					</div>
					<div class="form-group clearfix">
						<input type="text" class="form-control w-75 float-left typeahead" data-provide="typeahead" id="edittransaction_category" name="edittransaction_category" placeholder="Category" />
						<input type="number" class="form-control w-25 float-left" id="edittransaction_amount" name="edittransaction_amount" step="0.01" placeholder="Amount" />
					</div>
					<div class="form-group"><input type="text" class="form-control" id="edittransaction_description" name="edittransaction_description" placeholder="Description" /></div>
				</div>
				<div class="modal-footer">
					<input type="submit" class="btn btn-primary" value="Update Transaction" />
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