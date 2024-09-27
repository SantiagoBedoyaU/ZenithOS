// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use bcrypt::{hash, verify, DEFAULT_COST};
use serde::Serialize;
use std::{
    fs::{self, File},
    io::{BufRead, BufReader, Write},
    path::Path,
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
            sync_users_with_home
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
            if user == username {
                if verify(password, pass).expect("failed to verify the password") {
                    return Ok(format!("{}:{}", user, role));
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
    writeln!(file, "{}:{}:{}", username, hashed_password, role)
        .expect("failed to write in the file");

    let user_dir = format!("home/{}", username);
    fs::create_dir_all(user_dir).expect("failed to create user directory");
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

        let username = parts[0];
        let user_dir = format!("home/{}", username);

        match fs::create_dir_all(user_dir) {
            Ok(_) => println!("Folder created for user {}", username),
            Err(err) => eprintln!("Failed to create folder for user {}: {}", username, err),
        }
    }

    Ok("Users synchronized with home folders".to_string())
}
