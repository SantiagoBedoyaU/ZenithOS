import styles from "../page.module.css";

type Props = {
  onClose: () => void;
  children?: React.ReactNode;
  width: string;
  height: string;
};

export default function Window({ onClose, children, width, height }: Props) {
  return (
    <div className={styles.window} style={{ width, height }}>
      <div className={styles.windowBar}>
        <div className={styles.closeButton} onClick={onClose} />
      </div>
      {children}
    </div>
  );
}
