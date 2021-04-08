import React, {useState, useEffect} from 'react'
import {
    DataGrid,
    GridRowsProp,
    GridColDef,
    GridCellParams,
} from '@material-ui/data-grid'
import Grid from '@material-ui/core/Grid'
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles'
import {useSpotifyFavoriteTracks, useSpotifyPlayer} from '../../hooks/spotify'
import PlayIcon from '../../assets/images/playIcon.png'

export default function ({userProfileData}: any) {
    const [spotifyTimeRange, setSpotifyTimeRange] = useState('short_term')
    const [tracks] = useSpotifyFavoriteTracks(spotifyTimeRange)
    const player = useSpotifyPlayer() // not sure if I'm using the custom hook correctly here. Doesn't look like a normal use.

    const columns: GridColDef[] = [
        {
            field: 'album_cover',
            headerName: ' ',
            width: 150,
            type: 'string',
            renderCell: (params: GridCellParams) => {
                const context_uri: string = params.row.album_uri
                const offset: number = params.row.track_number - 1

                const [playOverlay, setPlayOverlay] = useState(false)
                const playSong = () => {
                    console.log({context_uri, offset})
                    player.play(context_uri, offset)
                }

                return (
                    <div
                        style={{position: 'absolute'}}
                        onMouseEnter={() => {
                            console.log('foo')
                            setPlayOverlay(true)
                        }}
                        onMouseLeave={() => setPlayOverlay(false)}
                    >
                        <img src={params.value.toString()} width={150} />
                        <div
                            style={{
                                position: 'absolute',
                                top: '25%',
                                left: '25%',
                                opacity: '0.75',
                            }}
                        >
                            <a onClick={() => playSong()}>
                                {playOverlay ? (
                                    <img
                                        src={PlayIcon}
                                        style={{width: '75px'}}
                                    />
                                ) : null}
                            </a>
                        </div>
                    </div>
                )
            },
            disableClickEventBubbling: true,
        },
        {field: 'title', headerName: 'Title', width: 300},
        {field: 'album_name', headerName: 'Album', width: 300},
        {field: 'artist', headerName: 'Artist', width: 300},
    ]

    let rows: GridRowsProp = []
    if (tracks && tracks.length > 0) {
        rows = tracks.map(function (track: any) {
            const context_url = track.album.uri
            const offset = track.track_number - 1
            return {
                id: track.id,
                title: track.name,
                album_name: track.album.name,
                album_uri: track.album.uri,
                album_cover: track.album.images[1].url,
                artist: track.artists
                    .map(function (artist: any) {
                        return artist.name
                    })
                    .join(', '),
                track_number: track.track_number,
            }
        })
    }

    return (
        <div style={{width: '100%'}}>
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
