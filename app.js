require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: 'http://localhost:4000/homepage'
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));



// require spotify-web-api-node package here:

  
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
// app.use(express.json()) 
// app.use(express.urlencoded({ extended: true })) 

// Our routes go here:

app.get('/homepage', (req, res) => {
    res.render('./artiste.hbs');
  });
  

  app.get('/artist-search', (req, res) => {
    // console.log(req.query)

    const {q} = req.query
    spotifyApi
    .searchArtists(q)
    .then(data => {
        const item = data.body.artists.items
        // console.log('The received data from the API: ', {item})
        //         console.log(item.images)

        res.render('./artistResult.hbs', {target : item})
    })
    .catch((err) => console.log('The error while searching artists occurred: ', err))
    
})
// album
app.get('/albums/:artistId', (req, res, next) => {
  const alb = req.params.artistId 
  spotifyApi
  .getArtistAlbums(alb)
  .then((data) => {
    const albums = data.body.items
    res.render('./albums.hbs', {albums : albums})
  })
  .catch((err) => console.log('The error while searching albums occurred: ', err))
});
// tracks
app.get("/tracks/:album", function(req, res, next){
  const track = req.params.album 
  spotifyApi
  .getAlbumTracks(track)
  .then(function(data){
    const tracks = data.body.items
    res.render("./tracks.hbs", {audio: tracks})
    console.log("test", tracks)
  })
  .catch((err) => console.log('The error while searching tracks occurred: ', err))

})
  

app.listen(4000, () => console.log('My Spotify project running on port 4000 🎧 🥁 🎸 🔊'));
