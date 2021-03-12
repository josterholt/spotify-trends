import React from 'react'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

const authEndpoint = 'https://accounts.spotify.com/authorize'
var scopes = ['user-top-read'],
    redirectUri = window.location.origin,
    clientId = 'b244422e8a674d8fa6d67b4e3eda3f2d'

export default function () {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Button
                    variant="contained"
                    color="primary"
                    href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
                        '%20',
                    )}&response_type=token&show_dialog=true`}
                >
                    Login with Spotify
                </Button>
            </Grid>
        </Grid>
    )
}
