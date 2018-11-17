<div class="modal" tabindex="-1" role="dialog" id="modal_editaccount">
	<div class="modal-dialog" role="document">
		<form id="frm_editaccount" method="POST" action="account/edit" data-reload="account" autocomplete="off">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title">Edit Account</h5>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body">

					<input type="hidden" name="editaccount_id" id="editaccount_id" />
					<div class="form-group"><input type="text" class="form-control" id="editaccount_name" placeholder="Account Name" required /></div>
					<div class="form-group"><input type="checkbox" id="editaccount_excludenetworth" name="editaccount_excludenetworth" /> <label for="editaccount_excludenetworth">Exclude from simple net worth?</label></div>
					<div class="form-group"><input type="checkbox" id="editaccount_active" name="editaccount_active" /> <label for="editaccount_active">Account is active</label></div>
			</div>
			<div class="modal-footer">
				<input type="submit" value="Update Account" class="btn btn-primary"/>
			</div>
		</div>
				</form>
	</div>
</div>