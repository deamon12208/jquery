<?php
$lumineConfig = array (
	'configuration' => array (
		'class-path' => 'D:/Eduardo/htdocs/jQuery-trunk/tools/juice/lib/php/database',
		'host' => 'localhost',
		'database' => 'juice',
		'dialect' => 'mysqli',
		'port' => '5432',
		'user' => 'root',
		'password' => 'odraude',
		'package' => 'juice',
		'maps' => 'juice',
		'use-cache' => 'D:/Eduardo/htdocs/jQuery-trunk/tools/juice/lib/php/database/dbCache',
		'crypt-pass' => '',
		'lembrar' => '1',
		'create-classes' => '1',
		'create-maps' => '1',
		'escape' => '1',
		'empty-as-null' => '1',
		'fileDate' => filemtime(__FILE__)
	),
	'maps' => array (
		'juice.User',
		'juice.Statistics',
		'juice.Tests'
	)
);
?>