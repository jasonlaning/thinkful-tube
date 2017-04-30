var YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

var state = {
	queryTerm: '',
	nextPage: '',
	previousPage: ''
}

function getDataFromApi(searchTerm, callback, nextPage) {
	var query = {
		type: 'video',
		q: searchTerm,
		part: 'snippet',
		key: 'AIzaSyBRALEXa6Uli2arKRcphxQD6Hvx5OR2jP0',
		pageToken: nextPage,
		maxResults: 6
	}

	$.getJSON(YOUTUBE_SEARCH_URL, query, callback);
}

function displayYouTubeSearchData(data) {
	state.nextPage = data.nextPageToken;
	state.previousPage = data.prevPageToken;
	var resultElement = '';
	console.log(data);
	if (data.items) {
		data.items.forEach(function(item) {
			resultElement += '<div class="js-video"><a href=https://youtu.be/' + item.id.videoId + 
			'"><img src="' + item.snippet.thumbnails.medium.url + '"></a><p>' + 
			'<a href="https://youtube.com/channel/' + item.snippet.channelId + '">More from this channel</a></p></div>';
		});
	}
	else {
		resultElement += '<p>No results</p>';
	}
	if (data.prevPageToken) {
		resultElement += '<button class="js-previous-page">Previous Page</button>';
	}
	if (data.nextPageToken) {
		resultElement += '<button class="js-next-page">Next Page</button>';
	}
	$('.js-search-results').html(resultElement);
}

function watchPageButtons() {
	$('.js-search-results').on('click', '.js-next-page', function(event) {
		event.stopPropagation();
		getDataFromApi(state.queryTerm, displayYouTubeSearchData, state.nextPage);		
	});

	$('.js-search-results').on('click', '.js-previous-page', function(event) {
		event.stopPropagation();
		getDataFromApi(state.queryTerm, displayYouTubeSearchData, state.previousPage);
	});
}

function watchSubmit() {
	$('.js-search-form').submit(function(event) {
		event.preventDefault();
		event.stopPropagation();
		state.queryTerm = $(this).find('.js-query').val();

		getDataFromApi (state.queryTerm, displayYouTubeSearchData, '');
	})
}

watchPageButtons();
watchSubmit();
