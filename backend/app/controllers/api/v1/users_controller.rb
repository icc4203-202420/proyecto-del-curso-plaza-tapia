class API::V1::UsersController < ApplicationController
  include Authenticable

  respond_to :json
  before_action :set_user, only: [:index, :update, :create_friendship]
  before_action :verify_jwt_token, only: [:update, :destroy, :create_friendship]
  skip_before_action :authorize_request, only: [:create]
  
  def index
    @users = User.includes(:reviews, :address).where.not(id: @user.id)
    friendship = Friendship.find_by(user_id: @user.id, friend_id: params[:id]).present?
    render json: {
      users: @users.as_json(include: [:reviews, :address]),
      friendship: friendship
      },
      status: :ok
  end

  def show
    @user = User.find(params[:id])
    render json: { user: @user.as_json(include: [:reviews, :address]) }, status: :ok
  end

  def create
    if user_params.dig(:address_attributes, :country_name)
      country = Country.find_or_create_by(name: user_params[:address_attributes][:country_name])
      if country
        params[:user][:address_attributes][:country_id] = country.id
      else
        return render json: { error: "Invalid country name" }, status: :unprocessable_entity
      end
      params[:user][:address_attributes].delete(:country_name)
    end
  
    @user = User.new(user_params)
  
    if @user.save
      render json: @user.id, status: :ok
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  def update
    if @user.update(user_params)
      render :show, status: :ok, location: api_v1_users_path(@user)
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  def friendships
    user = User.find(params[:id])
    friend_ids = Friendship.where(user_id: user.id).pluck(:friend_id)
    @friends = User.where(id: friend_ids)

    render json: { friends: @friends }, status: :ok
  end

  def create_friendship
    friend = User.find(params[:friend_id])
    if @user.friendships.create(friend_id: friend.id)
      render json: { message: 'Friendship created successfully.' }, status: :ok
    else
      render json: { error: 'Error creating friendship.' }, status: :unprocessable_entity
    end
  end

  def destroy
    
  end

  def token
    user = User.find(params[:id])
    if user.update_notification_token(params[:token])
      render json: { message: 'Token updated' } # Asegúrate de que 'notification_token' sea el atributo correcto
    else
      render json: { error: 'Failed to update token' }, status: :not_found
    end
  end

  private

  def set_user
    @user = current_user
  end

  def user_params
    params.require(:user).permit(
      :first_name, :last_name, :email, :handle, :password, :password_confirmation,
      address_attributes: [:line1, :line2, :city, :country_name]
    )
  end
end