import React from 'react'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import {
    spotifyClientID,
    spotifyAuthEndpoint,
    spotifyScopes,
} from '../../utils/settings'

export default function () {
    return (
        <Grid container>
            <Grid item xs={12}>
                <Button
                    color="primary"
                    variant="contained"
                    href={`${spotifyAuthEndpoint}?client_id=${spotifyClientID}&redirect_uri=${
                        window.location.origin
                    }&scope=${spotifyScopes.join(
                        '%20',
                    )}&response_type=token&show_dialog=true`}
                >
                    Login with Spotify
                </Button>
            </Grid>
        </Grid>
    )
}
