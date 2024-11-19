class API::V1::EventsController < ApplicationController
  include ImageProcessing
  include Authenticable

  respond_to :json
  before_action :set_user, only: [:attendee]
  before_action :set_event, only: [:show, :update, :destroy]
  before_action :verify_jwt_token, only: [:create, :update, :destroy]

  def index
    @events = Event.all
    render json: { Events: @events }, status: :ok
  end

  def show
    event_photos = @event.event_pictures.map do |event_picture|
      {
        id: event_picture.id,
        description: event_picture.description,
        url: event_picture.photo.attached? ? url_for(event_picture.photo) : nil,
        tagged_users: event_picture.tagged_users
      }
    end

    if @event.flyer.attached?
      render json: @event.as_json.merge({
        image_url: url_for(@event.flyer),
        thumbnail_url: url_for(@event.thumbnail),
        photos: event_photos
      }), status: :ok
    else
      render json: { event: @event.as_json, photos: event_photos }, status: :ok     
    end
  end

  def create
    @event = Event.new(event_params.except(:image_base64))
    handle_image_attachment if event_params[:image_base64]
    if @event.save
      render json: { event: @event, message: 'Event created successfully.' }, status: :ok
    else
      render json: @event.errors, status: :unprocessable_entity
    end 
  end

  def update
    handle_image_attachment if event_params[:image_base64]
    if @event.update(event_params.except(:image_base64))
      render json: { event: @event, message: 'Event updated successfully.' }, status: :ok
    else
      render json: @event.errors, status: :unprocessable_entity
    end
  end

  def destroy
    if @event.destroy
      render json: { message: 'Event successfully deleted.' }, status: :no_content
    else
      render json: @event.errors, status: :unprocessable_entity
    end
  end

  def attendee
    event = Event.find(params[:id])
    attendee = Attendance.where(event_id: event.id, user_id: @user.id).present?
    render json: { attendee: attendee }, status: :ok
  end

  private

  def set_user
    @user = current_user
  end
  

  def set_event
    @event = Event.find_by(id: params[:id])
    render json: { error: 'Event not found' }, status: :not_found unless @event
  end

  def event_params
    params.require(:event).permit(
      :name, :description, :date, :image_base64, :start_date, :end_date, :bar_id
    )
  end

  def handle_image_attachment
    decoded_image = decode_image(event_params[:image_base64])
    if decoded_image
      @event.flyer.attach(io: decoded_image[:io], filename: decoded_image[:filename], content_type: decoded_image[:content_type])
    else
      render json: { error: 'Invalid image' }, status: :unprocessable_entity
    end
  end  
end