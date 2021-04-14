import React, {useEffect, useState} from 'react'
import {useQuery, useQueryClient} from 'react-query'
import {getAccessToken} from '../utils/helpers'
var SpotifyWebApi = require('spotify-web-api-node')
import {spotifyClientID} from '../utils/settings'

var spotifyApi = new SpotifyWebApi({
    redirectUri: window.location.origin,
    clientId: spotifyClientID,
})

export const useSpotifyProfile: any = function () {
    const [spotifyProfile, setSpotifyProfile] = useState([])
    const queryClient = useQueryClient()

    const accessToken = getAccessToken()
    const fetchKey = 'userProfileData-' + (accessToken || '')

    const {isFetched, data}: any = useQuery(
        fetchKey,
        () =>
            new Promise((resolve, reject) => {
                if (accessToken) {
                    spotifyApi.setAccessToken(accessToken)
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
        setSpotifyProfile([data])
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
                const accessToken = getAccessToken()
                if (accessToken) {
                    spotifyApi.setAccessToken(accessToken)
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

export const useSpotifyPlayer: any = function () {
    const [isPlaying, setPlaying] = useState(false)

    return {
        play: function (
            device_id: string,
            context_uri: string,
            position: number,
        ) {
            const accessToken = getAccessToken()

            if (accessToken) {
                const options = {
                    device_id,
                    context_uri,
                    offset: {
                        position: position,
                    },
                    position_ms: 0,
                }
                spotifyApi.setAccessToken(accessToken)

                spotifyApi.play(options, function () {
                    setPlaying(true)
                })
            }
        },
        pause: (device_id: string) => {
            spotifyApi.pause({device_id}, function () {
                setPlaying(false)
            })
        },
        isPlaying,
    }
}

export const useSpotifyDevices: any = function (): IuseSpotifyDevices {
    const [activeDevice, setActiveDevice] = useState(null)
    const [availableDevices, setAvailableDevices] = useState([])

    useEffect(() => {
        spotifyApi.getMyDevices().then(function (data: any) {
            setAvailableDevices(data.body.devices)
        })
    }, [])

    return {
        devices: availableDevices,
        activeDevice,
        setActiveDevice,
    }
}
