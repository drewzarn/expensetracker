<nav id="mainnav" class="navbar navbar-expand-lg navbar-light bg-light">
	<span class="navbar-brand">Expenses</span>
	<a class="nav-link text-muted" href="#" data-toggle="modal" data-target="#modal_addtransaction">Add Transaction</a>
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
			<li class="nav-item">
				<a class="nav-link" href="#manage">Manage</a>
			</li>
		</ul>
		<a id="logout" href="/user/logout" class="btn btn-light">Logout <?= $_SESSION['user']->name ?></a>
	</div>
	<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
		<span class="navbar-toggler-icon"></span>
	</button>
</nav>