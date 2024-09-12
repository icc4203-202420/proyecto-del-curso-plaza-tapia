class API::V1::AttendancesController < ApplicationController
    before_action :set_event
  
    # GET /api/v1/events/:id/attendances
    def index
      attendances = @event.attendances.includes(:user)
      users = attendances.map(&:user)
      render json: users, status: :ok
    end
  
    private
  
    def set_event
      @event = Event.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      render json: { error: 'Event not found' }, status: :not_found
    end
  end