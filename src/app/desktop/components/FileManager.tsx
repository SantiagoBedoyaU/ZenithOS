import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface UserFile {
    id: number;
    name: string;
    type: 'file' | 'folder';
    size: number;
    path: string;
    thumbnail: string; // Add a thumbnail property for files
}

const FileManagerContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  padding: 20px;
`;

const FileListContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100vh;
  padding: 20px;
`;

const FileInfoContainer = styled.div`
  width: 300px;
  padding: 20px;
  border-left: 1px solid #ddd;
`;

const FileItem = styled.div`
  width: 180px;
  height: 180px;
  margin: 10px;
  border: 1px solid #ddd;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const FileThumbnail = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 10px;
  margin-bottom: 10px;
  margin-top: 10px;
`;

const FileName = styled.span`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const FileSize = styled.span`
  font-size: 14px;
  color: #666;
`;

const FileInfoTitle = styled.h2`
  margin-top: 0;
`;

const FileInfoDetail = styled.p`
  font-size: 14px;
  color: #666;
`;

const FileManager: React.FC = () => {
    const [files, setFiles] = useState<UserFile[]>([]);
    const [currentPath, setCurrentPath] = useState('/');
    const [selectedFile, setSelectedFile] = useState<UserFile | null>(null);

    useEffect(() => {
        // Load files for the current path
        const loadFiles = async () => {
            // Replace with your own file system API or mock data
            const files: UserFile[] = [
                {
                    id: 1,
                    name: 'File 1.txt',
                    type: 'file',
                    size: 1024,
                    path: '/',
                    thumbnail: 'https://via.placeholder.com/100x100',
                },
                {
                    id: 2,
                    name: 'Folder 1',
                    type: 'folder',
                    size: 0,
                    path: '/',
                    thumbnail: 'https://via.placeholder.com/100x100',
                },
                {
                    id: 3,
                    name: 'File 2.txt',
                    type: 'file',
                    size: 2048,
                    path: '/',
                    thumbnail: 'https://via.placeholder.com/100x100',
                },
            ];
            setFiles(files);
        };
        loadFiles();
    }, [currentPath]);

    const handleFileClick = (file: UserFile) => {
        setSelectedFile(file);
    };

    return (
        <FileManagerContainer>
            <FileListContainer>
                {files.map((file) => (
                    <FileItem key={file.id} onClick={() => handleFileClick(file)}>
                        <FileThumbnail src={file.thumbnail} />
                        <FileName>{file.name}</FileName>
                        <FileSize>{file.size} bytes</FileSize>
                    </FileItem>
                ))}
            </FileListContainer>
            <FileInfoContainer>
                {selectedFile && (
                    <div>
                        <FileInfoTitle>{selectedFile.name}</FileInfoTitle>
                        <FileInfoDetail>Type: {selectedFile.type}</FileInfoDetail>
                        <FileInfoDetail>Size: {selectedFile.size} bytes</FileInfoDetail>
                        <FileInfoDetail>Path: {selectedFile.path}</FileInfoDetail>
                    </div>
                )}
            </FileInfoContainer>
        </FileManagerContainer>
    );
};

export default FileManager;