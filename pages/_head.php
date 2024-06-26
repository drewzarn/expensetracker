<!doctype html>
<html>

<head>
	<title>Expense Tracker</title>
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
	<link rel="manifest" href="/manifest.json">
	<script src="js/jquery.min.js"></script>
	<script src="js/jquery.validate.js"></script>

	<link rel="stylesheet" href="css/bootstrap.4.1.3.min.css" />
	<script src="js/bootstrap.popper.4.1.3.min.js"></script>
	<script src="js/bootstrap.4.1.3.min.js"></script>

	<link rel="stylesheet" href="css/datatables.min.css" />
	<script src="js/datatables.min.js"></script>
	<script src="js/TransactionTable.Filter.js"></script>

	<link rel="stylesheet" href="//use.fontawesome.com/releases/v5.5.0/css/all.css" integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU" crossorigin="anonymous" />

	<script src="js/jscharting.js"></script>
	<script src="js/plotly-2.32.0.min.js"></script>
	<script src="js/modules/types.js"></script>

	<link rel="stylesheet" href="css/bootstrap-datepicker.min.css" />
	<link rel="stylesheet" href="css/bootstrap.css" />

	<script type="text/javascript" src="js/bootstrap-datepicker.min.js"></script>
	<script type="text/javascript" src="js/typeahead.js"></script>
	<script type="text/javascript" src="js/moment.js"></script>
	<script src="js/dexie.js"></script>
	<script src="js/db.js"></script>
	<script src="js/rules.js"></script>
	<script src="js/charts.js"></script>
</head>

<body class="<?= $DEVELOPMENT ? 'dev' : '' ?> <?= $page=='login' ? 'login' : '' ?>">
	<?= $modalContent ?>