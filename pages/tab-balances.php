<div id="content-balances" class="container-fluid">
	<ul class="nav nav-tabs" id="balanceTabs" role="tablist">
		<li class="nav-item">
			<a class="nav-link active" id="balancedashboard-tab" data-toggle="tab" href="#balancedashboard" role="tab" aria-controls="home" aria-selected="true">Dashboard</a>
		</li>
		<li class="nav-item">
			<a class="nav-link" id="balancesheet-tab" data-toggle="tab" href="#balancesheet" role="tab" aria-controls="profile" aria-selected="false">Balance Sheet</a>
		</li>
	</ul>
	<div class="tab-content" id="balanceTabContent">
		<div class="tab-pane fade show active container-fluid" id="balancedashboard" role="tabpanel" aria-labelledby="balancedashboard-tab">
			<div class="row">
				<div class="col-10">
					<div class="ct-chart ct-minor-sixth" id="balancechart"></div>
				</div>
				<div class="col-2" id="balancechart_accountlist"></div>
			</div>
		</div>
		<div class="tab-pane fade" id="balancesheet" role="tabpanel" aria-labelledby="balancesheet-tab">
			<button class="btn btn-secondary m-3" data-toggle="modal" data-target="#modal_addbalance">Add Balance Entry</button>
			<table id="balancetable" class="table table-striped table-bordered table-sm">
				<thead>
					<tr>
						<th>&nbsp;</th>
					</tr>
				</thead>
				<tfoot>
				</tfoot>
			</table>
		</div>
	</div>
</div>