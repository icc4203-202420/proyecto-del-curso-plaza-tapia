class CreateFriendshipRequests < ActiveRecord::Migration[7.1]
  def change
    create_table :friendship_requests do |t|
      t.integer :sender_id, null: false
      t.integer :receiver_id, null: false
      t.timestamps
    end

    add_index :friendship_requests, [:sender_id, :receiver_id], unique: true
    add_foreign_key :friendship_requests, :users, column: :sender_id
    add_foreign_key :friendship_requests, :users, column: :receiver_id
  end
end