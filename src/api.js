import axios from "axios";

const BASE_URL = "http://localhost:5000";

const api = axios.create({
	baseURL: BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

export const getUsers = async () => {
	try {
		const response = await api.get("/users");
		return response.data;
	} catch (error) {
		console.error("Error fetching users:", error);
		throw error;
	}
};

export const createUser = async (userData) => {
	try {
		const response = await api.post("/users", userData);
		return response.data;
	} catch (error) {
		console.error("Error adding user:", error);
		throw error;
	}
};

export const getUserById = async (userId) => {
	try {
		const response = await api.get(`/users/${userId}`);
		return response.data;
	} catch (error) {
		console.error("Error fetching user:", error);
		throw error;
	}
};

export const updateUser = async (userId, userData) => {
	try {
		const response = await api.put(`/users/${userId}`, userData);
		return response.data;
	} catch (error) {
		console.error("Error updating user:", error);
		throw error;
	}
};

export const deleteUser = async (userId) => {
	try {
		const response = await api.delete(`/users/${userId}`);
		return response.data;
	} catch (error) {
		console.error("Error deleting user:", error);
		throw error;
	}
};
