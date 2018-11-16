<div class="modal" tabindex="-1" role="dialog" id="modal_edittransaction">
	<div class="modal-dialog" role="document">
		<form id="frm_edittransaction" action="transaction/edit" method="POST" autocomplete="off">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Edit Transaction</h5>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<input autocomplete="false" name="hidden" type="text" style="display:none;">
					<input type="hidden" id="edittransaction_id" />
					<div class="form-group"><input type="text" class="form-control typeahead" data-provide="typeahead" id="edittransaction_payee" name="edittransaction_payy" placeholder="Payee"/></div>
					<div class="form-group"><input type="text" class="form-control typeahead" data-provide="typeahead" id="edittransaction_category" name="edittransaction_category" placeholder="Category" /></div>
					<div class="form-group"><input type="number" class="form-control" id="edittransaction_amount" name="edittransaction_amount" step="0.01" placeholder="Amount" /></div>
					<div class="form-group"><input type="date" class="form-control" id="edittransaction_date" name="edittransaction_date" placeholder="Date" /></div>
					<div class="form-group"><input type="text" class="form-control" id="edittransaction_description" name="edittransaction_description" placeholder="Description" /></div>
				</div>
				<div class="modal-footer">
					<input type="submit" class="btn btn-primary" value="Update Transaction" />
					<table class="payee_transactions table table-sm"></table>
				</div>
			</div>
		</form>
	</div>
</div>