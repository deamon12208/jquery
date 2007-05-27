pushd ~/packer.perl
perl jsPacker.pl -e62 -i /usr/local/apache2/htdocs/plugins/debug/jquery.debug.js -o /usr/local/apache2/htdocs/plugins/debug/jquery.debug-pack.js
cat /usr/local/apache2/htdocs/plugins/debug/jquery.debug-pack.js
ls -la /usr/local/apache2/htdocs/plugins/debug/
popd
