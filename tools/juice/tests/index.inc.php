

<!-- Add the test instruction here -->
<div id="instruction">
	Please chose either to login, register or do a random test.
</div>


<!-- Main content of the test, whatever you want -->
<div class="main">	
	<h1>Welcome to Juice.</h1>

	<form action="?register=1" method="post">
	<div class="exchange">
		<div class="blue out"><strong>Juice</strong> stands for <strong>jQuery UI Testing Center</strong>, it's our solution to user interface testing. Since it's incredibly hard to do automated tests within the DOM,
		we found a solution that involves real human people (read '<em>you</em>') and a very simple testing environment. The results are then automatically submitted to our
		testing database, which we'll use to make our product rock solid.
		</div>
		<div class="blue in" style="left: 600px; opacity: 0; filter: alpha(opacity=0);">
			
				<label for="username_register">Username</label>
				<input type="text" name="username_register" value="" id="username_register"><br clear="both" />
				<label for="password_register">Password</label>
				<input type="text" name="password_register" value="" id="password_register">
				
				<input type="submit" name="register" value="Create an account!" id="register">
			
		</div>
	</div>
	</form>

		
	<p class="strong">Helping is simple. Please start right away with a random test, or register to have even more options. Thanks!</p>
	
	
	<div class="green link"><a href="?random=1">Start with a random test!</a></div>
	<div class="grey link" id="registerlink"><a href="javascript:register()">Register</a></div>
</div>