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
import ImageViewer from "./components/ImageViewer";
import TextEditor from "./components/TextEditor";
import FileManager from "./components/FileManager";
import { useRouter } from "next/navigation";
import { ConfigProvider, theme } from "antd";
import { open } from "@tauri-apps/api/shell";
import {randomUUID} from 'crypto'

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
  const [showUsers, setShowUsers] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showAudioReproducer, setShowAudioReproducer] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [showFileManager, setShowFileManager] = useState(false);

  const toggleShowUsers = () => {
    setLastZindex(lastZindex + 1)
    setOpenApps((openApps) => ({
      ...openApps,
      Users: {
        isOpen: !openApps.Users.isOpen,
        zIndex: lastZindex
      }
    }))
    setShowUsers((showUsers) => !showUsers);
  };
  const toggleShowCalculator = () => {
    setLastZindex(lastZindex + 1)
    setOpenApps((openApps) => ({
      ...openApps,
      Calculator: {
        isOpen: !openApps.Calculator.isOpen,
        zIndex: lastZindex
      }
    }))
    setShowCalculator((showCalculator) => !showCalculator);
  };
  const toggleShowAudioReproducer = () => {
    setLastZindex(lastZindex + 1)
    setOpenApps((openApps) => ({
      ...openApps,
      AudioReproducer: {
        isOpen: !openApps.AudioReproducer.isOpen,
        zIndex: lastZindex
      }
    }))
    setShowAudioReproducer((showAudioReproducer) => !showAudioReproducer);
  };
  const toggleShowImageViewer = () => {
    setLastZindex(lastZindex + 1)
    setOpenApps((openApps) => ({
      ...openApps,
      ImageViewer: {
        isOpen: !openApps.ImageViewer.isOpen,
        zIndex: lastZindex
      }
    }))
    setShowImageViewer((showImageViewer) => !showImageViewer);
  };
  const toggleShowTextEditor = () => {
    setLastZindex(lastZindex + 1)
    setOpenApps((openApps) => ({
      ...openApps,
      TextEditor: {
        isOpen: !openApps.TextEditor.isOpen,
        zIndex: lastZindex
      }
    }))
    setShowTextEditor((showTextEditor) => !showTextEditor);
  };
  const toggleShowFileManager = () => {
    setLastZindex(lastZindex + 1)
    setOpenApps((openApps) => ({
      ...openApps,
      FileManager: {
        isOpen: !openApps.FileManager.isOpen,
        zIndex: lastZindex
      }
    }))
    setShowFileManager((showFileManager) => !showFileManager);
  };

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
    const apps = Object.entries(openApps)
      .filter(value => value[1].isOpen)
      .map((value, idx) => {
        const randomHex = () => Math.floor(Math.random() * 0xFFFFFFF).toString()
        const id = `0x${randomHex()}`
        return {
          key: String(idx + 1), 
          label: `${id} - ${value[0]}` 
        }
      })
    return apps
  }

  return (
    <ConfigProvider
      theme={{ algorithm: theme.darkAlgorithm }}
    >
      <div className={styles.desktop}>
        {(showUsers && isAdmin) && (
          <Window zIndex={openApps.Users.zIndex} width="90%" height="80%" onClose={() => toggleShowUsers()}>
            <UsersForm />
          </Window>
        )}
        {showCalculator && (
          <Window zIndex={openApps.Calculator.zIndex} width="50%" height="55%" onClose={() => toggleShowCalculator()}>
            <Calculator />
          </Window>
        )}
        {showAudioReproducer && (
          <Window zIndex={openApps.AudioReproducer.zIndex} width="30%" height="20%" onClose={() => toggleShowAudioReproducer()}>
            <AudioReproducer />
          </Window>
        )}
        {showImageViewer && (
          <Window zIndex={openApps.ImageViewer.zIndex} width="60%" height="70%" onClose={() => toggleShowImageViewer()}>
            <ImageViewer />
          </Window>
        )}
        {showTextEditor && (
          <Window zIndex={openApps.TextEditor.zIndex} width="90%" height="80%" onClose={() => toggleShowTextEditor()}>
            <TextEditor />
          </Window>
        )}
        {showFileManager && (
          <Window zIndex={openApps.FileManager.zIndex} width="90%" height="80%" onClose={() => toggleShowFileManager()}>
            <FileManager />
          </Window>
        )}
        <Notch apps={getOpenApps()} />
        <Dock>
          <Icon image="/images/file_manager_logo.png" onClick={toggleShowFileManager} />
          {isAdmin && (
            <Icon image="/images/users_logo.png" onClick={toggleShowUsers} />
          )}
          <Icon image="/images/calculator_logo.webp" onClick={toggleShowCalculator} />
          <Icon image="/images/audio_reproducer_logo.png" onClick={toggleShowAudioReproducer} />
          <Icon image="/images/images_logo.png" onClick={toggleShowImageViewer} />
          <Icon image="/images/text_editor_logo.png" onClick={toggleShowTextEditor} />
          <Icon image="/images/browser_logo.png" onClick={openBrowser} />
        </Dock>
      </div>
    </ConfigProvider>
  );
}
