class FeedChannel < ApplicationCable::Channel
  def subscribed
    # `user_id` se pasa cuando el cliente se conecta
    user = User.find(params[:user_id])

    # Nos aseguramos de que solo los amigos puedan recibir los mensajes.
    # Si un amigo se suscribe, se incluirá en el feed.
    stream_for user

    # Enviar todas las reseñas que son de sus amigos
    user.friends.each do |friend|
      stream_for friend
    end
  end

  def unsubscribed
    # Cleanup when channel is unsubscribed
  end
end
