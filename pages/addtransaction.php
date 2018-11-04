<h4>Add Transaction</h4>
<form id="addtransaction" action="transaction/add" method="POST" autocomplete="off">
	<input autocomplete="false" name="hidden" type="text" style="display:none;">
	<div class="form-group"><input type="text" class="form-control basicAutoComplete" id="add_payee" name="add_payee" placeholder="Payee"/></div>
	<div class="form-group"><input type="text" class="form-control basicAutoComplete" id="add_category" name="add_category" placeholder="Category" /></div>
	<div class="form-group"><input type="number" class="form-control" id="add_amount" name="add_amount" step="0.01" placeholder="Amount" /></div>
	<div class="form-group"><input type="date" class="form-control" id="add_date" name="add_date" placeholder="Date" /></div>
	<div class="form-group"><input type="text" class="form-control" id="add_description" name="add_description" placeholder="Description" /></div>
	<div class="form-group"><input type="submit" class="form-control" value="Add" /></div>
	<p class="message error"></p>
</form>
<hr />
<div id="payee_transactions"></div>