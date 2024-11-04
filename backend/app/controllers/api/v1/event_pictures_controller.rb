# app/controllers/api/v1/event_pictures_controller.rb
module API
  module V1
    class EventPicturesController < ApplicationController
      before_action :set_user, only: [:create]
      before_action :set_event, only: [:create]

      def create
        @event_picture = @event.event_pictures.new(event_picture_params)
        @event_picture.user = @user

        if @event_picture.save
          render json: @event_picture, status: :created
        else
          render json: { error: @event_picture.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def set_user
        @user = current_user
      end

      def set_event
        @event = Event.find(params[:event_picture][:event_id])
      end

      def event_picture_params
        params.require(:event_picture).permit(:description, :image)  # Permite el campo `image`
      end
    end
  end
end