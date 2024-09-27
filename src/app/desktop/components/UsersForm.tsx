import { invoke } from "@tauri-apps/api";
import { Button, Form, FormProps, Input, Select, Space, Table, TableProps } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";

interface DataType {
  username: string;
  role: string;
}
const columns: TableProps<DataType>["columns"] = [
  {
    title: "Username",
    dataIndex: "username",
    key: "role",
    render: (text) => <p>{text}</p>,
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
    render: (text) => <p>{text}</p>,
  },
  {
    title: "Action",
    key: "action",
    render: () => (
      <Space>
        <a>Delete</a>
      </Space>
    ),
  },
];

type FieldType = {
  username?: string;
  password?: string;
  role?: string;
};

export default function UsersForm() {
  const [errorMessage, setErrorMessage] = useState("");
  const [users, setUsers] = useState<DataType[]>([]);
  const [form] = useForm<FormProps>();

  const getUsers = () => {
    invoke<DataType[]>("get_users")
      .then((result) => {
        setUsers(result);
      })
      .catch((err) => {
        setErrorMessage(err);
      });
  }

  useEffect(() => {
    getUsers();
  }, []);

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    invoke<string>("register_user", {
      username: values.username,
      password: values.password,
      role: values.role,
    })
      .then((result) => {
        getUsers()
        form.resetFields()
      })
      .catch((error) => {
        console.log(error)
      });
  };
  return (
    <div style={{ padding: "20px" }}>
      <h2>Users</h2>
      <br />
      <Form
        name="basic"
        form={form}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input the username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input the password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: "Please input the role!" }]}
        >
          <Select
            options={[
              { value: 'Admin', label: "Admin" },
              { value: 'User', label: "User" }
            ]}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
      <Table pagination={{pageSize: 3}} columns={columns} dataSource={users} />
    </div>
  );
}
