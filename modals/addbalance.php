<div class="modal" tabindex="-1" role="dialog" id="modal_addbalance">
	<div class="modal-dialog" role="document">
		<form id="frm_addbalance" method="POST" action="balance/add" data-reload="balance" >
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Add Balance Entry</h5>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<div class="form-group"><label>Balance Date</label><input type="date" name="addbalance_date" id="addbalance_date" class="form-control" /></div>
					<div id="addbalance_accountlist"></div>
				</div>
				<div class="modal-footer">
					<input type="submit" value="Add Balances" id="addbalance_submit" class="btn btn-primary"/>
				</div>
			</div>
		</form>
	</div>
</div>