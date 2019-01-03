<div class="modal" tabindex="-1" role="dialog" id="modal_editbalance">
	<div class="modal-dialog" role="document">
		<form id="frm_editbalance" action="balance/edit" method="POST" autocomplete="off" data-reload="balance">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Edit Balance Entry</h5>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<input type="hidden" id="editbalance_id" />
					<div class="form-group"><select class="form-control" id="editbalance_account" name="editbalance_account"></select></div>
					<div class="form-group"><input data-type="date" class="form-control" id="editbalance_date" name="editbalance_date" placeholder="Date" /></div>
					<div class="form-group"><input type="number" class="form-control" id="editbalance_amount" name="editbalance_amount" step="0.01" placeholder="Amount" /></div>
				</div>
				<div class="modal-footer d-flex justify-content-between">
					<input type="button" data-action="delete" class="btn btn-danger" value="Delete Balance Entry" />
					<input type="submit" class="btn btn-primary" value="Update Balance Entry" />
				</div>
			</div>
		</form>
	</div>
</div>