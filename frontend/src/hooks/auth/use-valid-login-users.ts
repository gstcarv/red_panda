import { useEffect, useState } from 'react';

export function useValidLoginUsers() {
  const [users, setUsers] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadUsers = async () => {
      try {
        const response = await fetch('/valid-login-users.json');
        const data = (await response.json()) as string[];
        if (isMounted) {
          setUsers(data);
        }
      } catch {
        if (isMounted) {
          setUsers([]);
        }
      }
    };

    void loadUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  return users;
}
