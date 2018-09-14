<h4>Add Transaction</h4>
<form id="addtransaction" action="transaction/add" method="POST" autocomplete="off">
	<input autocomplete="false" name="hidden" type="text" style="display:none;">
	<input type="text" id="add_payee" name="add_payee" placeholder="Payee"/>

	<input type="text" id="add_category" name="add_category" placeholder="Category" />

	<input type="number" id="add_amount" name="add_amount" step="0.01" placeholder="Amount" />

	<input type="date" id="add_date" name="add_date" placeholder="Date" />

	<input type="text" id="add_description" name="add_description" placeholder="Description" />

	<p class="message error"></p>

	<input type="submit" value="Add" />
</form>
<hr />
<div id="payee_transactions"></div>