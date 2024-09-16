require 'factory_bot_rails'

# Ensure the existence of the ReviewCounter record
ReviewCounter.first_or_create!(count: 0)

if Rails.env.development?

  # Create countries
  countries = FactoryBot.create_list(:country, 5)

  # Create breweries with brands and beers, ensuring associations with countries
  countries.each do |country|
    FactoryBot.create(:brewery_with_brands_with_beers, countries: [country])
  end

  # Create users with associated addresses
  users = FactoryBot.create_list(:user, 10) do |user|
    user.address.update(country: countries.sample)
  end

  # Create bars with addresses and associated beers
  bars = FactoryBot.create_list(:bar, 5) do |bar|
    bar.address.update(country: countries.sample)
    bar.beers << Beer.all.sample(rand(1..3))
  end

  # Create events associated with bars (two per bar)
  events = bars.flat_map do |bar|
    Array.new(2) do |i|
      Event.create!(
        name: "#{bar.name} event #{i + 1}",
        description: "Event at #{bar.name}",
        date: Faker::Time.between_dates(from: Date.today, to: Date.today + 30, period: :day),
        bar: bar
      )
    end
  end

  # Create friendships between users
  users.combination(2).to_a.sample(5).each do |user_pair|
    FactoryBot.create(:friendship, user: user_pair[0], friend: user_pair[1], bar: bars.sample)
  end

  # Create attendances of users to events
  users.each do |user|
    events.sample(rand(1..3)).each do |event|
      FactoryBot.create(:attendance, user: user, event: event, checked_in: [true, false].sample)
    end
  end

    # Create users with associated addresses
  users = FactoryBot.create_list(:user, 10) do |user|
    user.address.update(country: countries.sample)
  end

  users.each do |user|
    # Select 2 random users to be friends with the current user (excluding themselves)
    friends = users.reject { |u| u == user }.sample(2)

    friends.each do |friend|
      # Check if the friendship already exists
      unless Friendship.exists?(user: user, friend: friend) || Friendship.exists?(user: friend, friend: user)
        FactoryBot.create(:friendship, user: user, friend: friend, bar: bars.sample)
        # Optionally, create the reverse friendship if friendships are not bidirectional by default
        FactoryBot.create(:friendship, user: friend, friend: user, bar: bars.sample)
      end
    end
  end

  # Ensure every beer has at least 2 reviews
  Beer.all.each do |beer|
    # Select 2 random users to write reviews for the current beer
    users.sample(2).each do |user|
      FactoryBot.create(:review, beer: beer, user: user)  # beer and user are passed explicitly
    end
  end

end