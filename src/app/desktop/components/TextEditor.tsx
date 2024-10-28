import { useEffect, useState } from 'react';
import styles from '../page.module.css'
import { invoke } from '@tauri-apps/api';
import { Alert } from 'antd';

type Props = {
    filepath?: string
}

export default function TextEditor({filepath}: Props) {
    const [fileContent, setFileContent] = useState('');
    const [fileName, setFileName] = useState("");
    const [fileType, setFileType] = useState('text/plain'); // default file type is text/plain, which corresponds to .txt files
    const [message, setMessage] = useState('')

    const handleSaveFile = () => {
        let filepath = fileName
        const folderName = localStorage.getItem("folderName");
        if (!fileName.includes(folderName!)) {
            filepath = `/${folderName!}/${filepath}`
        }
        invoke<string>('write_user_file', {
            foldername: localStorage.getItem("folderName"),
            filepath: filepath,
            content: fileContent
        }).then(result => {
            setMessage(result)
        }).catch(err => {
            console.error(err);
        })
    };

    const handleEditorChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFileContent(event.target.value);
    };

    const handleFileNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFileName(event.target.value);
    };

    const onClose = () => {
        setMessage("");
    };

    const getFileContent = async (path: string) => {
        const filepath = path.split("public").pop()
        const response = await fetch('http://localhost:3000/' + filepath)
        const content = await response.text()
        setFileContent(content)
        setFileName(filepath?.split("home").pop()!)
    }

    useEffect(() =>{
        if (filepath) {
            getFileContent(filepath);
        }
        const folderName = localStorage.getItem("folderName")
    }, [])

    return (
        <div className={styles.textEditor}>
            <div className={styles.toolbar}>
                <input
                    type="text"
                    value={fileName}
                    onChange={handleFileNameChange}
                    placeholder="Enter file name"
                    className={styles.fileNameInput}
                />
                {message && (
                    <Alert message={message} closable type="success" onClose={onClose} />
                )}
                <button onClick={handleSaveFile}>Save File</button>
            </div>
            <textarea
                value={fileContent}
                onChange={handleEditorChange}
                className={styles.editor}
                rows={32}
                cols={80}
            />
        </div>
    );
}