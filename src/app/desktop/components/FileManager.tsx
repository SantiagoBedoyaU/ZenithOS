import { invoke } from "@tauri-apps/api";
import { Tree, TreeDataNode, Form, Input, Button } from "antd";
import { DirectoryTreeProps } from "antd/es/tree";
import React, { useState, useEffect } from "react";

type Props = {
  onDoubleClick: (ext: string, filepath: string) => void
}

const FileManager = ({onDoubleClick: openAppByExtension}: Props) => {
  const [files, setFiles] = useState<TreeDataNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [selectedFilePath, setSelectedFilePath] = useState<string>("");

  const getFolderFiles = () => {
    setFiles([]);
    invoke<TreeDataNode[]>("get_folder_files", {
      folderName: localStorage.getItem("folderName")!,
    }).then((result) => {
      setFiles(result);
    });
  };

  useEffect(() => {
    getFolderFiles();
  }, []);

  const onCreateFile = () => {
    invoke<String>('create_file', {
      foldername: localStorage.getItem("folderName"),
      filepath: `${selectedFilePath}/${selectedFile}`,
    }).then(() => {
      getFolderFiles()
    }).catch(err => console.error(err))
  };

  const onCreateFolder = () => {
    invoke<String>('create_folder', {
      foldername: localStorage.getItem("folderName"),
      folderpath: `${selectedFilePath}/${selectedFile}`,
    }).then(() => {
      getFolderFiles()
    }).catch(err => console.error(err))
  }

  const onDelete = () => {
    invoke<String>('delete_folder_file', {
      foldername: localStorage.getItem("folderName"),
      filepath: selectedFilePath,
    }).then(() => {
      getFolderFiles()
    }).catch(err => console.error(err));
  }

  const onSelect: DirectoryTreeProps["onSelect"] = (keys, info) => {
    setSelectedFilePath(info.node.key as string);
    setSelectedFile(info.node.title as string);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSelectedFile(value);
  };

  const onDoubleClick: DirectoryTreeProps["onDoubleClick"] = (params, info) => {
    const filename = (info.key as string).split("/").pop()
    const ext = filename?.split(".").pop()!
    openAppByExtension(ext, info.key as string)
  }

  return (
    <div>
      <div>
        <Input
          value={selectedFile}
          onChange={onChange}
          style={{
            marginBottom: 8,
            marginTop: 8,
            display: "inline",
            width: "81.5%",
            marginRight: 5,
          }}
        />
        <Button
          style={{ display: "inline", marginRight: 5 }}
          onClick={onCreateFile}
        >
          Create File
        </Button>
        <Button
          style={{ display: "inline", marginRight: 5 }}
          onClick={onCreateFolder}
        >
          Create Folder
        </Button>
        <Button
          style={{ display: "inline" }}
          onClick={onDelete}
        >
          Delete
        </Button>
      </div>
      <Tree.DirectoryTree
        multiple
        defaultExpandAll
        treeData={files}
        onSelect={onSelect}
        onDoubleClick={onDoubleClick}
      />
    </div>
  );
};

export default FileManager;
