import React, {useState, useEffect} from 'react'
import {
    DataGrid,
    GridRowsProp,
    GridColDef,
    GridCellParams,
} from '@material-ui/data-grid'
import Grid from '@material-ui/core/Grid'
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles'
import {useSpotifyFavoriteTracks} from '../../hooks/spotify'

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
    const [spotifyTimeRange, setSpotifyTimeRange] = useState('short_term')
    const [tracks] = useSpotifyFavoriteTracks(spotifyTimeRange)

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
