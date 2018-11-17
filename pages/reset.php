<?php
	$resetArgs = explode('z', $command);
	if(time() - $resetArgs[0] > $PWRESETLIMIT) {
		echo "This reset link has expired";
		exit();
	}
?>

<div class="container-fluid">
	<div class="row mt-5">
		<div class="col-md-5"></div>
		<div class="col-md-2 mt-5">
			<form method="POST" action="/user/reset">
				<input type="hidden" name="reset" value="<?= $command ?>" />
				<div class="form-group mt-5"><input type="password" id="password" name="password" placeholder="Password" class="form-control" /></div>
				<div class="form-group"><input type="password" id="confirm" name="confirm" placeholder="Confirm" class="form-control" /></div>
				<div class="form-group"><input type="submit" value="Reset Password" class="form-control" /></div>
			</form>
		</div>
		<div class="col-md-5"></div>
	</div>
</div>