from bs4 import BeautifulSoup
import urllib2
import json


url="https://newsapi.org/v2/everything?q=trump&domains=cnn.com&apiKey=857bd6cbdc8e41aca5f81de4f0d47f05"
response = urllib2.urlopen(url)
webContent = json.load(response)





print(webContent["status"])



