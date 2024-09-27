import { useState } from 'react';
import styles from '../page.module.css';

export default function MediaViewer() {
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const [isVideo, setIsVideo] = useState(false);

  const handleMediaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaUrl(reader.result as string);
      setMediaLoaded(true);
      setIsVideo(file.type.startsWith('video/'));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={styles.mediaViewerContainer}>
      <div className={styles.inputWrapper}>
        <input type="file" accept="image/*,video/*" onChange={handleMediaChange} />
      </div>
      {mediaLoaded ? (
        isVideo ? (
          <div className={styles.videoWrapper}>
            <video src={mediaUrl} controls className={styles.video} />
          </div>
        ) : (
          <div className={styles.imageWrapper}>
            <img src={mediaUrl} alt="Selected Image" className={styles.image} />
          </div>
        )
      ) : (
        <p className={styles.noMediaSelected}>No media selected</p>
      )}
    </div>
  );
}