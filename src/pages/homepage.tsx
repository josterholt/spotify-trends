import React, { useState, useEffect } from "react"
import { useQuery, useQueryClient  } from 'react-query'
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

var SpotifyWebApi = require('spotify-web-api-node');    
const authEndpoint = 'https://accounts.spotify.com/authorize';
var scopes = ['user-top-read'],
redirectUri = window.location.origin,
clientId = 'b244422e8a674d8fa6d67b4e3eda3f2d',
state = '1',
showDialog = true,
responseType = 'token';

const homepage = function () {

    const [spotifyTimeRange, setSpotifyTimeRange] = useState("short_term")

    var spotifyApi = new SpotifyWebApi({
        redirectUri: redirectUri,
        clientId: clientId
    });
    
    const queryClient = useQueryClient()
    const { isLoading, isFetching, isFetchingAfterMount, isStale, isFetched, error, data }:any = useQuery('trackData-' + spotifyTimeRange, () => new Promise((resolve, reject) => {
        if(!isFetched && "access_token" in hash) {
            spotifyApi.setAccessToken(hash.access_token);
            spotifyApi.getMyTopTracks({limit: 50, time_range: spotifyTimeRange})
            .then(function(data:any) {
                resolve(data.body.items)
            }, function(err:any) {
                reject()
            })
        }
    }),
    {
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        initialData: () => {
            return queryClient.getQueryData('trackData')
          },
    });


    let columns:GridColDef[] = [
        {
            field: 'album_cover', 
            headerName: ' ', 
            width: 150,
            type: "string",
            renderCell: (params: GridCellParams) => (<><img src={params.value.toString()} width={150} /></>)
        },
        { field: 'title', headerName: 'Title', width: 300 },
        { field: 'album', headerName: 'Album', width: 300 },
        { field: 'artist', headerName: 'Artist', width: 300 }
    ];

    let rows:GridRowsProp = [];
    if(data) {
        rows = data.map(function (track:any) {
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
    }
    
    function handleTimeRangeChange(el:React.ChangeEvent<HTMLSelectElement>) {
        setSpotifyTimeRange(el.target.value);
    }

    
    let loginLink = <a className="btn btn--loginApp-link"
    href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`}>
    Login to Spotify
    </a>

    return <div>
        <h1>Top Listened Tracks</h1>
        <div style={{ padding: "10px"}}>
            <label htmlFor={"time_range"}>Time Range:</label>
            <select name="time_range" onChange={ (el) => handleTimeRangeChange(el) }>
                <option value="short_term">Last 4 Weeks</option>
                <option value="medium_term">Last 6 Months</option>
                <option value="long_term">Last Several Years</option>
            </select>
        </div>
        <DataGrid rowHeight={150} rows={rows} columns={columns} />
        {loginLink}
    </div>
}

export default homepage;