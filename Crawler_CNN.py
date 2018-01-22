from bs4 import BeautifulSoup
import urllib2
import json
from flask import Flask, render_template
import tweepy


app = Flask(__name__)


url="https://newsapi.org/v2/everything?q=trump&domains=cnn.com&apiKey=857bd6cbdc8e41aca5f81de4f0d47f05"
response = urllib2.urlopen(url)
webContent = json.load(response)

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


@app.route("/")
def main():    									
	tweetList=[]
	for current_tweet in tweepy.Cursor(api.user_timeline,
									screen_name='@realDonaldTrump',
									count=3,
									tweet_mode="extended").items(25):
	    if 'retweeted_status' in dir(current_tweet):
	    	tweetList.append(current_tweet.retweeted_status.full_text)
	    else:
	    	tweetList.append(current_tweet.full_text)
	
	return render_template('index.html',NewsArticlesJSON=webContent,
    									ArticlesCount=len(webContent["articles"]),
    									TweetList=tweetList,
    									TweetCount=len(tweetList))
    	


if __name__ == "__main__":
    app.run()    







print(webContent["status"])



