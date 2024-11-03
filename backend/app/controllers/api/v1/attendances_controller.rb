class API::V1::AttendancesController < ApplicationController
    before_action :set_event

  
    # GET /api/v1/events/:id/attendances
    def index
      attendances = @event.attendances.includes(:user)
      users = attendances.map(&:user)
      render json: users, status: :ok
    end

    def create
      attendance = @event.attendances.new(user_id: @current_user.id, checked_in: true)
    
      if attendance.save
        render json: { message: 'Successfully checked in.' }, status: :created
      else
        render json: { error: 'Could not check in.', details: attendance.errors.full_messages }, status: :unprocessable_entity
      end
    end
    
    private
  
    def set_event
      @event = Event.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      render json: { error: 'Event not found' }, status: :not_found
    end
  end

  