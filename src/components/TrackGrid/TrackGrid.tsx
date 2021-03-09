import React from 'react'
import {
    DataGrid,
    GridRowsProp,
    GridColDef,
    GridCellParams,
} from '@material-ui/data-grid'

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

export default function ({tracks}: any) {
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
            <DataGrid
                autoHeight
                pageSize={5}
                rowHeight={150}
                rows={rows}
                columns={columns}
            />
        </div>
    )
}
