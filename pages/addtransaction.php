<div class="modal" tabindex="-1" role="dialog" id="addtransaction">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title">Add Transaction</h5>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body">
				<form id="addtransaction" action="transaction/add" method="POST" autocomplete="off">
					<input autocomplete="false" name="hidden" type="text" style="display:none;">
					<div class="form-group"><input type="text" class="form-control typeahead" data-provide="typeahead" id="add_payee" name="add_payee" placeholder="Payee"/></div>
					<div class="form-group"><input type="text" class="form-control typeahead" data-provide="typeahead" id="add_category" name="add_category" placeholder="Category" /></div>
					<div class="form-group"><input type="number" class="form-control" id="add_amount" name="add_amount" step="0.01" placeholder="Amount" /></div>
					<div class="form-group"><input type="date" class="form-control" id="add_date" name="add_date" placeholder="Date" /></div>
					<div class="form-group"><input type="text" class="form-control" id="add_description" name="add_description" placeholder="Description" /></div>
					<div class="form-group"><input type="submit" class="btn btn-primary" value="Add" /></div>
					<p class="message error"></p>
				</form>
				<hr />
			</div>
			<div class="modal-footer" id="payee_transactions"></div>
		</div>
	</div>
</div>