require("dotenv").config();
var keys = require("./keys");
var socialNetwork = process.argv[2];

if (socialNetwork === "twitter") {
    getTweets();
}
if (socialNetwork === "spotify") {
    getSong();
}
if (socialNetwork === "ombd") {
    getMovie();
}

// twitter
function getTweets() {
    var Twitter = require("twitter");
    var twitterHandle = process.argv[3];
    var tweetsLimit = 20;

    // tells it where to find the keys
    var client = new Twitter({
        consumer_key: keys.twitter.consumer_key,
        consumer_secret: keys.twitter.consumer_secret,
        access_token_key: keys.twitter.access_token_key,
        access_token_secret: keys.twitter.access_token_secret
    });


    var params = { screen_name: twitterHandle };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            // if user has less than 10 tweets it will set their amount of tweets as the limit
            if (tweets.length < tweetsLimit) {
                tweetsLimit = tweets.length;
            }
            // looping through users tweets until limit is satisfied
            for (var i = 0; i < tweetsLimit; i++) {
                console.log(tweets[i].text);
                console.log(tweets[i].created_at);
                console.log();
            }

        } else {
            console.log(error);
        }
    });
}

// spotify
function getSong() {
    var Spotify = require('node-spotify-api');
    var songQuery = process.argv[3];

    var spotify = new Spotify({
        id: keys.spotify.id,
        secret: keys.spotify.secret
    });

    if (!songQuery) {
        songQuery = "Por la Raja de tu Falda";

    } else {
        spotify
            .search({ type: 'track', query: songQuery })
            .then(function (response) {
                // artist name
                console.log("Artist: " + response.tracks.items[0].artists[0].name);
                // song name
                console.log("Song: " + response.tracks.items[0].name);
                // album name
                console.log("Album: " + response.tracks.items[0].album.name);
                // preview link
                if (response.tracks.items[0].preview_url) {
                    console.log("Preview: " + response.tracks.items[0].preview_url);
                } else {
                    console.log("Preview: Unavailable");
                }

            })
            .catch(function (err) {
                console.log(err);
            });
    }


}



// ombd

function getMovie() {
    var movie = process.argv[3];

    if (!movie) {
        movie = "Mr Nobody";
        console.log("If you haven't watched 'Mr Nobody' then you should. It's on Netflix");
    }

    else {

        var request = require('request');
        request("https://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy", function (error, response, body) {

            if (!error) {
                var results = JSON.parse(body);
                console.log("Title: " + results.Title);
                console.log("Released: " + results.Year);
                console.log("IMBD Rating: " + results.Ratings[0].Value);
                console.log("Rotten Tomatoes Rating: " + results.Ratings[1].Value);
                console.log("Production Country: " + results.Country);
                console.log("Language: " + results.Language);
                console.log("Plot: " + results.Plot);
                console.log("Actors: " + results.Actors);
            } else {
                console.log('error:', error); // Print the error if one occurred
                console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            }

        });
    }
}


