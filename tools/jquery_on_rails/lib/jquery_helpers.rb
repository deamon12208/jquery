require 'digest/md5'

module JQueryHelper

  def include_jquery
    javascript_include_tag(*JQueryOnRails::JQUERY_LIBRARY) +
      "<script src='/j_query/app_jquery?#{ Digest::MD5::hexdigest(@content_for_layout + controller.class.default_layout) }'></script>"
  end
    
end