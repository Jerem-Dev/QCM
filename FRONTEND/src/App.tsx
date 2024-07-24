import { useEffect, useState } from "react";
import "./App.css";

interface User {
  id: number;
  username: string;
}

export default function App() {
  const [users, setUsers] = useState<User[]>([]);

  const handleFetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:3000/users");
      const data = await response.json();
      setUsers(data);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log("users", users);
  }, [users]);

  return (
    <div>
      <h1>React App</h1>
      <button onClick={handleFetchUsers}>fetch Users</button>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.id} - {user.username}
          </li>
        ))}
      </ul>
    </div>
  );
}
