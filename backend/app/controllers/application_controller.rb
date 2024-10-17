class ApplicationController < ActionController::API

  before_action :configure_permitted_parameters, if: :devise_controller?
  # before_action :authenticate_user!

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: %i[name avatar])
    devise_parameter_sanitizer.permit(:account_update, keys: %i[name avatar])
  end

  rescue_from ActiveRecord::RecordNotFound, with: :not_found_response

  rescue_from JWT::ExpiredSignature, JWT::VerificationError, JWT::DecodeError, with: :invalid_token_response

  private

  def not_found_response(exception)
    render json: { error: exception.message }, status: :not_found
  end

  def invalid_token_response
    render json: { error: 'Invalid or expired token' }, status: :unauthorized
  end

end
