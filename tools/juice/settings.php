<?

define("DOCUMENT_ROOT", $_SERVER["DOCUMENT_ROOT"]);

define("LUMINE_DIR", dirname(__FILE__)."/lib/php/lumine/");

/**
 * HTTP links
 */

define("HTTP_HOST", "http://".$_SERVER["HTTP_HOST"]);

define("HTTP_URL", "http://".$_SERVER["HTTP_HOST"].$_SERVER["PHP_SELF"]);

?>