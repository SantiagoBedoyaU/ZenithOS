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

export default function Desktop() {
  const router = useRouter();
  const [openApps, setOpenApps] = useState({
    Calculator: false,
    Users: false,
    AudioReproducer: false,
    ImageViewer: false,
    TextEditor: false,
    FileManager: false,
    Browser: false,
  })
  const [isAdmin, setIsAdmin] = useState(false)
  const [showUsers, setShowUsers] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showAudioReproducer, setShowAudioReproducer] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [showFileManager, setShowFileManager] = useState(false);

  const toggleShowUsers = () => {
    setOpenApps((openApps) => ({ ...openApps, Users: !showUsers }))
    setShowUsers((showUsers) => !showUsers);
  };
  const toggleShowCalculator = () => {
    setOpenApps((openApps) => ({ ...openApps, Calculator: !showCalculator }))
    setShowCalculator((showCalculator) => !showCalculator);
  };
  const toggleShowAudioReproducer = () => {
    setOpenApps((openApps) => ({ ...openApps, AudioReproducer: !showAudioReproducer }))
    setShowAudioReproducer((showAudioReproducer) => !showAudioReproducer);
  };
  const toggleShowImageViewer = () => {
    setOpenApps((openApps) => ({ ...openApps, ImageViewer: !showImageViewer }))
    setShowImageViewer((showImageViewer) => !showImageViewer);
  };
  const toggleShowTextEditor = () => {
    setOpenApps((openApps) => ({ ...openApps, textEditor: !showTextEditor }))
    setShowTextEditor((showTextEditor) => !showTextEditor);
  };
  const toggleShowFileManager = () => {
    setOpenApps((openApps) => ({ ...openApps, fileManager: !showFileManager }))
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
    const apps = Object.entries(openApps).filter(value => value[1]).map((value, idx) => ({ key: String(idx + 1), label: value[0] }))
    return apps
  }

  return (
    <ConfigProvider
      theme={{ algorithm: theme.darkAlgorithm }}
    >
      <div className={styles.desktop}>
        {(showUsers && isAdmin) && (
          <Window width="90%" height="80%" onClose={() => toggleShowUsers()}>
            <UsersForm />
          </Window>
        )}
        {showCalculator && (
          <Window width="50%" height="55%" onClose={() => toggleShowCalculator()}>
            <Calculator />
          </Window>
        )}
        {showAudioReproducer && (
          <Window width="30%" height="20%" onClose={() => toggleShowAudioReproducer()}>
            <AudioReproducer />
          </Window>
        )}
        {showImageViewer && (
          <Window width="60%" height="70%" onClose={() => toggleShowImageViewer()}>
            <ImageViewer />
          </Window>
        )}
        {showTextEditor && (
          <Window width="90%" height="80%" onClose={() => toggleShowTextEditor()}>
            <TextEditor />
          </Window>
        )}
        {showFileManager && (
          <Window width="90%" height="80%" onClose={() => toggleShowFileManager()}>
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
