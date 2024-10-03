import { invoke } from '@tauri-apps/api';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface UserFile {
  id: number;
  name: string;
  type: 'file' | 'folder';
  size: number;
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
  color: white;
  margin-bottom: 5px;
`;

const FileSize = styled.span`
  font-size: 14px;
  color: #666;
`;

const FileInfoTitle = styled.h2`
  color: white;
  margin-top: 0;
`;

const FileInfoDetail = styled.p`
  font-size: 14px;
  color: white;
`;

const FileManager: React.FC = () => {
  const [files, setFiles] = useState<UserFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<UserFile | null>(null);

  useEffect(() => {
    invoke<any>('get_folder_files', {
      folderName: localStorage.getItem('folderName')!
    }).then(result => {
      const files: UserFile[] = [];
      for (let i = 0; i < result.length; i++) {
        const [fileName, size, type] = result[i];
        files.push({
          id: i + 1,
          name: fileName,
          type: type,
          size: size,
          thumbnail: type == 'file' ? '/images/file_logo.png' : '/images/folder_logo.png'
        })
      }
      setFiles(files)
    })
  }, []);

  const handleFileClick = (file: UserFile) => {
    setSelectedFile(file);
  };

  return (
    <FileManagerContainer>
      <FileListContainer>
        {files.length === 0 ? (
          <p>No files available.</p>
        ) : (
          files.map((file) => (
            <FileItem key={file.id} onClick={() => handleFileClick(file)}>
              <FileThumbnail src={file.thumbnail} />
              <FileName>{file.name}</FileName>
              <FileSize>{file.size} bytes</FileSize>
            </FileItem>
          ))
        )}
      </FileListContainer>
      <FileInfoContainer>
        {selectedFile && (
          <div>
            <FileInfoTitle>{selectedFile.name}</FileInfoTitle>
            <FileInfoDetail>Type: {selectedFile.type}</FileInfoDetail>
            <FileInfoDetail>Size: {selectedFile.size} bytes</FileInfoDetail>
          </div>
        )}
      </FileInfoContainer>
    </FileManagerContainer>
  );
};

export default FileManager;