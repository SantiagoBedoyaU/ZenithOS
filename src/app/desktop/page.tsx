"use client";
import { useEffect, useState } from "react";
import { Dock } from "./components/Dock";
import { Icon } from "./components/Icon";
import Notch from "./components/Notch";
import styles from "./page.module.css";
import Window from "./components/Window";
import UsersForm from "./components/UsersForm";
import Calculator from "./components/Calculator";
import AudioReproducer from "./components/AudioReproducer";
import MediaViewer from "./components/MediaViewer";
import TextEditor from "./components/TextEditor";
import FileManager from "./components/FileManager";
import { useRouter } from "next/navigation";
import { ConfigProvider, theme, Tooltip } from "antd";
import { open } from "@tauri-apps/api/shell";
import Hangman from "./components/Hangman";
import Game2048 from "./components/2048";


export default function Desktop() {
  const router = useRouter();
  const [lastZindex, setLastZindex] = useState(2)
  const [openApps, setOpenApps] = useState({
    Calculator: { isOpen: false, zIndex: 1 },
    Users: { isOpen: false, zIndex: 1 },
    AudioReproducer: { isOpen: false, zIndex: 1 },
    ImageViewer: { isOpen: false, zIndex: 1 },
    TextEditor: { isOpen: false, zIndex: 1 },
    FileManager: { isOpen: false, zIndex: 1 },
    Browser: { isOpen: false, zIndex: 1 },
  })
  const [isAdmin, setIsAdmin] = useState(false)
  const [openedApps, setOpenedApps] = useState<{ [key: string]: { element: React.JSX.Element, name: string } }>({})

  const getUniqueID = (): string => {
    const time = Date.now().toString()
    const randn = Math.random().toString().substring(2, 8);
    return time + randn
  }

  const closeAppInstance = (instanceID: string) => {
    setOpenedApps(prevOpenedApps => {
      const newOpenedApps = { ...prevOpenedApps }
      delete newOpenedApps[instanceID]
      return newOpenedApps
    })
  }

  const openInstanceApp = (element: JSX.Element, name: string, width: string, height: string) => {
    setLastZindex(lastZindex + 1)
    const instanceID = getUniqueID();
    const w = (
      <Window zIndex={openApps.FileManager.zIndex} width={width} height={height} onClose={() => closeAppInstance(instanceID)}>
        {element}
      </Window>
    )
    setOpenedApps(prevOpenedApps => {
      const newOpenedApps = { ...prevOpenedApps }
      newOpenedApps[instanceID] = { element: w, name: name }
      return newOpenedApps
    })
  }

  const openAppByExtension = (ext: string, filepath: string) => {
    switch (ext) {
      case 'txt':
        openInstanceApp(<TextEditor filepath={filepath} />, "Text Editor", "90%", "80%")
        return
      case 'mp3':
        openInstanceApp(<AudioReproducer audioURL={filepath} />, "Audio Reproducer", "30%", "20%")
        return
      case 'mp4':
      case 'jpg':
      case 'png':
      case 'jpeg':
        openInstanceApp(<MediaViewer sourceURL={filepath} />, "Media Viewer", "60%", "70%")
        return
      default:
        console.log("unsupported file extension")
    }
  }

  const openBrowser = async () => {
    await open("https://www.google.com/")
  };

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/")
    }
    setIsAdmin(localStorage.getItem("role")?.toLowerCase() === 'admin')
  }, [])

  const getOpenApps = () => {
    return Object.entries(openedApps).map(([key, value]) => {
      return {
        key: key,
        label: (
          <Tooltip title={
            `Addres: ${key}
            Click to close process
            `
          }
          >
            <span onClick={() => closeAppInstance(key)}>{value.name}</span>
          </Tooltip>
        )
      }
    })
  }

  return (
    <ConfigProvider
      theme={{ algorithm: theme.darkAlgorithm }}
    >
      <div className={styles.desktop}>
        {Object.values(openedApps).map(app => (
          app.element
        ))}
        <Notch apps={getOpenApps()} />
        <Dock>
          <Icon
            image="/images/file_manager_logo.png"
            onClick={() => openInstanceApp(<FileManager onDoubleClick={openAppByExtension} />, "File Manager", "90%", "80%")}
          />
          {isAdmin && (
            <Icon
              image="/images/users_logo.png"
              onClick={() => openInstanceApp(<UsersForm />, "Users Manager", "90%", "80%")}
            />
          )}
          <Icon
            image="/images/calculator_logo.webp"
            onClick={() => openInstanceApp(<Calculator />, "Calculator", "50%", "55%")}
          />
          <Icon
            image="/images/audio_reproducer_logo.png"
            onClick={() => openInstanceApp(<AudioReproducer />, "Audio Reproducer", "30%", "20%")}
          />
          <Icon
            image="/images/images_logo.png"
            onClick={() => openInstanceApp(<MediaViewer />, "Media Viewer", "60%", "70%")}
          />
          <Icon
            image="/images/text_editor_logo.png"
            onClick={() => openInstanceApp(<TextEditor />, "Text Editor", "90%", "80%")}
          />
          <Icon
            image="/images/hangman_logo.jpg"
            onClick={() => openInstanceApp(<Hangman />, "Hangman", "90%", "80%")}
          />
          <Icon
            image="/images/2048_logo.png"
            onClick={() => openInstanceApp(<Game2048 />, "2048", "90%", "80%")}
          />
          <Icon
            image="/images/browser_logo.png"
            onClick={openBrowser}
          />
        </Dock>
      </div>
    </ConfigProvider>
  );
}
