"use client";

import { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type UserRecord = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: string | Date;
};

type UsersApiResponse = {
  data: UserRecord[];
};

function UserList() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchUsers() {
      try {
        const response = await fetch("/api/users", { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const json = (await response.json()) as UsersApiResponse;
        setUsers(json.data);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError("Failed to load users");
      } finally {
        setIsLoading(false);
      }
    }

    void fetchUsers();

    return () => {
      controller.abort();
    };
  }, []);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading users...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Verified</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length ? (
          users.map((record) => (
            <TableRow key={record.id}>
              <TableCell>{record.name}</TableCell>
              <TableCell>{record.email}</TableCell>
              <TableCell>{record.emailVerified ? "Yes" : "No"}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell className="text-muted-foreground" colSpan={3}>
              No users found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export { UserList };
