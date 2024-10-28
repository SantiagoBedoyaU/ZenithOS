// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use bcrypt::{hash, verify, DEFAULT_COST};
use serde::Serialize;
use std::{
    env,
    fs::{self, write, File},
    io::{BufRead, BufReader, Write},
    path::Path,
};

#[derive(Serialize)]
struct User {
    username: String,
    role: String,
}

#[derive(Serialize)]
struct FileNode {
    key: String,
    title: String,
    #[serde(rename = "isLeaf")]
    is_leaf: bool,
    children: Option<Vec<FileNode>>,
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            login,
            get_users,
            register_user,
            sync_users_with_home,
            get_folder_files,
            write_user_file,
            create_file,
            create_folder,
            delete_folder_file,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn get_data_folder() -> Result<String, String> {
    let current_dir = env::current_dir().map_err(|err| err.to_string())?;
    let parent_dir = current_dir.parent().ok_or("No parent directory found")?;
    let public_dir = parent_dir.join("public");

    let home_dir = public_dir.join("home");
    return Ok(home_dir.to_string_lossy().to_string());
}

#[tauri::command]
fn login(username: &str, password: &str) -> Result<String, String> {
    let file_path = "user_data.txt";
    let file_exists = Path::new(file_path).is_file();

    if !file_exists {
        File::create(file_path).expect("Failed to create file");
    }
    if let Ok(data) = fs::read_to_string(file_path) {
        for line in data.lines() {
            let parts = line.split(':').collect::<Vec<&str>>();
            let user = parts[0];
            let pass = parts[1];
            let role = parts[2];
            let folder_name = parts[3];
            if user == username {
                if verify(password, pass).expect("failed to verify the password") {
                    return Ok(format!("{}:{}:{}", user, role, folder_name));
                }
            }
        }
    }

    Err("Username or password is incorrect".to_string())
}

#[tauri::command]
fn get_users() -> Vec<User> {
    let mut users = Vec::new();

    let file = File::open("user_data.txt").expect("failed to open file");
    let reader = BufReader::new(file);

    for line in reader.lines() {
        let line = line.expect("failed to read line");
        let parts = line.split(':').collect::<Vec<&str>>();

        let username = parts[0].to_string();
        let role = parts[2].to_string();

        let user = User { username, role };

        users.push(user)
    }

    return users;
}

#[tauri::command]
fn register_user(username: &str, password: &str, role: &str) -> Result<String, String> {
    let users = get_users();
    for user in users {
        if user.username == username {
            return Err("Username already exists".to_string());
        }
    }

    let mut file = File::options()
        .write(true)
        .append(true)
        .open("user_data.txt")
        .expect("failed to open file");

    let hashed_password = hash(password, DEFAULT_COST).expect("failed to hash password");
    let folder_name = username
        .to_lowercase()
        .replace(|c: char| !c.is_alphanumeric(), "");
    writeln!(
        file,
        "{}:{}:{}:{}",
        username, hashed_password, role, folder_name
    )
    .expect("failed to write in the file");

    sync_users_with_home().expect("failed to sync users with home");
    Ok("User registered successfully".to_string())
}

#[tauri::command]
fn sync_users_with_home() -> Result<String, String> {
    let file_path = "user_data.txt";
    let file = File::open(file_path).expect("Failed to open file");
    let reader = BufReader::new(file);

    for line in reader.lines() {
        let line = line.expect("Failed to read line");
        let parts = line.split(':').collect::<Vec<&str>>();

        let folder_name = parts[parts.len() - 1];
        let user_dir = format!("{}/{}", get_data_folder()?, folder_name);

        match fs::create_dir_all(&user_dir) {
            Ok(_) => {},
            Err(err) => eprintln!("Failed to create folder {}: {}", folder_name, err),
        }

        let subfolders = [
            "Documents",
            "Desktop",
            "Downloads",
            "Videos",
            "Music",
            "Photos",
        ];
        for subfolder in subfolders.iter() {
            let subfolder_path = format!("{}/{}", user_dir, subfolder);
            match fs::create_dir_all(&subfolder_path) {
                Ok(_) => {},
                Err(err) => eprintln!("Failed to create subfolder {}: {}", subfolder, err),
            }
        }
    }

    Ok("Users synchronized with home folders".to_string())
}

#[tauri::command]
fn get_folder_files(folder_name: &str) -> Result<Vec<FileNode>, String> {
    let user_path = format!("{}/{}", get_data_folder()?, folder_name);
    let root_path = Path::new(&user_path);

    if !root_path.is_dir() {
        return Err("El directorio no existe o no es accesible".to_string());
    }

    fn build_tree(path: &Path) -> Result<FileNode, String> {
        let metadata = path.metadata().map_err(|_| "Error al obtener metadata")?;
        let is_leaf = !metadata.is_dir();
        let title = path.file_name().unwrap().to_string_lossy().to_string();
        let key = path.to_string_lossy().to_string();

        let children = if !is_leaf {
            let entries = fs::read_dir(path).map_err(|_| "Error al leer directorio")?;
            let mut child_nodes = Vec::new();

            for entry in entries {
                let entry = entry.map_err(|_| "Error al obtener entrada de directorio")?;
                let child_path = entry.path();
                let child_node = build_tree(&child_path)?;
                child_nodes.push(child_node);
            }
            Some(child_nodes)
        } else {
            None
        };

        Ok(FileNode {
            key,
            title,
            is_leaf,
            children,
        })
    }

    let mut files = Vec::new();
    for entry in fs::read_dir(root_path).map_err(|_| "Error al leer el directorio raíz")? {
        let entry = entry.map_err(|_| "Error al obtener entrada de directorio raíz")?;
        let path = entry.path();
        let file_node = build_tree(&path)?;
        files.push(file_node);
    }

    Ok(files)
}

#[tauri::command]
fn write_user_file(foldername: &str, filepath: &str, content: &str) -> Result<String, String> {
    if !filepath.contains(foldername) {
        return Err("Invalid file path".to_string());
    }

    let path = format!("{}{}", get_data_folder()?, filepath);
    if let Err(err) = write(path, content) {
        return Err(err.to_string());
    }

    Ok("File written successfully!".to_string())
}

#[tauri::command]
fn create_file(foldername: &str, filepath: &str) -> Result<String, String> {
    if !filepath.contains(foldername) {
        return Err("Invalid route to file".to_string());
    }

    File::create(filepath)
        .map_err(|err| err.to_string())
        .map(|_| "File created successfully!".to_string())
}

#[tauri::command]
fn create_folder(foldername: &str, folderpath: &str) -> Result<String, String> {
    if !folderpath.contains(foldername) {
        return Err("Invalid route to file".to_string());
    }

    fs::create_dir_all(folderpath)
        .map_err(|err| err.to_string())
        .map(|_| "Folder created successfully".to_string())
}

#[tauri::command]
fn delete_folder_file(foldername: &str, filepath: &str) -> Result<String, String> {
    if !filepath.contains(foldername) {
        return Err("Invalid route".to_string());
    }
    if fs::metadata(&filepath).is_err() {
        return Err("File not found".to_string());
    }
    if fs::metadata(&filepath).unwrap().is_dir() {
        if let Err(err) = fs::remove_dir(&filepath) {
            return Err(err.to_string());
        }
    } else {
        if let Err(err) = fs::remove_file(&filepath) {
            return Err(err.to_string());
        }
    }
    Ok("File deleted successfully!".to_string())
}
