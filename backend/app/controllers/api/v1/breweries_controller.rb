class API::V1::BreweriesController < ApplicationController
  include ImageProcessing
  include Authenticable

  respond_to :json
  before_action :verify_jwt_token, only: [:create, :update, :destroy]

  def index
    breweries = Brewery.all
    render json: breweries
  end

  def show
    brewery = Brewery.find(params[:id])
    render json: brewery
  end

  def create
    brewery = Brewery.new(brewery_params)
    if brewery.save
      render json: brewery, status: :created
    else
      render json: brewery.errors, status: :unprocessable_entity
    end
  end

  def update
    brewery = Brewery.find(params[:id])
    if brewery.update(brewery_params)
      render json: brewery
    else
      render json: brewery.errors, status: :unprocessable_entity
    end
  end

  def destroy
    brewery = Brewery.find(params[:id])
    brewery.destroy
    head :no_content
  end

  private

  def brewery_params
    params.require(:brewery).permit(:name, :brewery_id) # Agrega los atributos que necesites
  end

  def verify_jwt_token
    authenticate_user!
    head :unauthorized unless current_user
  end 

end