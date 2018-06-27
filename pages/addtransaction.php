<h3>Add Transaction</h3>
<form id="addtransaction" action="transaction/add" method="POST" autocomplete="off">
	<input autocomplete="false" name="hidden" type="text" style="display:none;">
	<label for="add_payee">Payee</label>
	<input type="text" id="add_payee" name="add_payee" />

	<label for="add_category">Category</label>
	<input type="text" id="add_category" name="add_category" />

	<label for="add_amount">Amount</label>
	<input type="number" id="add_amount" name="add_amount" step="0.01" />

	<label for="add_date">Date</label>
	<input type="date" id="add_date" name="add_date" placeholder="Date" />

	<label for="add_description">Description</label>
	<input type="text" id="add_description" name="add_description" />

	<p class="message error"></p>

	<input type="submit" value="Add" />
</form>
<hr />
<table id="payee_transactions" class="display compact">
	<thead>
		<tr><th style="width: 65%;">Date</th><th style="width: 30%;">Amount</th></tr>
	</thead>
</table>