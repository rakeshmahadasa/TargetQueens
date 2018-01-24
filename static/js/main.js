$(document).ready(function() {

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
    $('.twitter-page-col').html(" <a class=\"twitter-timeline\" href=\"https://twitter.com/"+ search_keyword +"\"></a>"); 
    $('.twitter-page-col').attr("username",search_keyword);
    twttr.widgets.load();

    return false;
});

	$('.news-card').click(function(){
		if ( $('.news-overlay').css('display') == 'none' )
			$('.news-overlay').css('display','block');
		else
			$('.news-overlay').css('display','none');
	});

	$('.news-overlay-close').click(function(){
		console.log("OVERLAY CLOSE")
		$('.news-overlay').css('display','none');
	});

	$('.twitter-analysis-btn').click(function(){


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

			});

	});

	$('.twitter-overlay-close').click(function(){
		console.log("OVERLAY CLOSE")
		$('.twitter-overlay').css('display','none');
	});




});
