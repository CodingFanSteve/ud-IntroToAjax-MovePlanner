
function loadData() {
    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var $streetview = $('<img>').addClass('bgimg'),
        locationUrl = 'http://maps.googleapis.com/maps/api/streetview?size=800x500&location=',
        $street = $('form #street'),
        $city = $('form #city'),
        $state = $('form #state'),
        $fulladdress = $street.val() + ', ' + $city.val() + ', ' + $state.val(),
        $partialAddress = $city.val() + ' City, ' + $state.val();
        
    locationUrl += $fulladdress;
    $streetview.attr('src', locationUrl);    
    $body.append($streetview);

    //NYT
    var nytUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';
    nytUrl += '?' + $.param({
          'api-key': "9d0d4fabc03c43f39db2d5831196924b",
          'q': $partialAddress
        });

    $.getJSON(nytUrl, function(data) {
        var articles = data.response.docs,
            $nytList = $('#nytimes-articles');

        $.each(articles, function(i, article) {
            $liElm = $('<li class="article"></li>');
            $nytList.append($liElm);

            $aElm = $('<a></a>');
            $aElm.attr('href', article.web_url);
            $aElm.text(article.headline.main);
            $liElm.append($aElm);

            $pElm = $('<p></p>');
            $pElm.text(article.snippet);
            $liElm.append($pElm);
        });
    }).error(function() {
        $nytElem.text("New York Times Articles Couldn't be loaded");
    });

    // wikipedia links
    var wkpUrl = 'https://en.wikipedia.org/w/api.php';
    wkpUrl += '?' + $.param({
            'action': 'opensearch',
            'search': $partialAddress,
            'format': 'json'
        });

    var wikiRequestTimeout = setTimeout(function() {
        $wikiElem.text('wikipedia links request times out');
    }, 8000);

    $.ajax({
        url: wkpUrl,
        dataType: 'jsonp',
        success: function(response) {
            var $wikiList = $('#wikipedia-links'),
                titleList = response[1],
                urlList = response[3];

            $.each(titleList, function(i, title) {
                $liElm = $('<li></li>');
                $wikiList.append($liElm);

                $aElm = $('<a></a>').attr('href', urlList[i]).text(title);
                $liElm.append($aElm);
            });

            clearTimeout(wikiRequestTimeout);
        }
    });
    
    $street.val('');
    $city.val('');
    $state.val('');

    return false;
};

$('#form-container').submit(loadData);
