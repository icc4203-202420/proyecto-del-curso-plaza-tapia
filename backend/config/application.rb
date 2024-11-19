require_relative "boot"

require "rails/all"

Bundler.require(*Rails.groups)

module Backend
  class Application < Rails::Application
    
    config.load_defaults 7.1

    config.autoload_lib(ignore: %w(assets tasks))

    config.api_only = true

    config.action_dispatch.default_headers = {
      'X-Frame-Options' => 'ALLOW-FROM http://localhost:3001',
      'Content-Security-Policy' => "frame-ancestors 'self' http://localhost:3001"
    }    
  end
end
