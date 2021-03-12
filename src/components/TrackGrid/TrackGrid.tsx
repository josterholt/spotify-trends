import React, {useState, useEffect} from 'react'
import {useQuery, useQueryClient} from 'react-query'
import {
    DataGrid,
    GridRowsProp,
    GridColDef,
    GridCellParams,
} from '@material-ui/data-grid'
import Grid from '@material-ui/core/Grid'
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles'

var SpotifyWebApi = require('spotify-web-api-node')
var redirectUri = window.location.origin,
    clientId = 'b244422e8a674d8fa6d67b4e3eda3f2d'

var spotifyApi = new SpotifyWebApi({
    redirectUri: redirectUri,
    clientId: clientId,
})

// Get the hash of the url
const hash = window.location.hash
    .substring(1)
    .split('&')
    .reduce(function (initial: any, item: any) {
        if (item) {
            var parts = item.split('=')
            initial[parts[0]] = decodeURIComponent(parts[1])
        }
        return initial
    }, {})

const columns: GridColDef[] = [
    {
        field: 'album_cover',
        headerName: ' ',
        width: 150,
        type: 'string',
        renderCell: (params: GridCellParams) => (
            <>
                <img src={params.value.toString()} width={150} />
            </>
        ),
    },
    {field: 'title', headerName: 'Title', width: 300},
    {field: 'album', headerName: 'Album', width: 300},
    {field: 'artist', headerName: 'Artist', width: 300},
]

export default function ({userProfileData}: any) {
    const queryClient = useQueryClient()
    const [spotifyTimeRange, setSpotifyTimeRange] = useState('short_term')
    const {isFetched, data: tracks, error}: any = useQuery(
        'trackData-' + spotifyTimeRange,
        () =>
            new Promise((resolve, reject) => {
                if (!isFetched && 'access_token' in hash) {
                    spotifyApi.setAccessToken(hash.access_token)
                    spotifyApi
                        .getMyTopTracks({
                            limit: 50,
                            time_range: spotifyTimeRange,
                        })
                        .then(
                            function (data: any) {
                                resolve(data.body.items)
                            },
                            function (err: any) {
                                reject(err)
                            },
                        )
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
        },
    )

    let rows: GridRowsProp = []
    if (tracks && tracks.length > 0) {
        rows = tracks.map(function (track: any) {
            return {
                id: track.id,
                title: track.name,
                album: track.album.name,
                album_cover: track.album.images[1].url,
                artist: track.artists
                    .map(function (artist: any) {
                        return artist.name
                    })
                    .join(', '),
            }
        })
    }

    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            root: {
                flexGrow: 1,
            },
            paper: {
                padding: theme.spacing(2),
                textAlign: 'center',
                color: theme.palette.text.secondary,
            },
        }),
    )

    const classes = useStyles()

    return (
        <div className={classes.root} style={{width: '100%'}}>
            <Grid container spacing={3}>
                <Grid
                    item
                    xs={9}
                    style={{
                        textAlign: 'left',
                        padding: '10px',
                        paddingLeft: '20px',
                    }}
                >
                    <label htmlFor={'time_range'}>Time Range:</label>
                    <select
                        name="time_range"
                        onChange={el => setSpotifyTimeRange(el.target.value)}
                    >
                        <option value="short_term">Last 4 Weeks</option>
                        <option value="medium_term">Last 6 Months</option>
                        <option value="long_term">Last Several Years</option>
                    </select>
                </Grid>
                <Grid
                    item
                    xs={3}
                    style={{textAlign: 'right', paddingRight: '20px'}}
                >
                    Logged in as {userProfileData.display_name}
                </Grid>
            </Grid>
            <Grid item xs={12} style={{marginTop: '10px'}}>
                <DataGrid
                    autoHeight
                    pageSize={5}
                    rowHeight={150}
                    rows={rows}
                    columns={columns}
                />
            </Grid>
        </div>
    )
}
