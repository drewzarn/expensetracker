<div class="modal" tabindex="-1" role="dialog" id="modal_addaccounttype">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title">Add Account Type</h5>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body">
				<form id="frm_addaccounttype" method="POST" action="accounttype/add" data-reload="accounttype" >
					<div class="form-group"><input type="text" class="form-control" id="addaccounttype_name" placeholder="Account Type Name" required /></div>
					<div class="form-group"><input type="checkbox" id="addaccounttype_asset" name="addaccounttype_asset" /> <label for="addaccounttype_asset">Asset accounts (higher balance is better)?</label></div>
					<div class="form-group"><input type="submit" value="Add Account Type" id="addaccounttype_submit" class="btn btn-primary"/></div>
				</form>
			</div>
			<div class="modal-footer"></div>
		</div>
	</div>
</div>