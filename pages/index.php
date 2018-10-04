<div class="container-fluid">
	<div class="row" id="header">
		<div class="col" id="title">Expense Tracker</div>
	</div>
	<div class="row">
		<div class="col-sm-2" id="addcontainer"><?php include('addtransaction.php'); ?></div>
		<div class="col-sm-5 dashboard">
			<div id="mtdcomparison">
				<h3>Month-to-date comparison</h3>
				<div></div>
			</div>
			<div id="transactionlist">
				<h3>Transaction List <select id="translist_month"></select><select id="translist_year"></select></h3>
				<div></div>
			</div>
		</div>
		<div class="col-sm-5 dashboard">
			<div id="sixmonthgraph">
				<h3>Spending By Month</h3>
				<div id="spendingbymonth"></div>
			</div>

			<div id="categorypie">
				<h3>Category Breakdown</h3>
				<div></div>
			</div>
		</div>
	</div>
</div>