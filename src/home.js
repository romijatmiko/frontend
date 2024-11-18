import React, { useState, useEffect } from "react";
import { getUsers, createUser, updateUser } from "./api";
import "bootstrap/dist/css/bootstrap.min.css";

const Home = () => {
	const [users, setUsers] = useState([]);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [successMessage, setSuccessMessage] = useState("");
	const [showModal, setShowModal] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [editingId, setEditingId] = useState(null);

	const fetchUsers = async () => {
		try {
			setLoading(true);
			const usersData = await getUsers();
			if (Array.isArray(usersData)) {
				setUsers(usersData);
				setError(null);
			}
		} catch (error) {
			setError("Failed to fetch users. Please try again later.");
			console.error("Error fetching users:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);

		if (!formData.name || !formData.email) {
			setError("Name and Email are required");
			return;
		}

		try {
			setLoading(true);
			if (isEditing && editingId) {
				const response = await updateUser(editingId, formData);
				setUsers((prevUsers) =>
					prevUsers.map((user) =>
						user._id === editingId ? response.user : user
					)
				);
				setSuccessMessage("User successfully updated!");
			} else {
				const response = await createUser(formData);
				setUsers((prevUsers) => [...prevUsers, response.user]);
				setSuccessMessage("User successfully added!");
			}
			handleCloseModal();
			setTimeout(() => setSuccessMessage(""), 3000);
		} catch (error) {
			setError(
				error.response?.data?.message || "Error saving user. Please try again."
			);
			console.error("Error saving user:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleEdit = (user) => {
		setFormData({ name: user.name, email: user.email });
		setEditingId(user._id);
		setIsEditing(true);
		setShowModal(true);
	};

	const handleCloseModal = () => {
		setShowModal(false);
		setFormData({ name: "", email: "" });
		setIsEditing(false);
		setEditingId(null);
		setError(null);
	};

	const handleShowAddModal = () => {
		setIsEditing(false);
		setEditingId(null);
		setFormData({ name: "", email: "" });
		setShowModal(true);
	};

	return (
		<div className="container mt-4">
			{/* Main Content */}
			<div className="card">
				<div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
					<h2 className="mb-0">User Management</h2>
					<button className="btn btn-light" onClick={handleShowAddModal}>
						Add New User
					</button>
				</div>
				<div className="card-body">
					{/* Success Message */}
					{successMessage && (
						<div className="alert alert-success" role="alert">
							{successMessage}
						</div>
					)}

					{/* Users Table */}
					{loading && !users.length ? (
						<div className="text-center py-4">
							<div className="spinner-border text-primary" role="status">
								<span className="visually-hidden">Loading...</span>
							</div>
						</div>
					) : (
						<div className="table-responsive">
							<table className="table table-hover">
								<thead>
									<tr>
										<th>Nomor</th>
										<th>Name</th>
										<th>Email</th>
										<th>Actions</th>
									</tr>
								</thead>
								<tbody>
									{users.map((user, index) => (
										<tr key={user._id}>
											<td>{index + 1}</td>
											<td>{user.name}</td>
											<td>{user.email}</td>
											<td>
												<button
													className="btn btn-sm btn-primary"
													onClick={() => handleEdit(user)}>
													Edit
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
					{!loading && !users.length && (
						<div className="alert alert-info" role="alert">
							No users found. Add your first user!
						</div>
					)}
				</div>
			</div>

			{/* Modal */}
			<div
				className={`modal ${showModal ? "show" : ""}`}
				style={{ display: showModal ? "block" : "none" }}>
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">
								{isEditing ? "Edit User" : "Add New User"}
							</h5>
							<button
								type="button"
								className="btn-close"
								onClick={handleCloseModal}></button>
						</div>
						<form onSubmit={handleSubmit}>
							<div className="modal-body">
								{error && (
									<div className="alert alert-danger" role="alert">
										{error}
									</div>
								)}
								<div className="mb-3 align-baseline">
									<label htmlFor="name" className="form-label">
										Name
									</label>
									<input
										type="text"
										className="form-control"
										id="name"
										name="name"
										value={formData.name}
										onChange={handleChange}
										disabled={loading}
									/>
								</div>
								<div className="mb-3 align-baseline">
									<label htmlFor="email" className="form-label">
										Email
									</label>
									<input
										type="email"
										className="form-control"
										id="email"
										name="email"
										value={formData.email}
										onChange={handleChange}
										disabled={loading}
									/>
								</div>
							</div>
							<div className="modal-footer">
								<button
									type="button"
									className="btn btn-secondary"
									onClick={handleCloseModal}
									disabled={loading}>
									Cancel
								</button>
								<button
									type="submit"
									className="btn btn-primary"
									disabled={loading}>
									{loading ? (
										<>
											<span
												className="spinner-border spinner-border-sm me-2"
												role="status"
												aria-hidden="true"></span>
											{isEditing ? "Updating..." : "Saving..."}
										</>
									) : isEditing ? (
										"Update"
									) : (
										"Save"
									)}
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
			{/* Modal Backdrop */}
			{showModal && <div className="modal-backdrop show"></div>}
		</div>
	);
};

export default Home;
