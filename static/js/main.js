$(document).ready(function() {
	var news_data;
	$.get("/news_analysis", data={'keyword': 'trump','news_source':'cnn.com'},
		function(data,status){
			news_data=data;
			$(".news-page-col").empty();
			console.log(data);
			if(data.length == 0){
				$('.news-page-col').html(
					'<div class="alert alert-danger"><strong>Oops!</strong>No Search Results. Please check the search keyword or change the news source.</div>'

					);
			}
			else{
				$.each(data, function(count, news_info) {
					var current_title="Title for the Article Not Found";
					if(news_info['title']!=null)current_title=news_info['title'];
					var news_image_url="";
					if(news_info['urlToImage']!=null)news_image_url=news_info['urlToImage'].replace("'","\'");
					if(news_info['title'].length>65){
						var current_title=news_info['title'].slice(0,62)+'...';
					}
					var news_url="#";
					if(news_info['url']!=null)news_url=news_info['url'].replace("'","\'");
					var news_card='<div class="news-card" id="'+String(count).trim()+				
					'"><div class="row news-card-row">\
					<div class="col-sm-4 no-padding">\
					<img class="news-image" src="'+
					news_image_url
					+'"alt="Image not found" onerror="this.onerror=null;this.src=\'static/news.jpg\';"newsurl="'+ news_url
					+'">\
					</div>\
					<div class="col-sm-8">\
					<strong class="text-danger news-headline">'+
					current_title.replace("'","\'")
					+
					'</strong>\
					<p class="text-primary news-description">\
					'+news_info['description'].replace("'","\'")+'</p></div></div></div><br>'

					$(".news-page-col").append(news_card)
				});
			}
		});
	
	$('.news-search-form').submit(function() {
    // Get all the forms elements and their values in one step

    var values = $(this).serializeArray();
    var news_search_keyword = values[0].value;
    if(news_search_keyword == "") news_search_keyword='trump';
    var news_source = $('.news-source-selected-value').text();
    $.get("/news_analysis", data={'keyword': news_search_keyword,'news_source':news_source},
    	function(data,status){
    		news_data=data;
    		$(".news-page-col").empty();
    		console.log(data);
    		if(data.length == 0){
    			$('.news-page-col').html(
    				'<div class="alert alert-danger"><strong>Oops!</strong>No Search Results. Please check the search keyword or change the news source.</div>'

    				);
    		}
    		else{
    			$.each(data, function(count, news_info) {
    				var current_title="Title for the Article Not Found";
    				if(news_info['title']!=null)current_title=news_info['title'];
    				var news_image_url="";
    				if(news_info['urlToImage']!=null)news_image_url=news_info['urlToImage'].replace("'","\'");
    				if(news_info['title'].length>65){
    					var current_title=news_info['title'].slice(0,62)+'...';
    				}
    				var news_url="#";
    				if(news_info['url']!=null)news_url=news_info['url'].replace("'","\'");
    				var news_card='<div class="news-card" id="'+String(count).trim()+				
    				'"><div class="row news-card-row">\
    				<div class="col-sm-4 no-padding">\
    				<img class="news-image" src="'+
    				news_image_url
    				+'"alt="Image not found" onerror="this.onerror=null;this.src=\'static/news.jpg\';"newsurl="'+ news_url
    				+'">\
    				</div>\
    				<div class="col-sm-8">\
    				<strong class="text-danger news-headline">'+
    				current_title.replace("'","\'")
    				+
    				'</strong>\
    				<p class="text-primary news-description">\
    				'+news_info['description'].replace("'","\'")+'</p></div></div></div><br>'

    				$(".news-page-col").append(news_card)
    			});
    		}
    	});




    return false;
});

	$(".news-source-dropdown-menu li a").click(function(){
		$(this).parents(".news-source-dropdown").find('.news-source-selected-value').text($(this).text());
		$(this).parents(".news-source-dropdown").find('.news-source-selected-value').val($(this).text());
	});

	$(".retweet-option-dropdown-menu li a").click(function(){
		$(this).parents(".retweet-option-dropdown").find('.retweet-option-selected-value').text($(this).text());
		$(this).parents(".retweet-option-dropdown").find('.retweet-option-selected-value').val($(this).text());
	});

	$('.twitter-user-search-form').submit(function() {
    // Get all the forms elements and their values in one step

    var values = $(this).serializeArray();
    var search_keyword=(values[0].value).trim()
    console.log(search_keyword)

    $.get("/is_valid_user", data={'username':search_keyword},
    	function(data,status){
    		if(data['valid']=='1'){
    			$('.twitter-page-col').html(" <a class=\"twitter-timeline\" href=\"https://twitter.com/"+ search_keyword +"\"></a>"); 
    			$('.twitter-page-col').attr("username",search_keyword);
    			twttr.widgets.load();
    			$('.twitter-analysis-btn').prop('disabled',false);
    		}
    		else{
    			$('.twitter-analysis-btn').prop('disabled',true);
    			$('.twitter-page-col').html(
    				'<div class="alert alert-danger"><strong>Oops!</strong>No Users Found with the Username you provided. Please check the username you searched for.</div>'

    				);
    		}

    	});

    return false;
});
	$('.news-page-col').on('click', '.news-card', function(){
		$('.news-overlay').show();
		$('.news_loader').show();
		var curr_news_id=Number($(this).attr("id"));
		console.log(curr_news_id);
		console.log(news_data[curr_news_id]['url']);
		$.get("/get_news_info", data={'url':news_data[curr_news_id]['url']},
			function(data,status){
				var curr_news_card=news_data[curr_news_id];
				$(".news-overlay-image").attr("src",news_data[curr_news_id]['urlToImage']);
				$(".news-overlay-title").text(news_data[curr_news_id]["title"]);
				$(".news-overlay-desc").text(news_data[curr_news_id]['description']);
				$(".news-overlay-summay").text(data["summary"]);
				if(data['sentiment']=='pos')
					$(".news-overlay-sentiment").html('<div class="text-success">Sentiment in the Article is <strong>Positive</strong></div>');
				if(data['sentiment']=='neg')
					$(".news-overlay-sentiment").html('<div class="text-danger">Sentiment in the Article is <strong>Negative</strong></div>');
				if(data['sentiment']=='neu')
					$(".news-overlay-sentiment").html('<div class="text-warning">Sentiment in the Article is <strong>Neutral</strong></div>');
				var keyword_button_list='<p class="news-keyword text-primary">';
				$.each(data['keywords'], function(count, keyword) {
					var keyword_button='<strong>|&nbsp;'+ data['keywords'][count] +'&nbsp;|<strong>';
					keyword_button_list=keyword_button_list+keyword_button;
				});
				keyword_button_list=keyword_button_list+'</p>'
				$(".news-overlay-keywords").html(keyword_button_list);
				$(".redirect-link").attr("href",news_data[curr_news_id]['url']);




				var news_full_data = data['full_text'];
				if(news_full_data.length > 0){
				var lines = news_full_data.split(/[,\. ]+/g),
				highcharts_data = Highcharts.reduce(lines, function (arr, word) {
					var obj = Highcharts.find(arr, function (obj) {
						return obj.name === word;
					});
					if (obj) {
						obj.weight += 1;
					} else {
						obj = {
							name: word,
							weight: 1
						};
						arr.push(obj);
					}
					return arr;
				}, []);

				highcharts_data.sort(function(first, second) {
					return second.weight - first.weight;
				});
				highcharts_data = highcharts_data.slice(0,66);
				Highcharts.chart('news-overlay-wordcloud', {
					series: [{
						type: 'wordcloud',
						data: highcharts_data,
						name: 'Occurrences',
					}],
					title: {
						text: 'Wordcloud of News Article'
					}
				});
			}










			}).always(function(data){$('.news_loader').hide();});
	});

	$('.news-overlay-close').click(function(){
		$('.news-overlay').hide();
	});

	$('.twitter-analysis-btn').click(function(){
		$('.twitter_loader').show();


		if ( $('.twitter-overlay').css('display') == 'none' )
			$('.twitter-overlay').css('display','block');
		else
			$('.twitter-overlay').css('display','none');

		var current_username = $('.twitter-page-col').attr('username');
		console.log("Getting analysis for tweets for user : " + current_username);

		$.get('/twitter_analysis',data={'username':current_username},
			function(data,status){
				console.log(data)
				var twitter_data = data['clean_twitter_data']
				var lines = twitter_data.split(/[,\. ]+/g),
				highcharts_data = Highcharts.reduce(lines, function (arr, word) {
					var obj = Highcharts.find(arr, function (obj) {
						return obj.name === word;
					});
					if (obj) {
						obj.weight += 1;
					} else {
						obj = {
							name: word,
							weight: 1
						};
						arr.push(obj);
					}
					return arr;
				}, []);

				highcharts_data.sort(function(first, second) {
					return second.weight - first.weight;
				});
				highcharts_data = highcharts_data.slice(0,66);
				Highcharts.chart('tweet-word-cloud', {
					series: [{
						type: 'wordcloud',
						data: highcharts_data,
						name: 'Occurrences',
					}],
					title: {
						text: 'Wordcloud of Twitter Data'
					}
				});


				Highcharts.chart('twitter-sentiment-bar', {
					chart: {
						type: 'bar'
					},
					title: {
						text: 'Sentiment Distribution of Tweets'
					},
					subtitle: {
						text: 'Source: '+"<a target=\"_blank\" class=\"twitter-timeline\" href=\"https://twitter.com/"+ current_username +"\"> Twitter : " +current_username+"</a>"
					},
					xAxis: {
						categories: ['Positive', 'Negative', 'Neutral'],
						title: {
							text: null
						}
					},
					yAxis: {
						min: 0,
						title: {
							text: 'No of Tweets [1-25]',
							align: 'high'
						},
						labels: {
							overflow: 'justify'
						}
					},
					tooltip: {
						valueSuffix: 'out of latest 25 tweets'
					},
					plotOptions: {
						bar: {
							dataLabels: {
								enabled: true
							},
							borderRadius: 2,
							borderWidth: 1,
							borderColor:"#ECFAC6"
						}
					},
					legend: {
						layout: 'vertical',
						align: 'right',
						verticalAlign: 'top',
						x: -40,
						y: 80,
						floating: true,
						borderWidth: 1,
						backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
						shadow: true
					},
					credits: {
						enabled: false
					},
					series: [{
						name: 'Tweet Count',						
						data: [ data['twitter_sentiment']['pos'],data['twitter_sentiment']['neg'],data['twitter_sentiment']['neu']]
					}]
				});
				$('.twitter_loader').hide();
			});

	});

	$('.twitter-overlay-close').click(function(){
		$('.twitter-overlay').css('display','none');
	});




});
