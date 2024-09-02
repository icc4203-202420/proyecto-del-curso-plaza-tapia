class Friendship < ApplicationRecord
  belongs_to :user
  belongs_to :friend, class_name: 'User'
  belongs_to :bar, optional: true
  # validates :user_and_friend_are_different, on: :create

  private

  def user_and_friend_are_different
    if user_id == friend_id
      errors.add(:friend_id, "You can't be friends with yourself.")
    end
  end
end
