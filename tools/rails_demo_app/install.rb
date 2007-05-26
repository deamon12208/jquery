##
# Do some checks.
puts

$errors = 0

require 'fileutils'

puts "** Copying jQuery files over to public/javascripts"

js_source = File.join(File.dirname(__FILE__), 'js')
js_dest = File.join(File.dirname(__FILE__), '..', '..', '..', 'public', 'javascripts')

list = %w{ dimensions form interface jquery jquery.tablesorter jquery.tabs }.map {|x| File.join(js_source, x + ".js") }

begin
  FileUtils.cp(list, js_dest)
rescue
  puts "** The copy failed. Please try by hand"
end

puts "** Now would be a good time to check out the README.  Enjoy your day."
puts
