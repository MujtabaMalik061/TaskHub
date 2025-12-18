import React, { useEffect, useState } from "react";
import "../assets/styles/ProjectInfo.css";
import API from "../utils/api";
import { ChevronDown, ChevronLeft, ChevronUp, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "./Loader";
import { useAuth } from "../contexts/AuthContext";
import {
  formatDateDDMMYY,
  formatTimeAMPM,
  groupCommentsByDate,
} from "../services/Helper";

const TaskInfo = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isWriteComment, setIsWriteComment] = useState(false);
  const [taskDetails, setTaskDetails] = useState(null);
  const [comment, setComment] = useState("");
  const [sendLoading, setSendLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTask(id);
    }
  }, [id]);

  const fetchTask = async (taskId) => {
    try {
      setLoading(true);
      const res = await API.get(`/api/tasks/taskById/${taskId}`);
      setTaskDetails(res.data.task);
    } catch (error) {
      toast.error("Failed to fetch task details");
    } finally {
      setLoading(false);
    }
  };

  const handleSendComment = async () => {
    if (!comment.trim()) return;
    try {
      setSendLoading(true);
      await API.post(`/api/tasks/${taskDetails?._id}/comment`, {
        comment,
      });
      toast.success("Comment added successfully");
      setComment("");
      setIsWriteComment(false);
      fetchTask(id);
    } catch (error) {
      toast.error("Failed to add comment");
    } finally {
      setSendLoading(false);
    }
  };

  const getFirstLetter = () => {
    if (!currentUser) return "?";
    const name = currentUser.name || currentUser.email || "";
    return name.charAt(0).toUpperCase();
  };

  const NotEligible = () => {
    return (
      <div className="project-info-container">
        <div className="project-info-header flex align-items-center justify-content-space">
          <button
            className="project-info-back-btn"
            onClick={() => {
              navigate("/mytasks");
            }}
          >
            <span style={{ fontSize: "0px" }}>
              <ChevronLeft size={20} />
            </span>
            <span>Back to Tasks</span>
          </button>
          <button
            className="project-info-back-btn"
            style={{ padding: "6px 8px 6px 9px" }}
            onClick={() => {
              fetchTask(id);
            }}
          >
            <span style={{ fontSize: "0px" }}>
              <RotateCcw size={17} />
            </span>
            <span>Refresh</span>
          </button>
        </div>
        <div className="members-empty">You are not eligible for this task</div>
      </div>
    );
  };

  const isMember = taskDetails?.assignedTo?.some(
    (member) => member._id === currentUser?._id
  );

  if (loading) {
    return (
      <div className="project-info-container">
        <Loader loading={true} size="15" color="var(--secondryColor)" />;
      </div>
    );
  } else if (!isMember) {
    return <NotEligible />;
  }

  const groupedComments = taskDetails?.comments
    ? groupCommentsByDate(
        [...taskDetails.comments].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
      )
    : {};

  return (
    <div className="project-info-container">
      <div className="project-info-header flex align-items-center justify-content-space">
        <button
          className="project-info-back-btn"
          onClick={() => {
            navigate("/mytasks");
          }}
        >
          <span style={{ fontSize: "0px" }}>
            <ChevronLeft size={20} />
          </span>
          <span>Back to Tasks</span>
        </button>
        <button
          className="project-info-back-btn"
          style={{ padding: "6px 8px 6px 9px" }}
          onClick={() => {
          fetchTask(id);
          }}
        >
          <span style={{ fontSize: "0px" }}>
            <RotateCcw size={17} />
          </span>
          <span>Refresh</span>
        </button>
      </div>
      <div className="project-info-details">
        <h2 className="project-info-title">{taskDetails?.title}</h2>
        <p className="project-info-description">
          {taskDetails?.discription || "No description provided"}
        </p>

        <div className="project-info-meta">
          <div>
            <span>Status</span>
            <strong className={`project-info-status ${taskDetails?.status}`}>
              {taskDetails?.status}
            </strong>
          </div>

          <div>
            <span>Members</span>
            <strong>{taskDetails?.assignedTo?.length || 0}</strong>
          </div>
        </div>
        <div className="project-info-dates-container flex justify-content-space">
          <div className="project-info-date flex align-items-center justify-content-center">
            <strong>Start Date:</strong>
            <span className="straight-line"></span>
            <span>{formatDateDDMMYY(taskDetails?.createdAt)}</span>
          </div>
          <div className="project-info-date flex align-items-center justify-content-center">
            <strong>Due Date:</strong>
            <span className="straight-line"></span>
            <span>{formatDateDDMMYY(taskDetails?.dueDate)}</span>
          </div>
        </div>
      </div>
      <div className="project-info-comments">
        <div className="comments-header-container flex justify-content-space">
          <div className="comments-header flex align-items-center justify-content-space">
            <h3>Comments</h3>
            <button
              onClick={() => {
                setIsWriteComment(!isWriteComment);
              }}
              className="flex align-items-center justify-content-center"
            >
              Post
              <span style={{ fontSize: "0px" }}>
                {isWriteComment ? (
                  <ChevronUp size={15} />
                ) : (
                  <ChevronDown size={15} />
                )}
              </span>
            </button>
          </div>
          {isWriteComment && (
            <div className="comments-write-container">
              <h3>Write a Comment</h3>
              <textarea
                className="form-textarea"
                placeholder="write your comment..."
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
              />
              <button disabled={sendLoading} onClick={handleSendComment}>
                {sendLoading ? (
                  <Loader
                    loading={true}
                    size="15"
                    color="var(--secondryColor)"
                  />
                ) : (
                  "Send Comment"
                )}
              </button>
            </div>
          )}
        </div>
        {Object.keys(groupedComments).length > 0 ? (
          Object.entries(groupedComments).map(([date, comments]) => (
            <div key={date} className="comments-group-container">
              <div className="comments-group-date-container">
                <span></span>
                <div>{date}</div>
              </div>

              {comments.map((comment, index) => (
                <div key={index} className="project-info-comment flex">
                  <span
                    style={{ backgroundColor: "red" }}
                    className="workspace-dropdown-item-icon"
                  >
                    {getFirstLetter()}
                  </span>

                  <div className="project-info-comment-body">
                    <div className="project-info-comment-header flex align-items-center justify-content-space">
                      <div className="project-info-comment-header-content flex">
                        <strong>{comment?.userId?.name || "Unknown"}</strong>
                        <span>{comment?.userId?.email || "Unknown"}</span>
                      </div>

                      <div className="project-info-comment-date">
                        {formatTimeAMPM(comment?.createdAt)}
                      </div>
                    </div>

                    <p className="project-info-comment-text">
                      {comment?.comment}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p className="project-info-no-comments">No comments yet</p>
        )}
      </div>
    </div>
  );
};

export default TaskInfo;
