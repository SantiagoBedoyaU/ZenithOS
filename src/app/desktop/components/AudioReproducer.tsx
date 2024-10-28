import { useEffect, useState } from "react";
import styles from '../page.module.css'

type Props = {
    audioURL?: string
}

export default function AudioReproducer({audioURL}: Props) {
    const [audioName, setAudioName] = useState('')
    const [audio, setAudio] = useState('')

    useEffect(() => {
        if (audioURL) {
            const path = audioURL.split("public").pop()
            setAudio(`http://localhost:3000${path}`)
            setAudioName(path?.split("/").pop()!)
        }
    }, [audioURL])

    return (
        <div className={styles.audioPlayer}>
            <label htmlFor="">{audioName}</label>
           <audio
                className={styles.audioTag}
                src={audio}
                controls
            />
        </div>
    )
}