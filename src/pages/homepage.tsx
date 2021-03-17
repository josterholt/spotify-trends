import React, {useState, useEffect} from 'react'
import {useQuery, useQueryClient} from 'react-query'
import TrackGrid from '../components/TrackGrid'
import Grid from '@material-ui/core/Grid'
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import LoginPrompt from '../components/LoginPrompt'
import SpotifyWebApi from 'spotify-web-api-node'

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

//var SpotifyWebApi = require('spotify-web-api-node')
var redirectUri = window.location.origin,
    clientId = 'b244422e8a674d8fa6d67b4e3eda3f2d'
var spotifyApi = new SpotifyWebApi({
    redirectUri: redirectUri,
    clientId: clientId,
})

const homepage = function () {
    const queryClient = useQueryClient()

    /**
     * userQuery Hooks
     */
    const {
        isFetched: isUserProfileFetched,
        data: userProfileData,
    }: any = useQuery(
        'userProfileData' + hash.access_token || '',
        () =>
            new Promise((resolve, reject) => {
                if (!isUserProfileFetched && 'access_token' in hash) {
                    spotifyApi.setAccessToken(hash.access_token)
                    spotifyApi.getMe().then(
                        function (data: any) {
                            console.table(data.body)
                            resolve(data.body)
                        },
                        function (err: any) {
                            reject(err)
                        },
                    )
                }
            }),
    )
    /**
     * End useQuery Hooks
     */

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
        <div className={classes.root}>
            <Grid item xs={12}>
                <h1 style={{alignItems: 'justify-center', paddingLeft: '16px'}}>
                    Top Listened Tracks
                </h1>
            </Grid>
            <Grid item xs={12}>
                <Paper className={classes.paper}>
                    {userProfileData ? (
                        <TrackGrid userProfileData={userProfileData} />
                    ) : (
                        <LoginPrompt />
                    )}
                </Paper>
            </Grid>
        </div>
    )
}

export default homepage
