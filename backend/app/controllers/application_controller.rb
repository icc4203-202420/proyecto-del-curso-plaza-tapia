require 'json_web_token'

class ApplicationController < ActionController::API
  before_action :authorize_request
  attr_reader :current_user

  protected

  def authorize_request
    auth_header = request.headers['Authorization']
    
    if auth_header.present?
      token = auth_header.split(' ').last
      begin
        decoded = JWT.decode(token, Rails.application.credentials.secret_key_base)[0]
        Rails.logger.info "Decoded token: #{decoded.inspect}"
        @current_user = User.find(decoded['user_id'])
        Rails.logger.info "Current user: #{@current_user.inspect}"
      rescue ActiveRecord::RecordNotFound
        log_and_render_unauthorized("User not found: #{decoded['user_id']}")
      rescue JWT::ExpiredSignature
        log_and_render_unauthorized("JWT token has expired")
      rescue JWT::DecodeError => e
        log_and_render_unauthorized("JWT Decode Error: #{e.message}\nToken: #{token}")
      end
    else
      log_and_render_unauthorized("Authorization token missing")
    end
  end

  def log_and_render_unauthorized(message)
    Rails.logger.error message
    render json: { errors: message }, status: :unauthorized
  end
  
end