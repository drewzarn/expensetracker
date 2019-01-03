<div class="modal" tabindex="-1" role="dialog" id="modal_editcategory">
	<div class="modal-dialog" role="document">
		<form id="frm_editcategory" action="category/edit" method="POST" autocomplete="off" data-reload="category">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Edit Category</h5>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<input type="hidden" id="editcategory_id" />
					<div class="form-group"><input type="text" class="form-control" id="editcategory_name" name="editcategory_name" placeholder="Name" /></div>
					<div class="form-group"><label for="editcategory_parity">Parity</label> <select id="editcategory_parity" name="editcategory_parity"><option value="1">Income</option><option value="0">Transfer</option><option value="-1">Expense</option></select></div>
					<div class="form-group"><input type="checkbox" id="editcategory_deleted" name="editcategory_deleted" /> <label for="editcategory_deleted">Inactive</label></div>
				</div>
				<div class="modal-footer">
					<input type="submit" class="btn btn-primary" value="Update Category" />
				</div>
			</div>
		</form>
	</div>
</div>