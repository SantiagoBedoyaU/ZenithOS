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

export default function Desktop() {
  const router = useRouter();
  const [showUsers, setShowUsers] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showAudioReproducer, setShowAudioReproducer] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [showFileManager, setShowFileManager] = useState(false);

  const toggleShowUsers = () => {
    setShowUsers((showUsers) => !showUsers);
  };
  const toggleShowCalculator = () => {
    setShowCalculator((showCalculator) => !showCalculator);
  };
  const toggleShowAudioReproducer = () => {
    setShowAudioReproducer((showAudioReproducer) => !showAudioReproducer);
  };
  const toggleShowImageViewer = () => {
    setShowImageViewer((showImageViewer) => !showImageViewer);
  };
  const toggleShowTextEditor = () => {
    setShowTextEditor((showTextEditor) => !showTextEditor);
  };
  const toggleShowFileManager = () => {
    setShowFileManager((showFileManager) => !showFileManager);
  };

  // useEffect(() => {
  //   const user = localStorage.getItem("user")
  //   if (!user) {
  //     router.push("/")
  //   }
  // }, [])


  return (
    <div className={styles.desktop}>
      {showUsers && (
        <Window width="90%" height="80%" onClose={() => setShowUsers(false)}>
          <UsersForm />
        </Window>
      )}
      {showCalculator && (
        <Window width="50%" height="50%" onClose={() => setShowCalculator(false)}>
          <Calculator />
        </Window>
      )}
      {showAudioReproducer && (
        <Window width="30%" height="20%" onClose={() => setShowAudioReproducer(false)}>
          <AudioReproducer />
        </Window>
      )}
      {showImageViewer && (
        <Window width="60%" height="70%" onClose={() => setShowImageViewer(false)}>
          <ImageViewer />
        </Window>
      )}
      {showTextEditor && (
        <Window width="90%" height="80%" onClose={() => setShowTextEditor(false)}>
          <TextEditor />
        </Window>
      )}
      {showFileManager && (
        <Window width="90%" height="80%" onClose={() => setShowFileManager(false)}>
          <FileManager />
        </Window>
      )}
      <Notch />
      <Dock>
        <Icon image="/images/file_manager_logo.png" onClick={toggleShowFileManager} />
        <Icon image="/images/users_logo.png" onClick={toggleShowUsers} />
        <Icon image="/images/calculator_logo.webp" onClick={toggleShowCalculator} />
        <Icon image="/images/audio_reproducer_logo.png" onClick={toggleShowAudioReproducer} />
        <Icon image="/images/images_logo.png" onClick={toggleShowImageViewer} />
        <Icon image="/images/text_editor_logo.png" onClick={toggleShowTextEditor} />
      </Dock>
    </div>
  );
}
