import React, {useState, useEffect} from 'react'
import {useQuery, useQueryClient} from 'react-query'
import TrackGrid from '../components/TrackGrid'
import Grid from '@material-ui/core/Grid'
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import {debug} from 'webpack'

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

var SpotifyWebApi = require('spotify-web-api-node')
const authEndpoint = 'https://accounts.spotify.com/authorize'
var scopes = ['user-top-read'],
    redirectUri = window.location.origin,
    clientId = 'b244422e8a674d8fa6d67b4e3eda3f2d',
    state = '1',
    showDialog = true,
    responseType = 'token'
var spotifyApi = new SpotifyWebApi({
    redirectUri: redirectUri,
    clientId: clientId,
})

const homepage = function () {
    const [spotifyTimeRange, setSpotifyTimeRange] = useState('short_term')
    const queryClient = useQueryClient()

    /**
     * userQuery Hooks
     */
    const {
        isFetched: isUserProfileFetched,
        data: userProfileData,
    }: any = useQuery(
        'userProfileData',
        () =>
            new Promise((resolve, reject) => {
                if (!isUserProfileFetched && 'access_token' in hash) {
                    spotifyApi.setAccessToken(hash.access_token)
                    spotifyApi.getMe().then(
                        function (data: any) {
                            console.log(data.body)
                            resolve(data.body)
                        },
                        function (err: any) {
                            reject(err)
                        },
                    )
                }
            }),
    )

    const {isFetched, data}: any = useQuery(
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
    /**
     * End useQuery Hooks
     */

    let loginLink: any = (
        <a
            className="btn btn--loginApp-link"
            href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
                '%20',
            )}&response_type=token&show_dialog=true`}
        >
            Login to Spotify
        </a>
    )

    if (isUserProfileFetched && userProfileData) {
        loginLink = 'Logged in as ' + userProfileData.display_name
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
        <div className={classes.root}>
            <Grid item xs={12}>
                <h1 style={{alignItems: 'justify-center', paddingLeft: '16px'}}>
                    Top Listened Tracks
                </h1>
            </Grid>
            <Grid container spacing={3}>
                <Grid item xs={9} style={{paddingLeft: '32px'}}>
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
                    style={{textAlign: 'right', paddingRight: '35px'}}
                >
                    {loginLink}
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Paper className={classes.paper}>
                    <TrackGrid tracks={data} />
                </Paper>
            </Grid>
        </div>
    )
}

export default homepage
