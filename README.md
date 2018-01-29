## COVFEFE
##### COVFEFE is a web application to track the trending news about any topic and twitter feed of influential persons. This application also helps the users to find out the keywords and sentiment in the news articles as well as the tweets of the person, the user searched for.

*This is part of the assignment by Dr. Hassan and Dr. Cor-Paul*

**Tech Stack :** Python3 Libraries, [Flask](flask.pocoo.org/docs/0.12/), HTML, Javascript, Jquery, [HighCharts](highcharts.com/), [Twitter API](https://developer.twitter.com), [News Api Org](https://newsapi.org/docs)


| Requirements        | Deliverables | 
|:-------------:|:-------------:|
| A crawler that crawls the latest 25 articles about Trump from CNN.com and his latest 25 tweets      | A API to search about **any** trending topic not just Trump |
| A simple website that displays the titles of the crawled information      | An option to configure the news from **CNN, NYTimes, WS Journal**      |
| A convenient way of displaying the information after I click on one of the titles | A convenient UI to display the news articles as well as latest 25 tweets.      |
| A cool feature that I came up with yourself.| A convenient UI to display the **Title, Description, Summary, Keywords and Sentiment in the News Article**, once the title is clicked      |
||An Option to show the **keywords** from the twitter feed as well as the sentiment of the latest 25 tweets of the user.|



API at a Glance:
---------
<blockquote>The Complete REST API backend is built using Python3 based framework Flask</blockquote>


- ``API End Point : / ``

		args: None
        request type : GET
        return Value : renders index.html
	**Explanation** : The home page of the webpage loads with a convenient UI to track the latest news about trump and his real time latest twitter feed as per the requirements. The Page also contains options to customize your search items and the news source. A separate UI to view the news in brief is provided on clicking the news items. This also provides the sentiment and keywords of the tweets and news articles. More about these are explained below.
    
    **Implementation** : The homepage is divided into two vertical columns two facilitate the user to track the news feed and real time twitter feed at the same time. To get the real time feed of the person, I used Twitter REST API v1.1 and widjets, and to get the news feed containing the search keyword, I used newsorg API.I used Jquery, Bootstrap to display the UI dynamically.  

- ``API End Point : /twitter_analysis``

		args: username 
        request type : GET
        return Value : JSON ( Tweet Sentiment Analysis, Cleaned Twitter Text for Keyword Extraction )
	**Explanation** : The website contains an option to view what's up with the twitter feed of the user you searched for. Once you search for the user and click on the button **Whats Up** , a UI with keywords and sentiment analysis of his latest 25 tweets will be displayed. This will help us to know what the user is talking about frequently and also analyze the sentiment/polarity in his tweets.

    **Implementation**: I used Tweepy library from python to hit the twitter v1.1 api and get the latest tweets of the specified username. Once I read the tweets, I do the sentiment analysis of each tweet after preprocessing which includes word tokenization, using python nltk library. To get the keywords from the tweet, I count the frequency of the words after I clean the urls,symbols,stop words from the tweets. 

- ``API End Point : /get_news_info``

		args: url  
        request type : GET
        return Value : JSON ( full_text,keywords,summary,sentiment )
	**Explanation** : The home page displays the news feed which contains articles which matches the keyword you searched for ( keyword is trump by default ). If you want to read the article briefly, you can click on any of the article which will display the title,summary,keywords and sentiment of the article. It will also show a word cloud of frequent word in the article. This will help you to go through the article quickly and there is always an option to read the full article at the bottom of the page.
    
    **Implementation**: I used python3 based newspaper library to crawl the full text of the news article, its summary and also to extract keywords from the news article. To analyze the sentiment and build the word cloud, the data is cleaned to remove stop words,urls,symbols and we used nltk library.

- ``API End Point : /news_analysis``

		args: search keyword, news source  
        request type : GET
        return Value : JSON ( title,url,description of the news )
	**Explanation** : Though the requirement is only to display the news articles regarding trump in CNN, I customized the api to search for any keyword and also inlcuded an option to select the news source from NYtimes,WS Journal and CNN. When you search for a keyword with a particular news source, this api will be used to get the news articles which match the news source and keyword you searched for.
    
    **Implementation**: I used News Org API to crawl news which contains the search keyword, from a particular news source. This can be replaced with respective news source API's but the validation for the api key is taking so long which forced me to use this alternative. 
    
- ``API End Point : /is_valid_user``

		args: username
        request type : GET
        return Value : JSON ( validity of username )
	**Explanation** : Some times the username you searched to get the twitter feed might not be a valid username, so before getting the tweets, this api will check fo r the validity of the username you searched for.
    
    **Implementation**: We used python Tweepy library and twitter v1.1 api to check the username's validity. 
        

**Installation Steps:**

**Required Packages** : pip3 ( sudo apt-get install pip3 ) , python3 ( sudo apt-get install python3)

**Clone the repository** : git clone https://github.com/rakeshmahadasa/TargetQueens

**change the working directory**: cd TargetQueens

**Install the dependencies** : pip3 install -r requirements.txt

**Start the server** : python3 Crawler_CNN.py

This will start the flask server and you can visit the website at http://127.0.0.1:5000/ 








   
    

