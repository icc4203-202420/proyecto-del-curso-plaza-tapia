class API::V1::SessionsController < Devise::SessionsController
  respond_to :json
  skip_before_action :verify_signed_out_user, only: :destroy
  before_action :restrict_access_to_post, only: [:create]
  before_action :restrict_access_to_get, only: [:new]

  private

  def restrict_access_to_get
    if request.get?
      head :method_not_allowed
    end
  end

  def restrict_access_to_post
    render json: { error: 'Method not allowed' }, status: :method_not_allowed unless request.post?
  end

  def respond_with(current_user, _opts = {})
    token = current_user.generate_jwt
    render json: {
      status: { code: 200, message: 'Logged in successfully.' },
      token: token,
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
