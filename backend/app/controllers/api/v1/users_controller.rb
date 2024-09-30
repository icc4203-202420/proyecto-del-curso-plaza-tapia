class API::V1::UsersController < ApplicationController
  include Authenticable

  respond_to :json
  before_action :set_user, only: [:show, :update, :friendships, :create_friendship]
  before_action :verify_jwt_token, only: [:update, :destroy, :create_friendship]
  skip_before_action :authorize_request, only: [:create]
  
  def index
    @users = User.includes(:reviews, :address).all
    render json: { users: @users.as_json(include: [:reviews, :address]) }, status: :ok
  end

  def show
    render json: { user: @user.as_json(include: [:reviews, :address]) }, status: :ok
  end

  def create
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
    friendships = @user.friendships.map do |friendship|
      User.find(friendship.friend_id)
    end
    render json: friendships, status: :ok
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

  private

  def set_user
    @user = User.find(params[:id])
  end

  def user_params
    params.fetch(:user, {}).
        permit(:id, :first_name, :last_name, :email, :age,
            { address_attributes: [:id, :line1, :line2, :city, :country, :country_id, 
              country_attributes: [:id, :name]],
              reviews_attributes: [:id, :text, :rating, :beer_id, :_destroy]
            })
  end
end