<div class="modal" tabindex="-1" role="dialog" id="addtransactionmodal">
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
					<input type="hidden" id="trn_id" />
					<div class="form-group"><input type="text" class="form-control typeahead" data-provide="typeahead" id="trn_payee" name="trn_payee" placeholder="Payee"/></div>
					<div class="form-group"><input type="text" class="form-control typeahead" data-provide="typeahead" id="trn_category" name="trn_category" placeholder="Category" /></div>
					<div class="form-group"><input type="number" class="form-control" id="trn_amount" name="trn_amount" step="0.01" placeholder="Amount" /></div>
					<div class="form-group"><input type="date" class="form-control" id="trn_date" name="trn_date" placeholder="Date" /></div>
					<div class="form-group"><input type="text" class="form-control" id="trn_description" name="trn_description" placeholder="Description" /></div>
					<div class="form-group"><input type="submit" class="btn btn-primary" value="Add" /></div>
					<p class="message error"></p>
				</form>
				<hr />
			</div>
			<div class="modal-footer" id="payee_transactions"></div>
		</div>
	</div>
</div>