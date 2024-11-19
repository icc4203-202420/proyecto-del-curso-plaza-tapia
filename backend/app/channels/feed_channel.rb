class FeedChannel < ApplicationCable::Channel

  def subscribed
    @user = User.find(params[:user_id])
    stream_for @user
    @user.friends.each do |friend|
      stream_for friend
    end
  end

  def unsubscribed
    stop_all_streams
  end

end
