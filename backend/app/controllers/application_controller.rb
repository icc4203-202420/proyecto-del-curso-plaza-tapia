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
        @current_user = User.find(decoded['user_id'])
        Rails.logger.info "Current user: #{@current_user.inspect}"
      rescue ActiveRecord::RecordNotFound
        Rails.logger.error "User not found: #{decoded['user_id']}"
        render json: { errors: 'User not found' }, status: :unauthorized
      rescue JWT::ExpiredSignature
        Rails.logger.error "JWT token has expired"
        render json: { errors: 'Token has expired' }, status: :unauthorized
      rescue JWT::DecodeError => e
        Rails.logger.error "JWT Decode Error\n Message: #{e.message}\n Token: #{token}\n Decoded token: #{decoded}\n Current user: #{@current_user.inspect}"
        render json: { errors: 'Invalid token' }, status: :unauthorized
      end
    else
      Rails.logger.error "Authorization token missing"
      render json: { errors: 'Authorization token missing' }, status: :unauthorized
    end
  end  
  
end