class Api::V1::FriendshipsController < ApplicationController

  before_action :set_user, only: [:index, :show, :create, :destroy]
  before_action :set_friendship, only: [:show, :destroy]

  def index
    @friendships = Friendship.where(user_id: @user.id)
    render json: { friendships: @friendships }, status: :ok
  end

  def show
    if @friendship
      render json: { friendship: @friendship }, status: :ok
    else
      render json: { error: "Friendship not found" }, status: :not_found
    end
  end

  def create
  end

  def update
  end

  def destroy
    @friendship.destroy
    head :no_content
  end

  private

  def set_user
    @user = current_user
  end

  def set_friendship
    @friendship = Friendship.find_by(id: params[:id])
    render json: { error: "Friendship not found" }, status: :not_found unless @friendship
  end

end