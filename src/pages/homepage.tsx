import React, { useState, useEffect } from "react"
import { DataGrid, GridRowsProp, GridColDef, GridCellParams } from "@material-ui/data-grid";

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
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    let track_list:any = <div></div>;
    useEffect(() => {
        if(!listInitialized && "access_token" in hash) {
            setIsLoggedIn(true);
            spotifyApi.setAccessToken(hash.access_token);
            
            /* Get a User’s Top Artists*/
            spotifyApi.getMyTopTracks({limit: 50, time_range: "short_term"})
            .then(function(data:any) {
                setTrackList(data.body.items)
                setListInitialized(true);
            }, function(err:any) {
                setIsLoggedIn(false);
                setListInitialized(true);
    
                console.log('Something went wrong!', err);
            });
    
        }
    })

    let columns:GridColDef[] = [
        {
            field: 'album_cover', 
            headerName: '', 
            width: 150,
            type: "string",
            renderCell: (params: GridCellParams) => (<><img src={params.value.toString()} width={150} /></>)
        },
        { field: 'title', headerName: 'Title', width: 300 },
        { field: 'album', headerName: 'Album', width: 300 },
        { field: 'artist', headerName: 'Artist', width: 300 }
    ];

    let rows:GridRowsProp  = trackList.map(function (track:any) {
        return { 
            id: track.id,
            title: track.name,
            album: track.album.name,
            album_cover: track.album.images[1].url,
            artist: track.artists.map(function (artist:any) {
                return artist.name;
            }).join(", ")
        }
    });
    
    let loginLink = null
    if(!isLoggedIn) {
        loginLink = <a className="btn btn--loginApp-link"
        href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`}>
        Login to Spotify
        </a>
    }

    return <div>
        <h1>Demo React Application</h1>
        <DataGrid rowHeight={150} rows={rows} columns={columns} />
        {loginLink}
    </div>
}

export default homepage;