<!doctype html>
<html>

<head>
	<title>Expense Tracker</title>
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
	<script src="https://code.jquery.com/jquery-3.3.1.min.js" crossorigin="anonymous"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.17.0/jquery.validate.js"></script>

	<link rel="stylesheet" href="css/bootstrap.4.1.3.min.css" />
	<script src="js/bootstrap.popper.4.1.3.min.js"></script>
	<script src="js/bootstrap.4.1.3.min.js"></script>

	<link rel="stylesheet" href="css/datatables.min.css" />
	<script src="js/datatables.min.js"></script>
	<script src="js/TransactionTable.Filter.js"></script>

	<link rel="stylesheet" href="//use.fontawesome.com/releases/v5.5.0/css/all.css" integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU" crossorigin="anonymous" />

	<link rel="stylesheet" href="css/chartist.css">
	<script src="js/chartist.js"></script>
	<link rel="stylesheet" href="css/chartist-plugin-tooltip.css">
	<script src="js/chartist-plugin-tooltip.js"></script>

	<link rel="stylesheet" href="css/bootstrap-datepicker.min.css" />
	<link rel="stylesheet" href="css/bootstrap.css" />

	<script type="text/javascript" src="js/bootstrap-datepicker.min.js"></script>
	<script type="text/javascript" src="js/typeahead.js"></script>
	<script type="text/javascript" src="js/moment.js"></script>
	<script src="js/localforage.js"></script>
	<script src="js/dataObject.js"></script>
	<script src="js/idbinterface.js"></script>
	<script type="module" src="js/bundle.rules.js"></script>
	<script type="module" src="js/bundle.db.js"></script>
	<script src="js/charts.js"></script>
</head>

<body <?= $DEVELOPMENT ? 'class="dev"' : '' ?>>
	<?= $modalContent ?>