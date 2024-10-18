# app/controllers/api/v1/uploads_controller.rb
class API::V1::UploadsController < ApplicationController
  respond_to :json
  before_action :set_user, only: [:create]

  def index
    @photos = Photo.where(user: @user)
    render json: { photos: @photos }, status: :ok
  end

  def create
    # Here, you can handle the uploaded photo
    if params[:photo].present?
      # Assuming you're using Active Storage
      @photo = Photo.new(photo: params[:photo]) # Adjust according to your model
      if @photo.save
        render json: { message: 'Photo uploaded successfully!' }, status: :created
      else
        render json: { errors: @photo.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render json: { error: 'No photo provided' }, status: :unprocessable_entity
    end
  end

private

def set_user
  @user = current_user
end

end
