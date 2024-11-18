module API
  module V1
    class EventPicturesController < ApplicationController
      before_action :set_user
      before_action :set_event

      def create
        Rails.logger.info("Raw params: #{params.inspect}") # Log raw params for debugging
      
        # Parse `tagged_users` if it is a string
        if params[:event_picture][:tagged_users].is_a?(String)
          begin
            params[:event_picture][:tagged_users] = JSON.parse(params[:event_picture][:tagged_users])
          rescue JSON::ParserError => e
            Rails.logger.error("Failed to parse tagged_users: #{e.message}")
            return render json: { error: "Invalid format for tagged_users" }, status: :unprocessable_entity
          end
        end
      
        # Use strong parameters after parsing
        @event_picture = @event.event_pictures.new(event_picture_params.except(:photo))
        @event_picture.user = @user
        @event_picture.photo.attach(params[:event_picture][:photo])
      
        if @event_picture.save
          Rails.logger.info("Saved tagged_users: #{@event_picture.tagged_users.inspect}")
          render json: {
            id: @event_picture.id,
            description: @event_picture.description,
            url: url_for(@event_picture.photo),
            tagged_users: @event_picture.tagged_users
          }, status: :created
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

      def event_picture_params
        params.require(:event_picture).permit(:description, :photo, tagged_users: [])
      end
    end
  end
end