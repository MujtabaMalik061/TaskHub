import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BadgeCheck, BadgeX } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import Loader from "../components/Loader";
import { formatDateDDMMYY } from "../services/Helper";

const InvitePage = () => {
  const { currentUser, loading } = useAuth();
  const { token } = useParams();
  const navigate = useNavigate();
  const [invite, setInvite] = useState(null);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!loading && !currentUser) {
      navigate("/login");
    }
  }, [loading, currentUser, navigate]);

  useEffect(() => {
    if (currentUser) fetchInviteDetails();
  }, [currentUser, token]);

  const fetchInviteDetails = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/workspaces/invite/${token}`
      );
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.message || "Invalid invite");
        return;
      }

      if (data.invite.invitedUser._id !== currentUser._id) {
        setStatus("error");
        setMessage("This invite is not for your account");
        return;
      }

      setInvite(data.invite);
      setStatus("ready");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMessage("Something went wrong");
    }
  };

  const handleAccept = async () => {
    const res = await fetch(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/api/workspaces/invite/accept/${token}`
    );
    const data = await res.json();

    if (res.ok) {
      navigate("/workspaces");
    } else {
      setMessage(data.message);
    }
  };

  const handleDecline = async () => {
    await fetch(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/api/workspaces/invite/decline/${token}`
    );
    navigate("/");
  };

  if (loading || status === "loading") {
    return <Loader loading size="50" />;
  }

  if (status === "error") {
    return (
      <div className="invite-page flex align-items-center justify-content-center">
        <p
          style={{
            width: "95%",
            color: "var(--dangerColor)",
            borderColor: "#b1474770",
            background: "#ff000012",
          }}
          className="members-empty error-message"
        >
          {message}
        </p>
      </div>
    );
  }

  return (
    <div className="invite-page flex align-items-center justify-content-center">
      <div className="invite-container">
        <h2>Workspace Invitation</h2>

        <div className="invite-detail-card">
          <h3>Workspace Details:-</h3>
          <div
            style={{
              whiteSpace: "nowrap",
              overflow: "auto",
              scrollbarWidth: "none",
            }}
            className="project-info-date flex align-items-center"
          >
            <strong>Name:</strong>
            <span className="straight-line"></span>
            <span>{invite.workspace.name}</span>
          </div>
          <div
            style={{
              whiteSpace: "nowrap",
              overflow: "auto",
              scrollbarWidth: "none",
            }}
            className="project-info-date flex align-items-center"
          >
            <strong>Description:</strong>
            <span className="straight-line"></span>
            <span>{invite.workspace.discription}</span>
          </div>
          <div
            style={{
              whiteSpace: "nowrap",
              overflow: "auto",
              scrollbarWidth: "none",
            }}
            className="project-info-date flex align-items-center"
          >
            <strong>Members:</strong>
            <span className="straight-line"></span>
            <span>{invite.workspace.members?.length}</span>
          </div>
          <div
            style={{
              whiteSpace: "nowrap",
              overflow: "auto",
              scrollbarWidth: "none",
            }}
            className="project-info-date flex align-items-center"
          >
            <strong>Created At:</strong>
            <span className="straight-line"></span>
            <span>{formatDateDDMMYY(invite.workspace.createdAt)}</span>
          </div>
        </div>
        <div className="invite-detail-card">
          <h3>Invite Details:-</h3>
          <div
            style={{
              whiteSpace: "nowrap",
              overflow: "auto",
              scrollbarWidth: "none",
            }}
            className="project-info-date flex align-items-center"
          >
            <strong>Invited By: </strong>
            <span>{invite.inviter.email}</span>
          </div>
          <div
            style={{
              whiteSpace: "nowrap",
              overflow: "auto",
              scrollbarWidth: "none",
            }}
            className="project-info-date flex align-items-center"
          >
            <strong>Invited To: </strong>
            <span>{invite.invitedUser.email}</span>
          </div>
          <div
            style={{
              whiteSpace: "nowrap",
              overflow: "auto",
              scrollbarWidth: "none",
            }}
            className="project-info-date flex align-items-center"
          >
            <strong>Created At:</strong>
            <span className="straight-line"></span>
            <span>{formatDateDDMMYY(invite.createdAt)}</span>
          </div>
          <div
            style={{
              whiteSpace: "nowrap",
              overflow: "auto",
              scrollbarWidth: "none",
            }}
            className="project-info-date flex align-items-center"
          >
            <strong>Expires At:</strong>
            <span className="straight-line"></span>
            <span>{formatDateDDMMYY(invite.expiresAt)}</span>
          </div>
        </div>
        <div className="invite-detail-card">
          <p className="settings-section-subtitle">
            <strong style={{ color: "var(--secondryColor)" }}>
              Please note:
            </strong>{" "}
            This action will determine your workspace membership.
          </p>
          <div className="invite-actions flex align-items-center justify-content-center">
            <button
              className="settings-save-btn"
              onClick={handleAccept}
            >
              <span style={{ fontSize: "0px" }}>
                <BadgeCheck size={14} />
              </span>
              Accept
            </button>
            <button className="settings-delete-btn" onClick={handleDecline}>
              <span style={{ fontSize: "0px" }}>
                <BadgeX size={14} />
              </span>
              Decline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitePage;
