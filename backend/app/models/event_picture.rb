class EventPicture < ApplicationRecord
  belongs_to :event
  belongs_to :user

  has_one_attached :photo

  validate :validate_tagged_users

  private

  def validate_tagged_users
    unless tagged_users.is_a?(Array) && tagged_users.all? { |id| id.is_a?(Integer) }
      errors.add(:tagged_users, 'must be an array of user IDs')
    end
  end
end
