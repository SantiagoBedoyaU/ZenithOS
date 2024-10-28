import { useEffect, useState } from 'react';
import styles from '../page.module.css';

type Props = {
  sourceURL?: string
}

export default function MediaViewer({ sourceURL }: Props) {
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaName, setMediaName] = useState('')
  const [isVideo, setIsVideo] = useState(false);

  useEffect(() => {
    if (sourceURL) {
      const path = sourceURL.split("public").pop()
      console.log(path)
      const filename = path?.split("/").pop()!
      setMediaName(filename)
      const ext = filename.split(".").pop()
      console.log(ext)
      if (ext === "mp4") {
        setIsVideo(true)
      }
      setMediaUrl(`http://localhost:3000${path}`)
    }
  }, [sourceURL])

  return (
    <div className={styles.mediaViewerContainer}>
      <label style={{marginBottom: 20}}>{mediaName}</label>
      {isVideo ? (
        <div className={styles.videoWrapper}>
          <video src={mediaUrl} controls className={styles.video} />
        </div>
      ) : (
        <div className={styles.imageWrapper}>
          <img src={mediaUrl} alt="Selected Image" className={styles.image} />
        </div>
      )
      }
    </div>
  );
}