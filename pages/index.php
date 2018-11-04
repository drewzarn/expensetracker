<nav id="mainnav" class="navbar navbar-expand-lg navbar-light bg-light">
	<span class="navbar-brand">Expenses</span>
	<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
		<span class="navbar-toggler-icon"></span>
	</button>
	<div class="collapse navbar-collapse" id="navbarSupportedContent">
		<ul class="navbar-nav mr-auto">
			<li class="nav-item">
				<a class="nav-link" href="#dashboard">Dashboard</a>
			</li>
			<li class="nav-item">
				<a class="nav-link" href="#transactions">Transactions</a>
			</li>
			<li class="nav-item">
				<a class="nav-link" href="#balances">Balances</a>
			</li>
			<li class="nav-item dropdown">
				<a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					Add Transaction
				</a>
				<div id="addcontainer" class="dropdown-menu p-3" aria-labelledby="navbarDropdown">
					<?php include('addtransaction.php'); ?>
				</div>
			</li>
		</ul>
		<a href="/user/logout" class="btn btn-light">Logout</a>
	</div>
</nav>

<div id="content-dashboard" class="container-fluid">
	<div class="row">
		<div class="col-sm-5 dashboard default">
			<div id="mtdcomparison">
				<h3>Month-to-date comparison</h3>
				<div></div>
			</div>
			<div id="transactionlist">
				<h3>Transaction List <select id="translist_month"></select><select id="translist_year"></select></h3>
				<div></div>
			</div>
		</div>
		<div class="col-sm-5 dashboard default">
			<div id="sixmonthgraph">
				<h3>Spending By Month</h3>
				<div id="spendingbymonth"></div>
			</div>

			<div id="categorypie">
				<h3>Category Breakdown</h3>
				<div></div>
			</div>
		</div>
		<div class="col-sm-10 dashboard catbymonth">
			<div class="row">
				<div class="col">
					<h3>Categories by month</h3>
					<div id="catlist"></div>
				</div>
			</div>
			<div class="row">
				<div class="col">
					<div id="catbymonthchart"></div>
				</div>
			</div>
		</div>
	</div>
</div>
<div id="content-transactions" class="container-fluid">
	TRANSACTIONS
</div>
<div id="content-balances" class="container-fluid">
	<ul class="nav nav-tabs" id="balanceTabs" role="tablist">
		<li class="nav-item">
			<a class="nav-link active" id="balancedashboard-tab" data-toggle="tab" href="#balancedashboard" role="tab" aria-controls="home" aria-selected="true">Dashboard</a>
		</li>
		<li class="nav-item">
			<a class="nav-link" id="balancesheet-tab" data-toggle="tab" href="#balancesheet" role="tab" aria-controls="profile" aria-selected="false">Balance Sheet</a>
		</li>
		<li class="nav-item">
			<a class="nav-link" id="balanceaccounts-tab" data-toggle="tab" href="#balanceaccounts" role="tab" aria-controls="contact" aria-selected="false">Manage Accounts</a>
		</li>
	</ul>
	<div class="tab-content" id="balanceTabContent">
		<div class="tab-pane fade show active" id="balancedashboard" role="tabpanel" aria-labelledby="balancedashboard-tab">Dashboard</div>
		<div class="tab-pane fade" id="balancesheet" role="tabpanel" aria-labelledby="balancesheet-tab">sheet</div>
		<div class="tab-pane fade" id="balanceaccounts" role="tabpanel" aria-labelledby="balanceaccounts-tab">
			<h2>Asset Accounts</h2>
			<h2>Loan Accounts</h2>
			<h2>Credit Card Accounts</h2>
		</div>
	</div>
</div>