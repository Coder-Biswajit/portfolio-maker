"use client";
import React, { useState } from "react";
import {
  Edit,
  Delete,
  Visibility,
  MoreVert,
  OpenInNew,
  CalendarToday,
  WorkOutline,
} from "@mui/icons-material";
import {
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tooltip,
  Avatar,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  deletePortfolio,
  handleModal,
  setPortfolioId,
  updatePortfolioStatus,
} from "@/slices/PortfolioSlice";
import moment from "moment";
import { Status } from "@prisma/client";

const PortfolioItem = ({ portfolio }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const skills = portfolio.skillsDeliverables.split(",");

  const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    dispatch(setPortfolioId(portfolio.id));
    router.push(`/portfolio/edit/${portfolio.id}`);
  };

  const handleDelete = async () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    dispatch(deletePortfolio(portfolio.id));
    setDeleteDialogOpen(false);
  };

  const handleView = () => {
    router.push(`/profile/portfolio/${portfolio.id}`);
  };

  const handleStatusChange = async (status) => {
    try {
      dispatch(updatePortfolioStatus({ id: portfolio.id, status }));
      setAnchorEl(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div
        className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Status Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md ${
              portfolio.status === "PUBLISHED"
                ? "bg-green-100/90 text-green-800"
                : "bg-yellow-100/90 text-yellow-800"
            }`}
          >
            {portfolio.status}
          </span>
        </div>

        {/* Image Container with Gradient Overlay */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={portfolio.thumbnail}
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/400x300?text=Portfolio+Project";
            }}
            alt={portfolio.projectTitle}
            className="w-full h-full object-cover"
          />
          {/* Dark Overlay with Fade */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent transition-all duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Content Overlay - Smooth slide up */}
          <div
            className={`absolute inset-0 transition-all duration-300 ease-out ${
              isHovered
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            {/* Quick Actions - Top Right */}
            <div className="absolute top-4 right-4 flex gap-2">
              <Tooltip title="View Details">
                <IconButton
                  onClick={handleView}
                  className="bg-white/20 hover:bg-white/40 backdrop-blur-sm"
                  size="small"
                >
                  <Visibility color="white" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Open in New Tab">
                <IconButton
                  onClick={() =>
                    window.open(`/portfolio/${portfolio.id}`, "_blank")
                  }
                  className="bg-white/20 hover:bg-white/40 backdrop-blur-sm"
                  size="small"
                >
                  <OpenInNew color="white" />
                </IconButton>
              </Tooltip>
            </div>

            {/* User Info - Bottom */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-3">
                <Avatar
                  src={portfolio.user?.profile_picture}
                  alt={portfolio.user?.name}
                  className="border-2 border-white/50 shadow-lg"
                  sx={{ width: 44, height: 44 }}
                />
                <div className="text-white">
                  <h4 className="font-medium text-lg">
                    {portfolio.user?.name}
                  </h4>
                  <p className="text-sm text-white/80">{portfolio.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
              {portfolio.projectTitle}
            </h3>
              <IconButton
                size="small"
                onClick={handleMenuClick}
                className="text-gray-500 hover:text-gray-700 -mt-1"
              >
                <MoreVert />
              </IconButton>
            
          </div>

          <p className="text-gray-600 mb-4 line-clamp-2 transition-all duration-300">
            {portfolio.projectDescription}
          </p>

          {/* Skills */}
          <div className="flex flex-wrap gap-2 mb-6">
            {skills.slice(0, 4).map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors cursor-default"
              >
                {skill.trim()}
              </span>
            ))}
            {skills.length > 4 && (
              <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-gray-50 text-gray-600">
                +{skills.length - 4} more
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <div className="flex items-center text-gray-500 text-sm">
              <CalendarToday sx={{ fontSize: 16, marginRight: 1 }} />
              {moment(portfolio.createdAt).format("MMM DD, YYYY")}
            </div>
            <button
              onClick={handleView}
              className="flex items-center gap-1 px-4 py-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors font-medium text-sm"
            >
              View Project <span className="text-lg">→</span>
            </button>
          </div>
        </div>
      </div>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          PaperProps={{
            elevation: 3,
            sx: {
              mt: 1,
              minWidth: 180,
              borderRadius: "12px",
              "& .MuiMenuItem-root": {
                py: 1.5,
              },
            },
          }}
        >
          <MenuItem onClick={handleEdit} className="flex items-center gap-2">
            <Edit fontSize="small" className="text-blue-600" />
            <span className="font-medium">Edit Project</span>
          </MenuItem>
          {portfolio.status === Status.PUBLISHED && (
            <MenuItem
              onClick={() => handleStatusChange(Status.DRAFT)}
              className="flex items-center gap-2"
            >
              <Visibility fontSize="small" />
              <span className="font-medium">Move to Draft</span>
            </MenuItem>
          )}
          <MenuItem onClick={handleDelete} className="flex items-center gap-2">
            <Delete fontSize="small" className="text-red-600" />
            <span className="font-medium text-red-600">Delete Project</span>
          </MenuItem>
        </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius: "16px",
          },
        }}
      >
        <DialogTitle className="text-center pt-6">Delete Portfolio</DialogTitle>
        <DialogContent>
          <p className="text-center text-gray-600 mt-2">
            Are you sure you want to delete &quot;{portfolio.projectTitle}
            &qout;?
            <br />
            <span className="text-sm text-red-500">
              This action cannot be undone.
            </span>
          </p>
        </DialogContent>
        <DialogActions className="p-4 flex gap-2">
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            className="flex-1 py-2"
            sx={{
              borderRadius: "8px",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            className="flex-1 py-2"
            sx={{
              borderRadius: "8px",
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PortfolioItem;
