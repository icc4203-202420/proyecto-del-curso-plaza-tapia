module API
  module V1
    class EventPicturesController < ApplicationController
      before_action :set_user
      before_action :set_event

      def create
        @event_picture = @event.event_pictures.new(event_picture_params.except(:photo))
        @event_picture.user = @user
        
        if @event_picture.save
          # Adjunta y procesa la imagen utilizando Active Storage
          @event_picture.photo.attach(params[:event_picture][:photo])
          
          if @event_picture.photo.attached?
            # Genera la URL de la imagen procesada
            image_url = url_for(@event_picture.photo)
      
            render json: {
              id: @event_picture.id,
              description: @event_picture.description,
              url: image_url,
              tagged_users: @event_picture.tagged_users
            }, status: :created
          else
            render json: { error: 'Photo attachment failed' }, status: :unprocessable_entity
          end
        else
          render json: { error: @event_picture.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def set_user
        @user = current_user
      end

      def set_event
        @event = Event.find(params[:id])  # Busca el evento según el ID
      end

      def event_picture_params
        params.require(:event_picture).permit(:description, :photo, tagged_users: [])
      end
    end
  end
end