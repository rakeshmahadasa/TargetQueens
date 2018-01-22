import newspaper
from newspaper import Article
import datetime
url = 'http://www.cnn.com/videos/politics/2017/12/04/trump-flynn-obstruction-of-justice-questions-tapper-monologue-lead.cnn'

paper = newspaper.build(url)
print(paper.articles)

article = Article(url)
article.download()

article.html
article.parse()
article.authors
article.publish_date
datetime.datetime(2013, 12, 30, 0, 0)
print(article.text)

article.nlp()
print(article.keywords)
print(article.summary)
article.top_image
article.movies

