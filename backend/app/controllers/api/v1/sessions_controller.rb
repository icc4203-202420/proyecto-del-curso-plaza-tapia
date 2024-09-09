class API::V1::SessionsController < Devise::SessionsController
  respond_to :json
  skip_before_action :verify_signed_out_user, only: :destroy

  private

  def respond_with(current_user, _opts = {})
    token = current_user.generate_jwt
    render json: {
      status: { code: 200, message: 'Logged in successfully.' },
      token: token,
      user: UserSerializer.new(current_user).serializable_hash[:data][:attributes]
    }, status: :ok
  end

  def respond_to_on_destroy
    if current_user
      render json: {
        status: 200,
        message: "Logged out successfully."
      }, status: :ok
    else
      render json: {
        status: 401,
        message: "Couldn't find an active session."
      }, status: :unauthorized
    end
  end
end
