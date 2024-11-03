class API::V1::FriendshipRequestsController < ApplicationController

  before_action :set_friendship_request, only: [:accept, :reject]
  before_action :set_user, only: [:index, :show, :create, :accept, :reject]

  def index
    requests = @user.friendship_requests
    render json: { friendship_requests: requests }, status: :ok
  end

  def show
    receiver_id = params[:receiver_id].to_i
    @friendship_request = FriendshipRequest.find_by(sender_id: @user.id, receiver_id: receiver_id)
    if @friendship_request
      render json: {request_exists: true, friendship_request: @friendship_request}, status: :ok
    else
      render json: {request_exists: false}, status: :ok
    end
  end

  # POST /friendship_requests
  def create
    Rails.logger.info "Received params: #{params.inspect}"
    @friendship_request = FriendshipRequest.new(friendship_request_params)
    @friendship_request.sender_id = @user.id
    if @friendship_request.receiver_id.nil?
      @friendship_request.receiver_id = params[:friendship_request][:receiver_id]
    end


    if @friendship_request.save
      render json: @friendship_request, status: :created
    else
      render json: @friendship_request.errors, status: :unprocessable_entity
    end
  end

  def update
  end

  def destroy
  end

  # PATCH /friendship_requests/:id/accept
  def accept
    # Create the friendship if not already exists
    friendship = Friendship.find_or_initialize_by(user_id: @friendship_request.receiver_id, friend_id: @friendship_request.sender_id)

    if friendship.save
      @friendship_request.destroy # Eliminar la solicitud de amistad
      render json: { message: 'Friendship accepted' }, status: :ok
    else
      render json: friendship.errors, status: :unprocessable_entity
    end
  end

  # DELETE /friendship_requests/:id/reject
  def reject
    @friendship_request.destroy
    render json: { message: 'Friendship request rejected' }, status: :ok
  end

  private

  def set_user
    @user = current_user
  end

  def set_friendship_request
    @friendship_request = FriendshipRequest.find(params[:id])
  end

  def friendship_request_params
    params.require(:friendship_request).permit(:sender_id, :receiver_id)
  end

end
