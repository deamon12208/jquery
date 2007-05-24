class JQueryController < ActionController::Base
  
  def app_jquery
    headers['Content-Type'] = "text/javascript; charset=UTF-8"
    render :inline => (JQueryOnRails::files || []).map {|f| 
      File.read("#{ RAILS_ROOT }/public/javascripts/#{ f }") }.join("\n")
  end
  
end

class ApplicationController < ActionController::Base

  after_filter :get_jquery_files
  
  def get_jquery_files
    doc = Hpricot(@response.body)
    files_to_include = JQueryOnRails.selectors_per_js.select do |file,sels|
      sels.any? {|sel| !doc[sel].empty? }
    end.map {|k,v| k}
    JQueryOnRails.files = files_to_include
  end

end