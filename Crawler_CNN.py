from bs4 import BeautifulSoup
import urllib.request
import json
from flask import Flask, render_template, request
import tweepy
from newspaper import Article
import os
import time
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from nltk import tokenize
from rake_nltk import Rake
from flask.json import jsonify
import re
from nltk.corpus import stopwords
from nltk.tokenize import wordpunct_tokenize,word_tokenize
from textblob import TextBlob
from collections import Counter

stop_words = set(stopwords.words('english'))

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
	#app = Flask(setup["app_name"])
	return setup

setup = init()
#Setup Application
app=Flask("COVFEFE")


#Setup Twitter Connection
# OAuth process, using the keys and tokens
auth = tweepy.OAuthHandler(setup["twitter_consumer_key"], setup["twitter_consumer_secret"])
auth.set_access_token(setup["twitter_access_token"], setup["twitter_access_token_secret"])

# Creation of the actual interface, using authentication
twitter_api = tweepy.API(auth)

news_api_url=""

@app.route("/")
def main():    									
	tweetList=[]
	for current_tweet in tweepy.Cursor(twitter_api.user_timeline,
									screen_name='@realDonaldTrump',
									tweet_mode="extended").items(25):
	    if 'retweeted_status' in dir(current_tweet):
	    	tweetList.append(current_tweet.retweeted_status.full_text)
	    else:
	    	tweetList.append(current_tweet.full_text)
	
	return render_template('index.html')

def setup_news_api(domain_list,keyword_list):
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



def calc_sentiment(paragraph):
	if len(paragraph) == 0:
		return "neu"
	else:
		sentences = tokenize.sent_tokenize(paragraph)	
		sid = SentimentIntensityAnalyzer()
		pos_sentiment=neg_sentiment=neu_sentiment=0
		for sentence in sentences:
			ss = sid.polarity_scores(sentence)
			max_sentiment = max(ss['neg'],ss['pos'],ss['neu'])
			if ss['pos'] == max_sentiment:
				pos_sentiment+=1
			elif ss['neg'] == max_sentiment:
				neg_sentiment+=1
			elif ss['neu'] == max_sentiment:
				neu_sentiment+=1				
		if neg_sentiment == max(neg_sentiment,pos_sentiment,neu_sentiment):
			return "neg"
		elif pos_sentiment == max(neg_sentiment,pos_sentiment,neu_sentiment):
			return "pos"
		else:
			return "neu"


@app.route("/twitter_analysis", methods=["GET", "POST"])
def get_twitter_analysis():
	username='@realDonaldTrump'					
	try:
		if request.method == "GET":
			try:
				username='@'+request.args["username"]
			except:
				print("Exception in username")
	except:
		print("Exception in request reading")

	tweetList=[]
	for current_tweet in tweepy.Cursor(twitter_api.user_timeline,
									screen_name=username,
									tweet_mode="extended").items(25):
	    if 'retweeted_status' in dir(current_tweet):
	    	tweetList.append(current_tweet.retweeted_status.full_text)
	    else:
	    	tweetList.append(current_tweet.full_text)
	senti_count={
	"pos":0,
	"neg":0,
	"neu":0
	}    	
	for tweet in tweetList:    	
		tweet_sentiment = calc_sentiment(tweet)
		senti_count[tweet_sentiment]+=1
	twitter_sentiment=max(senti_count, key=senti_count.get)
	rake_kw = Rake()
	twitter_data=""
	for tweet in tweetList:
		twitter_data+=tweet
		twitter_data+=" "
	clean_twitter_data = ' '.join(re.sub("(@[A-Za-z0-9]+)|([^0-9A-Za-z \t])|(\w+:\/\/\S+)", " ", twitter_data).split())
	no_stop_twitter_data = [i for i in word_tokenize(clean_twitter_data.lower()) if i not in stop_words]
	return jsonify({'twitter_sentiment':senti_count,
					'clean_twitter_data': ' '.join(no_stop_twitter_data)})
	


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
	   			news_json[news_count]["sentiment"]=calc_sentiment(str(current_news_article.text))
	   			break
   			except:
   				count+=1
   				pass
   		if count>10:
   				news_json[news_count]["full_text"]=news_json[news_count]["description"]
	   			news_json[news_count]["keywords"]=news_json[news_count]["title"].split(" ")
	   			news_json[news_count]["summary"]=news_json[news_count]["description"]
	   			news_json[news_count]["sentiment"]="neu"			
	return news_json


def refresh_app():
   	#Set connection to news
	raw_news=setup_news_api([setup["news_search_domains"]],[setup["news_search_keyword"]])
	news_json = raw_news["articles"]
	full_news_json = build_news_info(news_json)
   	#return app


    	
if __name__ == "__main__":
	refresh_app()
	app.run()



