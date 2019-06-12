<div class="modal" tabindex="-1" role="dialog" id="modal_editpayee">
	<div class="modal-dialog" role="document">
		<form id="frm_editpayee" action="payee/edit" method="POST" autocomplete="off" data-reload="payees">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Edit Payee</h5>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<input type="hidden" id="editpayee_id" />
					<div class="form-group"><input type="text" class="form-control" id="editpayee_name" name="editpayee_name" placeholder="Name" /></div>
					<div class="form-group"><input type="checkbox" id="editpayee_deleted" name="editpayee_deleted" /> <label for="editpayee_deleted">Inactive</label></div>
				</div>
				<div class="modal-footer">
					<input type="submit" class="btn btn-primary" value="Update Payee" />
				</div>
			</div>
		</form>
	</div>
</div>