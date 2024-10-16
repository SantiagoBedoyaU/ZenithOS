// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use bcrypt::{hash, verify, DEFAULT_COST};
use serde::Serialize;
use std::{
    fs::{self, write, File},
    io::{BufRead, BufReader, Write},
    path::{self, Path},
};

#[derive(Serialize)]
struct User {
    username: String,
    role: String,
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
            create_folder_filename,
            delete_fodler_file,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
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
        let user_dir = format!("home/{}", folder_name);

        match fs::create_dir_all(user_dir) {
            Ok(_) => println!("Folder created {}", folder_name),
            Err(err) => eprintln!("Failed to create folder {}: {}", folder_name, err),
        }
    }

    Ok("Users synchronized with home folders".to_string())
}

#[tauri::command]
fn get_folder_files(folder_name: &str) -> Result<Vec<(String, u64, String)>, String> {
    let path = format!("home/{}", folder_name);
    let dir = match fs::read_dir(path) {
        Ok(dir) => dir,
        Err(_) => return Err("Failed to read directory".to_string()),
    };

    let mut files = Vec::new();
    for entry in dir {
        let entry = match entry {
            Ok(entry) => entry,
            Err(_) => continue,
        };
        let file_name = entry.file_name().to_str().unwrap().to_string();
        let file_type = if entry.file_type().unwrap().is_dir() {
            "folder".to_string()
        } else {
            "file".to_string()
        };
        let file_size = entry.metadata().unwrap().len();

        files.push((file_name, file_size, file_type));
    }

    Ok(files)
}

#[tauri::command]
fn write_user_file(folder_name: &str, filename: &str, content: &str) -> Result<String, String> {
    let path = format!("home/{}/{}", folder_name, filename);

    if let Err(err) = write(path, content) {
        return Err(err.to_string());
    }

    Ok("File written successfully!".to_string())
}

#[tauri::command]
fn create_folder_filename(folder_name: &str, filename: &str) -> Result<String, String> {
    let path = format!("home/{}/", folder_name);
    let full_path = if filename.starts_with('/') {
        let folder_name = filename.trim_start_matches('/');
        format!("{}/{}", path, folder_name)
    } else {
        format!("{}/{}", path, filename)
    };

    if filename.starts_with('/') {
        if let Err(err) = fs::create_dir_all(full_path) {
            return Err(err.to_string());
        }
        Ok("Folder {} created successfully!".to_string())
    } else {
        let file_path = full_path.clone();
        let parent_dir = file_path.clone();
        let parent_dir = parent_dir.trim_end_matches(filename).to_string();
        if let Err(err) = fs::create_dir_all(parent_dir) {
            return Err(err.to_string());
        }
        File::create(file_path)
            .map_err(|err| err.to_string())
            .map(|_| "File created successfully!".to_string())
    }
}

#[tauri::command]
fn delete_fodler_file(folder_name: &str, filename: &str) -> Result<String, String> {
    let path = format!("home/{}/{}", folder_name, filename);
    if fs::metadata(&path).is_err() {
        return Err("File not found".to_string());
    }
    if fs::metadata(&path).unwrap().is_dir() {
        if let Err(err) = fs::remove_dir(&path) {
            return Err(err.to_string());
        }
    } else {
        if let Err(err) = fs::remove_file(&path) {
            return Err(err.to_string());
        }
    }
    Ok("File deleted successfully!".to_string())
}
