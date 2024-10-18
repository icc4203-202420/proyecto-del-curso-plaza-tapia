class API::V1::BrandsController < ApplicationController
  include ImageProcessing
  include Authenticable

  respond_to :json
  before_action :verify_jwt_token, only: [:create, :update, :destroy]

  def index
    brands = Brand.all
    render json: brands
  end

  def show
    brand = Brand.find(params[:id])
    render json: brand
  end

  def create
    brand = Brand.new(brand_params)
    if brand.save
      render json: brand, status: :created
    else
      render json: brand.errors, status: :unprocessable_entity
    end
  end

  def update
    brand = Brand.find(params[:id])
    if brand.update(brand_params)
      render json: brand
    else
      render json: brand.errors, status: :unprocessable_entity
    end
  end

  def destroy
    brand = Brand.find(params[:id])
    brand.destroy
    head :no_content
  end

  private

  def brand_params
    params.require(:brand).permit(:name, :brewery_id) # Agrega los atributos que necesites
  end

  def verify_jwt_token
    authenticate_user!
    head :unauthorized unless current_user
  end 

end