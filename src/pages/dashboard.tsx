import useAuthStore from "../store/use-user";
import "./dashboard.css";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LoadingSpinner from "../components/loading";

type Account = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "USER" | "ADMIN" | string;
  plan: string;
  enable: boolean;
};

type Booking = {
  email: string;
  member_name: string;
  trainer_name: string;
  date: string;
  plans: string;
};

export default function Dashboard() {
  const [tab, setTab] = useState("accounts");

  const user = useAuthStore((state) => state.user);

  const navigate = useNavigate();

  const navigateToAuth = () => {
    navigate("/auth");
  };

  const handleLogout = () => {
    useAuthStore.getState().clearUser();
    navigateToAuth();
  };

  useEffect(() => {
    if (!user) navigateToAuth();
  }, [user]);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Gym Management Dashboard</h1>
        <div className="header-controls">
          <div className="date-time">
            {new Date().toLocaleString("vi-VN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <nav className="tabs">
        <button
          className={`tab-button ${tab === "accounts" ? "active" : ""}`}
          onClick={() => setTab("accounts")}
        >
          <i className="icon-users"></i>
          Manage accounts
        </button>
        <button
          className={`tab-button ${tab === "bookings" ? "active" : ""}`}
          onClick={() => setTab("bookings")}
        >
          <i className="icon-calendar"></i>
          Manage Gym Booking Schedule
        </button>
      </nav>

      <div className="content">
        {tab === "accounts" && <Account />}
        {tab === "bookings" && <Booking />}
      </div>
    </div>
  );
}

function Account() {
  const user = useAuthStore((state) => state.user);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<Account | null>(null);
  const [formData, setFormData] = useState<Partial<Account>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const token = user?.token;

    (async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://gymbe-production-233d.up.railway.app/api/authen/get-all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) throw new Error("Request failed");

        const { data } = await response.json();

        setAccounts(data);
      } catch (error: any) {
        console.error("Request failed:", error.message || error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleEdit = (accountId: string) => {
    const accountToEdit = accounts.find((acc) => acc.id === accountId);
    if (accountToEdit) {
      setCurrentAccount(accountToEdit);
      setFormData({
        name: accountToEdit.name,
        email: accountToEdit.email,
        phone: accountToEdit.phone,
        role: accountToEdit.role,
        plan: accountToEdit.plan,
        enable: accountToEdit.enable,
      });
      setShowEditForm(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentAccount) return;

    try {
      setIsSaving(true);
      setFormError("");

      const token = user?.token;

      // Create a request body with only the fields that have been changed
      const requestBody: any = {
        id: currentAccount.id, // Always include the ID in the body
      };

      // Only add fields that have been changed
      if (formData.name !== undefined) requestBody.name = formData.name;
      if (formData.email !== undefined) requestBody.email = formData.email;
      if (formData.phone !== undefined)
        requestBody.phone = formData.phone || "";
      if (formData.role !== undefined) requestBody.role = formData.role;
      if (formData.plan !== undefined) requestBody.plan = formData.plan;
      if (formData.enable !== undefined) requestBody.enable = formData.enable;

      console.log("Request body:", requestBody);

      const response = await fetch(
        "https://gymbe-production-233d.up.railway.app/api/authen/edit",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Add this for JSON body
          },
          body: JSON.stringify(requestBody), // Send data in the request body
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to update account (${response.status})`,
        );
      }

      // Update the accounts list with the edited account
      const updatedAccounts = accounts.map((acc) =>
        acc.id === currentAccount.id ? { ...acc, ...formData } : acc,
      );
      setAccounts(updatedAccounts);

      // Close the form
      setShowEditForm(false);
      setCurrentAccount(null);

      // Optional: Show success message
      alert("Account updated successfully");
    } catch (error: any) {
      setFormError(
        error.message || "An error occurred while updating the account",
      );
      console.error("Update failed:", error);
    } finally {
      setIsSaving(false);
    }
  };
  // Handle delete button click
  const handleDelete = async (accountId: string) => {
    if (!window.confirm("Are you sure you want to delete this account?"))
      return;

    try {
      const token = user?.token;

      // Construct URL with query parameter for id
      const url = new URL(
        "https://gymbe-production-233d.up.railway.app/api/authen/delete",
      );

      url.searchParams.append("id", accountId);

      const response = await fetch(url.toString(), {
        method: "POST", // Keep DELETE method
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to delete account (${response.status})`,
        );
      }
      const updatedAccounts = accounts.map((acc) =>
        acc.id === accountId ? { ...acc, enable: false } : acc,
      );
      setAccounts(updatedAccounts);

      // Optional: Show success message
      alert("Account deleted successfully");
    } catch (error: any) {
      console.error("Delete failed:", error.message || error);
      alert("Failed to delete account: " + error.message);
    }
  };

  if (isLoading) return <LoadingSpinner text="Please wait..." size="small" />;

  if (accounts.length < 1) return <div> No found account </div>;

  return (
    <div className="panel">
      {/* Edit Form Modal */}
      {showEditForm && currentAccount && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Account</h3>
              <button
                className="close-btn"
                onClick={() => setShowEditForm(false)}
              >
                &times;
              </button>
            </div>

            {formError && <div className="error-message">{formError}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="role">Role</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role || ""}
                  onChange={handleInputChange}
                  required
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                  <option value="TRAINER">Trainer</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="plan">Package</label>
                <select
                  id="plan"
                  name="plan"
                  value={formData.plan || ""}
                  onChange={handleInputChange}
                >
                  <option value="No Plan">No Plan</option>
                  <option value="Basic">Basic</option>
                  <option value="Premium">Premium</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>

              <div className="form-group checkbox">
                <label htmlFor="enable">
                  <input
                    type="checkbox"
                    id="enable"
                    name="enable"
                    checked={formData.enable}
                    onChange={handleInputChange}
                  />
                  Active
                </label>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowEditForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="save-btn" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="panel-header">
        <h2>Accounts</h2>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Package</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account: Account, index) => (
              <tr key={account?.id}>
                <td>#{index + 1}</td>
                <td>{account?.name || "N/A"}</td>
                <td>{account?.email}</td>
                <td>{account?.phone || "N/A"}</td>
                <td>
                  <span className={`badge ${account?.role.toLowerCase()}`}>
                    {account?.role}
                  </span>
                </td>
                <td>{account?.plan}</td>
                <td>
                  <span
                    className={`badge ${account?.enable ? "active" : "inactive"}`}
                  >
                    {account?.enable ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  <div className="actions">
                    <button
                      className="action-btn edit"
                      onClick={() => handleEdit(account.id)}
                    >
                      Sửa
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => handleDelete(account.id)}
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Booking() {
  const user = useAuthStore((state) => state.user);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = user?.token;

    (async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://gymbe-production-233d.up.railway.app/booking",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) throw new Error("Request failed");

        const { data } = await response.json();
        setBookings(data);
      } catch (error: any) {
        console.error("Request failed:", error.message || error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) return <LoadingSpinner text="Please wait..." size="small" />;

  if (bookings.length < 1) return <div> No found booking </div>;

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Lịch đặt tập gym</h2>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Member</th>
              <th>Email</th>
              <th>Trainer</th>
              <th>Ngày & Giờ</th>
              <th>Gói tập</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => {
              // Format date from ISO string to a more readable format
              const formattedDate = new Date(booking.date).toLocaleString(
                "vi-VN",
                {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                },
              );

              return (
                <tr key={index}>
                  <td>#{index + 1}</td>
                  <td>{booking.member_name}</td>
                  <td>{booking.email}</td>
                  <td>{booking.trainer_name}</td>
                  <td>{formattedDate}</td>
                  <td>
                    <span
                      className={`badge ${booking.plans.toLowerCase().includes("vip") ? "vip" : "standard"}`}
                    >
                      {booking.plans}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
