"use client";
import { useCreateUserHandler } from "@/services/UserService";
import { useState } from "react";

const CreateUserForm = () => {
  const createUser = useCreateUserHandler();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const user = await createUser(formData); // ✅ usage here
      setSuccess(`User ${user.name} created successfully!`);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded">
      <div>
        <label>Name</label>
        <input
          className="border px-2 py-1 w-full"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div>
        <label>Email</label>
        <input
          className="border px-2 py-1 w-full"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      <div>
        <label>Role</label>
        <input
          className="border px-2 py-1 w-full"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Create User
      </button>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}
    </form>
  );
};

export default CreateUserForm;
