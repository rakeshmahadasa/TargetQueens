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
		current_username = $('.twitter-page-col').attr('username');
		console.log("Getting analysis for tweets for user : " + current_username);
		$.get('/twitter_analysis?username='+current_username,
				function(data,status){
					console.log(data);
				}
			);

var text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean bibendum erat ac justo sollicitudin, quis lacinia ligula fringilla. Pellentesque hendrerit, nisi vitae posuere condimentum, lectus urna accumsan libero, rutrum commodo mi lacus pretium erat. Phasellus pretium ultrices mi sed semper. Praesent ut tristique magna. Donec nisl tellus, sagittis ut tempus sit amet, consectetur eget erat. Sed ornare gravida lacinia. Curabitur iaculis metus purus, eget pretium est laoreet ut. Quisque tristique augue ac eros malesuada, vitae facilisis mauris sollicitudin. Mauris ac molestie nulla, vitae facilisis quam. Curabitur placerat ornare sem, in mattis purus posuere eget. Praesent non condimentum odio. Nunc aliquet, odio nec auctor congue, sapien justo dictum massa, nec fermentum massa sapien non tellus. Praesent luctus eros et nunc pretium hendrerit. In consequat et eros nec interdum. Ut neque dui, maximus id elit ac, consequat pretium tellus. Nullam vel accumsan lorem.';

var lines = text.split(/[,\. ]+/g),
    data = Highcharts.reduce(lines, function (arr, word) {
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

Highcharts.chart('tweet-word-cloud', {
    series: [{
        type: 'wordcloud',
        data: data,
        name: 'Occurrences'
    }],
    title: {
        text: 'Wordcloud of Twitter Data'
    }
});


		
	});

	$('.twitter-overlay-close').click(function(){
		console.log("OVERLAY CLOSE")
		$('.twitter-overlay').css('display','none');
	});





});
