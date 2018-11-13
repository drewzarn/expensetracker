<div class="modal" tabindex="-1" role="dialog" id="modal_addtransaction">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title">Add Transaction</h5>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body">
				<form id="frm_addtransaction" action="transaction/add" method="POST" autocomplete="off">
					<input autocomplete="false" name="hidden" type="text" style="display:none;">
					<div class="form-group"><input type="text" class="form-control typeahead" data-provide="typeahead" id="addtransaction_payee" name="addtransaction_payy" placeholder="Payee"/></div>
					<div class="form-group"><input type="text" class="form-control typeahead" data-provide="typeahead" id="addtransaction_category" name="addtransaction_category" placeholder="Category" /></div>
					<div class="form-group"><input type="number" class="form-control" id="addtransaction_amount" name="addtransaction_amount" step="0.01" placeholder="Amount" /></div>
					<div class="form-group"><input type="date" class="form-control" id="addtransaction_date" name="addtransaction_date" placeholder="Date" /></div>
					<div class="form-group"><input type="text" class="form-control" id="addtransaction_description" name="addtransaction_description" placeholder="Description" /></div>
					<div class="form-group d-none"><input type="checkbox" id="addtransaction_allowdupe" name="addtransaction_allowdupe" /> <label for="addtransaction_allowdupe">Allow dupe: </label></div>
					<div class="form-group"><input type="submit" class="btn btn-primary" value="Add Transaction" /></div>
				</form>
				<hr />
			</div>
			<div class="modal-footer" id="payee_transactions"></div>
		</div>
	</div>
</div>