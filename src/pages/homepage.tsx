import React, {useEffect} from 'react'
import TrackGrid from '../components/TrackGrid'
import Grid from '@material-ui/core/Grid'
import LoginPrompt from '../components/LoginPrompt'
import {useSpotifyProfile} from '../hooks/spotify'
import {extractAndStoreAccessToken, clearQueryString} from '../utils/helpers'
import {useLocation} from 'react-router-dom'

const homepage = function () {
    const [userProfileData] = useSpotifyProfile()
    const {hash} = useLocation()

    useEffect(() => {
        extractAndStoreAccessToken(hash)
        clearQueryString()
    }, [hash])

    return (
        <Grid container>
            <Grid item xs={12}>
                <h1
                    style={{
                        alignItems: 'justify-center',
                        paddingLeft: '16px',
                        textAlign: 'center',
                    }}
                >
                    Your Spotify Listening Trends
                </h1>
            </Grid>
            <Grid item xs={12}>
                <div style={{textAlign: 'center'}}>
                    {userProfileData ? (
                        <TrackGrid userProfileData={userProfileData} />
                    ) : (
                        <LoginPrompt />
                    )}
                </div>
            </Grid>
        </Grid>
    )
}

export default homepage
