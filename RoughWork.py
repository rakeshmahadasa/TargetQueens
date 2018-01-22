import tweepy

# Consumer keys and access tokens, used for OAuth
consumer_key = 'yWj68zD1NaPUoswXq8HGsaDOm'
consumer_secret = 'e8fl2nAWuXS5rpYEhKdrms4kSoBRwedp8jyPkF2mMy9Xo5cQcu'
access_token = '923138712686358530-cdB79uQhno9nTyRkEseO16fpYnEZTV0'
access_token_secret = 'FSShyZkNX0ovqUIanR5OKw8OgToVuVaNBE1LDyzJZ1eux'

# OAuth process, using the keys and tokens
auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)

# Creation of the actual interface, using authentication
api = tweepy.API(auth)

for current_tweet in tweepy.Cursor(api.user_timeline,
								screen_name='@realDonaldTrump',
								count=3,
								tweet_mode="extended").items(3):
    #print status._json
    if 'retweeted_status' in dir(current_tweet):
    	tweet_text=current_tweet.retweeted_status.full_text
    else:
    	tweet_text=current_tweet.full_text
    print(tweet_text)	

