import React, {useEffect, useState} from 'react'
import {useQuery, useQueryClient} from 'react-query'
import {getAccessToken, clearAccessToken} from '../utils/helpers'
var SpotifyWebApi = require('spotify-web-api-node')
import {spotifyClientID} from '../utils/settings'

var spotifyApi: typeof SpotifyWebApi = new SpotifyWebApi({
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
                            if (err.indexOf('access denied') !== -1) {
                                clearAccessToken()
                            }
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

export const useSpotifyFavoriteTracks: any = function (time_range: any) {
    const [tracks, setTracks] = useState([])

    const fetchKey = 'trackData-' + time_range
    const queryClient = useQueryClient()
    const {data}: any = useQuery(
        fetchKey,
        () =>
            new Promise((resolve, reject) => {
                const accessToken = getAccessToken()
                if (accessToken) {
                    spotifyApi.setAccessToken(accessToken)
                    spotifyApi
                        .getMyTopTracks({
                            limit: 50,
                            time_range,
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
    const [contextURI, setContextURI] = useState(null)
    const [activeDevice, setActiveDevice] = useState(null)
    const [position, setPosition] = useState(0)

    let track = {
        contextURI,
        offset: position,
    }

    function play(device_id: string, context_uri: string, position: number) {
        const accessToken = getAccessToken()
        setContextURI(context_uri)
        setActiveDevice(device_id)
        setPosition(position)

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
    }

    function pause(device_id: string) {
        spotifyApi.pause({device_id}, function () {
            setPlaying(false)
        })
    }

    function togglePlay(context_uri: string, offset: number) {
        if (!isPlaying || context_uri !== track.contextURI) {
            play(activeDevice, context_uri, offset)
        } else {
            pause(activeDevice)
        }
    }

    return {
        play,
        pause,
        togglePlay,
        activeDevice,
        setActiveDevice,
        isPlaying,
        track,
    }
}

export const useSpotifyDevices: any = function (): IuseSpotifyDevices {
    const [availableDevices, setAvailableDevices] = useState([])

    useEffect(() => {
        spotifyApi.getMyDevices().then(function (data: any) {
            setAvailableDevices(data.body.devices)
        })
    }, [])

    return {
        availableDevices,
    }
}
