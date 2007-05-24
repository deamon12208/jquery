# Include hook code here
gem 'hpricot', '0.5.142'
require 'hpricot'
require 'jquery_on_rails'
require 'jquery_helpers'
require 'jqor_control'
JQueryOnRails::JQUERY_LIBRARY = ["jquery", "interface", "form", "dimensions"]
ActionView::Base.send :include, JQueryHelper