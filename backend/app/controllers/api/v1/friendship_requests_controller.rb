class API::V1::FriendshipRequestsController < ApplicationController

  before_action :set_friendship_request, only: [:accept, :reject]
  before_action :set_user, only: [:index, :show, :create, :accept, :reject]

  def index
    if @user.id
      requests = FriendshipRequest.includes(:sender).where(receiver_id: @user.id)
  
      # Mapea cada solicitud para incluir el sender_handle en la respuesta JSON
      formatted_requests = requests.map do |request|
        {
          id: request.id,
          sender_id: request.sender_id,
          receiver_id: request.receiver_id,
          created_at: request.created_at,
          sender_handle: User.find(request.sender_id).handle
        }
      end
  
      render json: { friendship_requests: formatted_requests }, status: :ok
      Rails.logger.info "Requests: #{formatted_requests.inspect}"
    else
      render json: { error: "User ID is required" }, status: :unprocessable_entity
    end
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

  def accept
    Rails.logger.info "Friendship request: #{@friendship_request.inspect}"
    # Asegúrate de que set_friendship_request se llame antes
    friendship1 = Friendship.find_or_initialize_by(user_id: @friendship_request.receiver_id, friend_id: @friendship_request.sender_id)
    friendship2 = Friendship.find_or_initialize_by(user_id: @friendship_request.sender_id, friend_id: @friendship_request.receiver_id)
    Rails.logger.info "Friendship 1: #{friendship1.inspect}"
    Rails.logger.info "Friendship 2: #{friendship2.inspect}"
    if friendship1.save
      if friendship2.save
        Rails.logger.info "Friendship saved successfully"
        @friendship_request.destroy # Eliminar la solicitud de amistad
        render json: { message: 'Friendship accepted' }, status: :ok
      else
        Rails.logger.error "Failed to save friendship: #{friendship2.errors.full_messages.join(', ')}"
        render json: friendship2.errors, status: :unprocessable_entity
      end
    else
      Rails.logger.error "Failed to save friendship: #{friendship.errors.full_messages.join(', ')}"
      render json: friendship1.errors, status: :unprocessable_entity
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
    @friendship_request = FriendshipRequest.find_by(id: params[:id])
    Rails.logger.info "ID request: #{params[:id]}"
    unless @friendship_request
      render json: { error: 'Friendship request not found' }, status: :not_found
    end
  end
  

  def friendship_request_params
    params.require(:friendship_request).permit(:sender_id, :receiver_id)
  end

end
