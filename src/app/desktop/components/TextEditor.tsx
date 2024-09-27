import { useState } from 'react';
import styles from '../page.module.css'

export default function TextEditor() {
    const [fileContent, setFileContent] = useState('');
    const [fileName, setFileName] = useState('');
    const [fileType, setFileType] = useState('text/plain'); // default file type is text/plain, which corresponds to .txt files

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
        const blob = new Blob([fileContent], { type: fileType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName + ".txt" || 'untitled.txt'; // if fileName is empty, default to 'untitled.txt'
        a.click();
    };

    const handleEditorChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFileContent(event.target.value);
    };

    const handleFileNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFileName(event.target.value);
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
                <button onClick={handleSaveFile}>Save File</button>
            </div>
            <textarea
                value={fileContent}
                onChange={handleEditorChange}
                className={styles.editor}
                rows={30}
                cols={80}
            />
        </div>
    );
}