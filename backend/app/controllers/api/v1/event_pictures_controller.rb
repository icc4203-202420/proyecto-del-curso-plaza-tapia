# app/controllers/api/v1/event_pictures_controller.rb
module API
  module V1
    class EventPicturesController < ApplicationController
      before_action :set_user, only: [:create]
      before_action :set_event, only: [:create]

      def create
        @event_picture = EventPicture.new(event_picture_params)
        @event_picture.user = current_user # Asignar el usuario actual
        # Si estás utilizando un sistema para almacenar imágenes, como Active Storage, debes manejarlo aquí.
        
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
        def event_picture_params
          params.require(:event_picture).permit(:description, :photo, :event_id)
        end
        
      end
    end
  end
end
