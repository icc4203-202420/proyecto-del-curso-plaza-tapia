class DeleteExpiredFriendshipRequestsJob < ApplicationJob
  queue_as :default

  def perform
    FriendshipRequest.where('created_at <= ?', 24.hours.ago).destroy_all
  end
end
