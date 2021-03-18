import React, {useEffect, useState} from 'react'
import {useQuery, useQueryClient} from 'react-query'
import {getHash} from '../utils/helpers'
var SpotifyWebApi = require('spotify-web-api-node')
import {spotifyClientID} from '../utils/settings'

var spotifyApi = new SpotifyWebApi({
    redirectUri: window.location.origin,
    clientId: spotifyClientID,
})

export const useSpotifyProfile: any = function () {
    const [spotifyProfile, setSpotifyProfile] = useState()

    const queryClient = useQueryClient()

    /**
     * userQuery Hooks
     */
    const hash = getHash()
    const fetchKey = 'userProfileData-' + (hash.access_token || '')

    const {isFetched, data}: any = useQuery(
        fetchKey,
        () =>
            new Promise((resolve, reject) => {
                if ('access_token' in hash) {
                    spotifyApi.setAccessToken(hash.access_token)
                    spotifyApi.getMe().then(
                        function (data: any) {
                            resolve(data.body)
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
                return queryClient.getQueryData(fetchKey)
            },
        },
    )

    useEffect(() => {
        setSpotifyProfile(data)
    }, [data])

    return spotifyProfile
}

export const useSpotifyFavoriteTracks: any = function (time_range: string) {
    const [tracks, setTracks] = useState([])

    const fetchKey = 'trackData-' + time_range
    const queryClient = useQueryClient()
    const {isFetched, isFetching, data}: any = useQuery(
        fetchKey,
        () =>
            new Promise((resolve, reject) => {
                const hash = getHash()
                console.log({isFetched, isFetching})
                if ('access_token' in hash) {
                    spotifyApi.setAccessToken(hash.access_token)
                    spotifyApi
                        .getMyTopTracks({
                            limit: 50,
                            time_range: time_range,
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
                return queryClient.getQueryData(fetchKey)
            },
        },
    )
    useEffect(() => {
        setTracks([data])
    }, [data])
    return tracks
}
