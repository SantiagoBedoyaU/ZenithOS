import styles from "../page.module.css";
import Draggable from "react-draggable";

type Props = {
  onClose: () => void;
  children?: React.ReactNode;
  width: string;
  height: string;
  zIndex: number;
};

export default function Window({ onClose, children, width, height, zIndex }: Props) {
  return (
    <Draggable
      bounds="parent"
    >
      <div className={styles.window} style={{ width, height, zIndex }}>
        <div className={styles.windowBar}>
          <div className={styles.closeButton} onClick={onClose} />
        </div>
        {children}
      </div>
    </Draggable>
  );
}
