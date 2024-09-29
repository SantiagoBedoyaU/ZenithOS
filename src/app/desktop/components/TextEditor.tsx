import { useState } from 'react';
import styles from '../page.module.css'
import { invoke } from '@tauri-apps/api';
import { Alert } from 'antd';

export default function TextEditor() {
    const [fileContent, setFileContent] = useState('');
    const [fileName, setFileName] = useState('');
    const [fileType, setFileType] = useState('text/plain'); // default file type is text/plain, which corresponds to .txt files
    const [message, setMessage] = useState('')

    const handleOpenFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files![0];
        const fileReader = new FileReader();
        fileReader.onload = () => {
            setFileContent(fileReader.result as string);
            setFileName(file.name);
            setFileType(file.type);
        };
        fileReader.readAsText(file);
    };

    const handleSaveFile = () => {
        invoke<string>('write_user_file', {
            folderName: localStorage.getItem("folderName"),
            filename: fileName,
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

    return (
        <div className={styles.textEditor}>
            <div className={styles.toolbar}>
                <input type="file" onChange={handleOpenFile} />
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