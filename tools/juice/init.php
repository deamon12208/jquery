<?
/**
 * Starting session
 */
session_start();

/**
 * PHP settings
 */

setlocale (LC_TIME,"en");
ini_set('error_reporting',E_ALL & ~E_NOTICE);

/**
 * User settings
 */
require("settings.php");

/**
 * Include paths
 */
set_include_path(
		get_include_path().PATH_SEPARATOR.
		SITE_PATH.'/'.PATH_SEPARATOR.
		SITE_PATH.'/lib/'.PATH_SEPARATOR
);

/**
 * PHP Libraries
 */
require_once(LUMINE_DIR."LumineConfiguration.php");
require_once(dirname(__FILE__)."/lib/php/database/lumine-conf.php");
require_once(dirname(__FILE__)."/lib/php/UserUtil.php");
require_once(dirname(__FILE__)."/lib/php/StatisticsUtil.php");

/**
 * Lumine config
 */
$conf = new LumineConfiguration( $lumineConfig );

Util::Import('juice.User');
Util::Import('juice.Statistics');
Util::Import('juice.Tests');

?>