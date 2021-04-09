interface IuseSpotifyPlayer {
    play: Function
    pause: Function
    isPlaying: boolean
}

interface IuseSpotifyDevices {
    devices: any[]
    activeDevice: string
    setActiveDevice: Function
}
