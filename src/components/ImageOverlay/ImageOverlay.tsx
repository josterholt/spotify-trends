import React, {useState} from 'react'

interface IImageOverlayProps {
    overlayImage: string
    onClickHandler: any
    children: JSX.Element | JSX.Element[]
}
export default function ({
    overlayImage,
    onClickHandler,
    children,
}: IImageOverlayProps) {
    const [playOverlay, setPlayOverlay] = useState(false)

    return (
        <div
            style={{position: 'absolute'}}
            onMouseEnter={() => {
                setPlayOverlay(true)
            }}
            onMouseLeave={() => setPlayOverlay(false)}
        >
            {children}
            <div
                style={{
                    position: 'absolute',
                    top: '25%',
                    left: '25%',
                    opacity: '0.75',
                }}
            >
                <a onClick={onClickHandler}>
                    {playOverlay ? (
                        <img src={overlayImage} style={{width: '75px'}} />
                    ) : null}
                </a>
            </div>
        </div>
    )
}
