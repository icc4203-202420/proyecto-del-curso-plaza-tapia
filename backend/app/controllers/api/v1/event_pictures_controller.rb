class EventPicturesController < ApplicationController
  def create
    @event_picture = EventPicture.new(event_picture_params)
    @event_picture.user = current_user # Asigna el usuario que sube la imagen
    if @event_picture.save
      redirect_to @event, notice: 'Imagen subida con éxito.'
    else
      render :new, alert: 'Error al subir la imagen.'
    end
  end

  private

  def event_picture_params
    params.require(:event_picture).permit(:description, :image, :event_id)
  end
end