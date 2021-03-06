import React from "react"
import { useState } from "react";
import { useEffect } from "react";

// Get the hash of the url
const hash = window.location.hash
.substring(1)
.split("&")
.reduce(function(initial:any, item:any) {
    if (item) {
    var parts = item.split("=");
        initial[parts[0]] = decodeURIComponent(parts[1]);
    }
    return initial;
}, {});

const homepage = function () {
    const authEndpoint = 'https://accounts.spotify.com/authorize';
    var scopes = ['user-top-read'],
    redirectUri = 'http://localhost:8080',
    clientId = 'b244422e8a674d8fa6d67b4e3eda3f2d',
    state = '1',
    showDialog = true,
    responseType = 'token';
  
    // Setting credentials can be done in the wrapper's constructor, or using the API object's setters.
    var SpotifyWebApi = require('spotify-web-api-node');    
    var spotifyApi = new SpotifyWebApi({
        redirectUri: redirectUri,
        clientId: clientId
    });
    
    let logged_in = false;
    const [listInitialized, setListInitialized] = useState(false);
    const [trackList, setTrackList] = useState([]);

    let track_list:any = <div></div>;
    if(!listInitialized && "access_token" in hash) {
        logged_in = true;
        spotifyApi.setAccessToken(hash.access_token);

        /* Get a User’s Top Artists*/
        spotifyApi.getMyTopTracks()
        .then(function(data:any) {
            setTrackList(data.body.items)
            setListInitialized(true);
        }, function(err:any) {
            console.log('Something went wrong!', err);
        });

    }

    track_list = (<div>
        {
            trackList.map(function (track:any) {
                console.log(track)
                return (<div key={track.id}>
                    <div>
                        <img src={track.album.images[1].url} />
                    </div>
                    <div>
                        Track: {track.name}<br />

                        Album: {track.album.name}<br />
                        Artist(s): {track.artists.map(function (artist:any) {
                            return artist.name;
                        }).join(", ")}
                    </div>
                </div>)
            })
        }
    </div>);


    return <div>
        <h1>Demo React Application</h1>
        {track_list}
        {logged_in || <a className="btn btn--loginApp-link"
          href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`}
        >
          Login to Spotify
        </a>}
    </div>
}

export default homepage;