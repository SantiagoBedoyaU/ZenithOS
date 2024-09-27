import { useState } from "react";
import styles from '../page.module.css'

export default function AudioReproducer() {
    const [uploadedAudio, setUploadedAudio] = useState<File | null>(null);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadedAudio(file);
        }
    };

    return (
        <div className={styles.audioPlayer}>
            <input
                type="file"
                accept=".mp3"
                onChange={handleUpload}
                className={styles.fileInput}
            />
            <audio
                className={styles.audioTag}
                src={uploadedAudio ? URL.createObjectURL(uploadedAudio) : 'path/to/default/audio/file.mp3'}
                controls
            />
        </div>
    )
}