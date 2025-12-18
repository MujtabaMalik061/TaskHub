import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import Loader from "../components/Loader";
import { CalendarDays, ChevronDownIcon, RotateCcw } from "lucide-react";
import "../assets/styles/Project.css";

const Achived = () => {
  const { currentUser } = useAuth();
  const { selectedWorkSpace } = useOutletContext();

  const [projects, setProjects] = useState([]);
  const [projectProgress, setProjectProgress] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "TaskHub | Achieved";
  }, []);

  useEffect(() => {
    if (selectedWorkSpace) fetchProjects();
  }, [selectedWorkSpace]);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  const fetchProjectProgress = async (projectId) => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/tasks/progress/${projectId}?userId=${currentUser._id}`
      );
      const data = await res.json();

      if (res.ok) {
        setProjectProgress((prev) => {
          const filtered = prev.filter((item) => item.projectId !== projectId);
          return [...filtered, data];
        });
      }
    } catch (err) {
      console.error("Error fetching progress:", err);
    }
  };

  const getProgressByProjectId = (projectId) =>
    projectProgress.find((p) => p.projectId === projectId);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/project/${selectedWorkSpace}?userId=${currentUser._id}`
      );
      const data = await res.json();

      if (res.ok) {
        const projects = data.projects || [];
        setProjects(projects);
        projects.forEach((project) => fetchProjectProgress(project._id));
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const archivedProjects = projects.filter((project) => {
    const progress = getProgressByProjectId(project._id);
    return (
      progress &&
      progress.totalTasks > 0 &&
      progress.totalTasks === progress.completedTasks
    );
  });

  return loading ? (
    <Loader loading={true} style={{ height: "85vh", width: "100%" }} />
  ) : (
    <div>
      <div className="local-header flex align-item-center justify-content-space">
        <h3 className="local-header-title">Archived Projects</h3>
        <button
          className="project-info-back-btn"
          style={{ padding: "6px 8px 6px 9px" }}
          onClick={() => {
            fetchProjects();
          }}
        >
          <span style={{ fontSize: "0px" }}>
            <RotateCcw size={17} />
          </span>
          <span>Refresh</span>
        </button>
      </div>

      {archivedProjects.length > 0 ? (
        <div
          className="flex align-item-center justify-content-start"
          style={{ gap: "10px" }}
        >
          {archivedProjects.map((project, index) => {
            const progress = getProgressByProjectId(project._id);

            return (
              <div key={index} className="project-card">
                <div className="project-header">
                  <div className="project-info">
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-description">
                      {project?.discription}
                    </p>
                  </div>
                  <div className="project-status">
                    <span>Completed</span>
                  </div>
                </div>

                <div className="project-footer">
                  <span className="project-tasks">
                    {progress.completedTasks}/{progress.totalTasks} Tasks
                  </span>
                  <span className="project-date">
                    <CalendarDays className="project-calendar-icon" />
                    {formatDate(project.dueDate)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="empty-message">No archived projects found.</p>
      )}
    </div>
  );
};

export default Achived;
