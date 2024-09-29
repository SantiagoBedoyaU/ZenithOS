'use client'
import { useEffect, useState } from "react";
import styles from '../page.module.css'
import { Dropdown, Space } from "antd";
import { exit } from '@tauri-apps/api/process'
import { useRouter } from "next/navigation";

type Props = {
  apps: { key: string, label: string }[]
}

export const Notch = ({ apps }: Props) => {
  const [date, setDate] = useState(new Date());
  const router = useRouter()

  const onPowerOff = () => {
    exit()
  }
  const onLogout = () => {
    localStorage.clear()
    router.back()
  }

  const items = [
    {
      label: <div onClick={onPowerOff}>Power Off</div>,
      key: '1'
    }, {
      label: <div onClick={onLogout}>Log out</div>,
      key: '2'
    }
  ]

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDate(new Date());
    }, 1000); // update every 1 second

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={styles.notch}>
      <Dropdown menu={{ items: apps }} trigger={['click']} >
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            <img className={styles.apps} src="/images/apps_logo.jpg" alt="poweroff" />
          </Space>
        </a>
      </Dropdown>
      <span>{date.toLocaleDateString()}</span>
      <span style={{ marginLeft: 8 }}>{date.toLocaleTimeString()}</span>
      <Dropdown menu={{ items }} trigger={['click']} >
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            <img className={styles.powerOff} src="/images/poweroff_logo.png" alt="poweroff" />
          </Space>
        </a>
      </Dropdown>
    </div>
  );
};

export default Notch;