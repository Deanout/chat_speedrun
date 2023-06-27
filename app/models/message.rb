class Message < ApplicationRecord
  belongs_to :user
  validates :body, presence: true, length: { maximum: 1000 }

  after_create_commit :broadcast_create
  after_destroy_commit :broadcast_destroy

  def broadcast_create
    # Broadcast to all users the message partial
    broadcast_append_to "messages",
      partial: "messages/message",
      locals: { message: self, display_controls: false }

    # Broadcast the user controls to: message_id_user_id_controls
    broadcast_replace_to "user_#{self.user.id}",
      target: "message_#{self.id}_controls",
      partial: "messages/controls",
      locals: { message: self }
  end

  def broadcast_destroy
    # Broadcast to all users the message partial
    broadcast_remove_to "messages"
  end
end
