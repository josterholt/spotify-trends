interface IuseSpotifyPlayer {
    play: Function
    pause: Function
    isPlaying: boolean
    activeDevice: string
    setActiveDevice: Function
    togglePlay: Function
    track: ITrackInfo
}

interface IuseSpotifyDevices {
    availableDevices: any[]
}

interface ITrackInfo {
    //activeDevice: string
    contextURI: string
    offset: number
}
