"use client";
import { invoke } from "@tauri-apps/api";
import styles from "./page.module.css";
import { Input, Button, Form, FormProps, Alert } from "antd";
import { useState } from "react";
import { useRouter } from "next/navigation";

type FieldType = {
  username?: string;
  password?: string;
};

export default function Login() {
  const [message, setMessage] = useState("");
  const router = useRouter();
  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    invoke<string>("login", {
      username: values.username,
      password: values.password,
    })
      .then((result) => {
        const [user, role] = result.split(":")
        localStorage.setItem('user', user)
        localStorage.setItem('role', role)
        router.push("/desktop");
      })
      .catch((error) => setMessage(error));
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo,
  ) => {
    console.log("Failed:", errorInfo);
  };

  const onClose = () => {
    setMessage("");
  };
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.login}>
          <h1 className={styles.title}>ZenithOS</h1>
          {message && (
            <Alert message={message} closable type="error" onClose={onClose} />
          )}
          <br />
          <Form
            name="basic"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[
                { required: true, message: "Please input your username" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password" },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form>
        </div>
      </main>
    </div>
  );
}
