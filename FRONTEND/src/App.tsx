import { useEffect, useState } from "react";
import "./App.css";
import LoginForm from "./components/LoginForm";

interface User {
  id: number;
  username: string;
}

export default function App() {
  const [users, setUsers] = useState<User[]>([]);

  const handleFetchUsers = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await fetch("http://localhost:3000/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUsers(data);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("No token");
    }
  };

  useEffect(() => {
    console.log("users", users);
  }, [users]);

  const handleCreateUser = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "John Doe hashed",
          password: "password",
        }),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>React App</h1>
      <button onClick={handleFetchUsers}>fetch Users</button>
      <button onClick={handleCreateUser}>Create User</button>
      <LoginForm />
      {users.length > 0 && (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.id} - {user.username}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
