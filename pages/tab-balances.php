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
		<div class="tab-pane fade" id="balancesheet" role="tabpanel" aria-labelledby="balancesheet-tab">
			<button class="btn btn-secondary" data-toggle="modal" data-target="#modal_addbalance">Add Balance Entry</button>
			<table id="balancetable" class="table table-striped table-bordered table-sm">
				<thead>
					<tr>
						<th>&nbsp;</th>
					</tr>
				</thead>
				<tfoot>
					<tr>
						<th>&nbsp;</th>
					</tr>
				</tfoot>
			</table>
		</div>
		<div class="tab-pane fade" id="balanceaccounts" role="tabpanel" aria-labelledby="balanceaccounts-tab">
			<div id="accountlist" class="mt-3 container-fluid"><div class="row"></div></div>
			<button class="btn btn-secondary mt-3" data-toggle="modal" data-target="#modal_addaccount">Add New Account</button>
		</div>
	</div>
</div>