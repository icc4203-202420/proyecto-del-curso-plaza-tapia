Rails.application.routes.draw do
  # devise_for :users
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  get 'current_user', to: 'current_user#index'
  
  devise_for :users, path: '', path_names: {
    sign_in: 'api/v1/login',
    sign_out: 'api/v1/logout',
    registration: 'api/v1/signup'
  },
  controllers: {
    sessions: 'api/v1/sessions',
    registrations: 'api/v1/registrations'
  }

  # Health check
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      resources :bars do
        member do
          get 'events', to: 'bars#events'
        end
      end

      resources :beers do
        member do
          get 'bars', to: 'beers#bars'
          get 'reviews', to: 'beers#reviews'
        end
      end

      resources :events do
        member do
          get 'attendances', to: 'attendances#index' # Route to get users attending the event
          post 'attendances', to: 'attendances#create' # Route to create attendance
        end
      end

      resources :users do
        resources :reviews, only: [:index]
        member do
          get :friendships
          post :friendships, to: 'users#create_friendship'
        end
      end

      resources :reviews, only: [:index, :show, :create, :update, :destroy]
      resources :attendances, only: [:create] # Route for creating attendance
    end
  end
end