<div id="content-manage" class="container-fluid">
	<ul class="nav nav-tabs" id="manageTabs" role="tablist">
		<li class="nav-item">
			<a class="nav-link active" id="manageaccounts-tab" data-toggle="tab" href="#manageaccounts" role="tab" aria-controls="contact" aria-selected="false">Accounts</a>
		</li>
		<li class="nav-item">
			<a class="nav-link" id="managecatpayees-tab" data-toggle="tab" href="#managecatpayees" role="tab" aria-controls="contact" aria-selected="false">Categories/Payees</a>
		</li>
		<li class="nav-item">
			<a class="nav-link" id="manageutils-tab" data-toggle="tab" href="#manageutils" role="tab" aria-controls="contact" aria-selected="false">Utils</a>
		</li>
	</ul>
	<div class="tab-content" id="manageTabContent">
		<div class="tab-pane fade show active" id="manageaccounts" role="tabpanel" aria-labelledby="manageaccounts-tab">
			<div id="accountlist" class="mt-3 container-fluid"><div class="row"></div></div>
			<button class="btn btn-secondary m-3" data-toggle="modal" data-target="#modal_addaccount">Add New Account</button>
			<button class="btn btn-secondary m-3" data-toggle="modal" data-target="#modal_addaccounttype">Add New Account Type</button>
		</div>
		<div class="tab-pane fade" id="managecatpayees" role="tabpanel" aria-labelledby="managecatpayees-tab">
			<div class="mt-3 container-fluid">
				<div class="row">
					<div class="col">
						<h5>Categories</h5>
						<table class="table table-sm table-striped table-bordered" id="categorylist">
							<thead>
								<tr><th>Name</th><th>Parity</th><th>Inactive</th></tr>
							</thead>
							<tbody />
						</table>
					</div>
					<div class="col">
						<h5>Payees</h5>
						<table class="table table-sm table-striped table-bordered" id="payeelist">
							<thead>
								<tr><th>Name</th><th>Inactive</th></tr>
							</thead>
							<tbody />
						</table>
					</div>
				</div>
			</div>
		</div>
		<div class="tab-pane fade" id="manageutils" role="tabpanel" aria-labelledby="manageutils-tab">
			<div class="mt-3 container-fluid">
					<div class="row">
						<div class="col">
							<h5>Utilities</h5>
							<button id="util-nukeDB" class="btn btn-danger m-3">Delete DB</button>
						</div>
					</div>
			</div>
		</div>
	</div>
</div>