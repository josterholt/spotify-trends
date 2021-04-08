import React, {useState, useEffect} from 'react'
import {useQuery, useQueryClient} from 'react-query'
import TrackGrid from '../components/TrackGrid'
import Grid from '@material-ui/core/Grid'
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import LoginPrompt from '../components/LoginPrompt'
import {useSpotifyProfile} from '../hooks/spotify'

const homepage = function () {
    const [userProfileData] = useSpotifyProfile()

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
                    Top Listened Tracks
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
