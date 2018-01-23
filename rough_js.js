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
    $('.twitter-page-col').html(" <a class=\"twitter-timeline\" href=\"https://twitter.com/"+ search_keyword + "\"></a>"); 
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
});

$('.twitter-overlay-close').click(function(){
	console.log("OVERLAY CLOSE")
		$('.twitter-overlay').css('display','none');
});

});
