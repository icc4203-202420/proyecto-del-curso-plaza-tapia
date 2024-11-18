class API::V1::AttendancesController < ApplicationController
    before_action :set_event, only: [:index, :create]
    before_action :set_user

  
    # GET /api/v1/events/:id/attendances
    def index
      attendances = @event.attendances.includes(:user)
      users = attendances.map(&:user)
      render json: users, status: :ok
    end

    def create
      attendance = @event.attendances.new(user_id: @user.id, checked_in: true)
      if attendance.save
        render json: { message: 'Successfully checked in.' }, status: :created
      else
        render json: { error: 'Could not check in.', details: attendance.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def friends_attendances
      friends = @user.friends
      Rails.logger.info "Friends: #{friends.pluck(:id)}"
      attendances = Attendance.where(user: friends).order(created_at: :desc)
      Rails.logger.info "Attendances: #{attendances.pluck(:id)}"
      attendances_complete = attendances.map do |attendance|
        attendance.as_json.merge(
          id: attendance.id,
          handle: attendance.user.handle,
          event_name: attendance.event.name,
          bar: attendance.event.bar.name,
        )
        end
      Rails.logger.info "Sorted attendances: #{attendances_complete.pluck(:id)}"
      render json: { attendances: attendances_complete }, status: :ok
    end
    
    private

    def set_user
      @user = current_user
    end
  
    def set_event
      @event = Event.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      render json: { error: 'Event not found' }, status: :not_found
    end
  end

  