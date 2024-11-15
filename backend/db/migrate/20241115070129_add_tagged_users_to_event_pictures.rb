class AddTaggedUsersToEventPictures < ActiveRecord::Migration[7.1]
  def change
    add_column :event_pictures, :tagged_users, :json, default: []
  end
end