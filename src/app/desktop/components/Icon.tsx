import styles from '../page.module.css'

type Props = {
  image: string,
  onClick: () => void
}

export const Icon = ({image, onClick}: Props) => {
  return (
    <div className={styles.icon} onClick={onClick}>
      <img className={styles.iconLogo} src={image} alt='icon'/>
    </div>
  )
}