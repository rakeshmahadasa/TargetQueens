from bs4 import BeautifulSoup
import urllib.request
import json
from flask import Flask, render_template
import tweepy
from newspaper import Article
import os
import time

app=Flask(__name__)
def init():	
	#Read all the application setup variables
	setup={}
	with open('static/env.txt') as env_file:
		for env_var in env_file:
			key,value=env_var.split("=")
			setup[key]=value.strip()
	#application setup details
	print(setup)
	#for debugging on console
	for key,value in setup.items():
		print(key," = ",value)	
	app = Flask(setup["app_name"])
	return [app,setup]

def setup_twitter_conn(setup):
	# OAuth process, using the keys and tokens
	auth = tweepy.OAuthHandler(setup["twitter_consumer_key"], setup["twitter_consumer_secret"])
	auth.set_access_token(setup["twitter_access_token"], setup["twitter_access_token_secret"])

	# Creation of the actual interface, using authentication
	twitter_api = tweepy.API(auth)
	return twitter_api

def setup_news_api(setup,domain_list,keyword_list):
	#Build the api URL to get the news articles related to keyword from specified news channels
	#Example API URL : https://newsapi.org/v2/everything?q=trump&domains=cnn.com&apiKey=857bd6cbdc8e41aca5f81de4f0d47f05
	domain_list_str = ""
	keyword_list_str = ""
	for domain in domain_list:
		domain_list_str+=domain
		domain_list_str+=","
	domain_list_str = domain_list_str[0:len(domain_list_str)-1]

	for keyword in keyword_list:
		keyword_list_str+=keyword
		keyword_list_str+=","
	keyword_list_str = keyword_list_str[0:len(keyword_list_str)-1]
		
	api_url = \
			setup["news_root_url"] + \
			"?q=" + keyword_list_str + \
			"&domains="+ domain_list_str + \
			"&apiKey="+setup["news_api_key"]
	print(api_url)
	response = urllib.request.urlopen(api_url)
	raw_news = json.load(response)
	return raw_news				


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


def download_website_thread():

#Lets do something creative
#Extract Keywords
#Build Summary
def build_news_info(news_json):

	for news_count in range(0,len(news_json)):
   		current_news_article=Article(news_json[news_count]["url"])
   		count=1
   		##Some time download take time. So lets give it some time
   		##Im going to parallelize the download process after basic functionalities
   		while count<=10:
   			try:
	   			current_news_article.download()
	   			current_news_article.parse()
	   			news_json[news_count]["full_text"]=current_news_article.text
	   			current_news_article.nlp()
	   			news_json[news_count]["keywords"]=current_news_article.keywords
	   			news_json[news_count]["summary"]=current_news_article.summary
	   			break
   			except:
   				count+=1
   				pass	
	return news_json

def refresh_app():
   	#Setup application details and TrackIt app
   	app,setup=init()
   	#Set connection to twitter
   	twitter_api=setup_twitter_conn(setup)
   	#Set connection to news
   	raw_news=setup_news_api(setup,[setup["news_search_domains"]],[setup["news_search_keyword"]])
   	print("No of News Articles : " + str(len(raw_news["articles"])))	
   	news_json = raw_news["articles"]
   	full_news_json = build_news_info(news_json)
   	return app


    	
if __name__ == "__main__":
	app=refresh_app()
	#app.run()



