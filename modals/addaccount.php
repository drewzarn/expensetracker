<div class="modal" tabindex="-1" role="dialog" id="modal_addaccount">
	<div class="modal-dialog" role="document">
		<form id="frm_addaccount" method="POST" action="account/add" data-reload="account" >
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Add Account</h5>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<div class="form-group"><input type="text" class="form-control" id="addaccount_name" placeholder="Account Name" required /></div>
					<div class="form-group"><select class="form-control" id="addaccount_type" name="addaccount_type" required><option value="">--Select Account Type--</option></select></div>
					<div class="form-group"><input type="checkbox" id="addaccount_excludenetworth" name="addaccount_excludenetworth" /> <label for="addaccount_excludenetworth">Exclude from simple net worth?</label></div>
				</div>
				<div class="modal-footer">
					<input type="submit" value="Add Account" id="addaccount_submit" class="btn btn-primary"/>
				</div>
			</div>
		</form>
	</div>
</div>