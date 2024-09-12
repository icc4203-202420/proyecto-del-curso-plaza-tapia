require 'json_web_token'

class ApplicationController < ActionController::API
  before_action :authorize_request
  attr_reader :current_user

  protected

  def authorize_request
    auth_header = request.headers['Authorization']
    
    if auth_header.present?
      token = auth_header.split(' ').last if auth_header.present?
      begin
        decoded = JsonWebToken.decode(token)
        @current_user = User.find(decoded[:user_id]) if decoded
        Rails.logger.info "Current user: #{@current_user.inspect}"
      rescue ActiveRecord::RecordNotFound, JWT::DecodeError => e
        render json: { errors: e.message }, status: :unauthorized
      end
    else
      render json: { errors: 'Authorization token missing' }, status: :unauthorized
    end
  end
  
end