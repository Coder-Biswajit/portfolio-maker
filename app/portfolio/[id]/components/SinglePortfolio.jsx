"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Container,
  Typography,
  useTheme,
  Fab,
  Chip,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  KeyboardArrowUp,
  AudioFile,
  PictureAsPdf,
  Download,
  Link as LinkIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { PortfolioMediaType } from "@prisma/client";
import { getPortfolioById } from "@/slices/PortfolioSlice";

const SinglePortfolio = ({ id }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { data, error, loading } = useSelector(
    (state) => state.portfolio.portfolio
  );
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    dispatch(getPortfolioById(id));
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dispatch, id]);

  if (loading) return <LoadingSkeleton />;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No portfolio found</div>;

  const skills = data.skillsDeliverables
    .split(",")
    .map((skill) => skill.trim());

  return (
    <Box sx={{ bgcolor: "background.default" }}>
      {/* Hero Section */}
      <Box
        sx={{
          height: "60vh",
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          bgcolor: "background.paper",
        }}
      >
        {data.thumbnail && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 0,
              "&::after": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 100%)",
              },
            }}
          >
            <Box
              component="img"
              src={data.thumbnail}
              alt="Project Thumbnail"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>
        )}

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="h1"
              sx={{
                color: "#fff",
                fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4rem" }, // Slightly reduced font sizes
                fontWeight: 700,
                mb: 2, // Reduced margin
                textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                lineHeight: 1.2,
              }}
            >
              {data.projectTitle}
            </Typography>
            <Typography
              variant="h2"
              sx={{
                color: "rgba(255,255,255,0.9)",
                fontSize: { xs: "1.2rem", sm: "1.5rem" }, // Slightly reduced font sizes
                fontWeight: 400,
                maxWidth: "800px",
                mb: 3, // Reduced margin
                lineHeight: 1.4,
              }}
            >
              {data.projectDescription}
            </Typography>
            {skills.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  flexWrap: "wrap",
                  mt: 2,
                }}
              >
                {skills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    sx={{
                      bgcolor: "rgba(255,255,255,0.15)",
                      color: "#fff",
                      backdropFilter: "blur(10px)",
                      fontSize: "0.875rem",
                      height: "28px",
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.25)",
                      },
                    }}
                  />
                ))}
              </Box>
            )}
          </motion.div>
        </Container>
      </Box>

      {/* Content Sections */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <AnimatePresence>
          {data.media?.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Box sx={{ mb: 12 }}>
                <MediaContent item={item} />
              </Box>
            </motion.div>
          ))}
        </AnimatePresence>
      </Container>
      <Fab
        component={motion.button}
        color="primary"
        size="large"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        sx={{
          position: "fixed",
          bottom: 32,
          right: 32,
          opacity: showScrollTop ? 1 : 0,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: showScrollTop ? 1 : 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <KeyboardArrowUp />
      </Fab>
    </Box>
  );
};

const MediaContent = ({ item }) => {
  switch (item.type) {
    case PortfolioMediaType.IMAGE:
      return (
        <motion.div>
          <Box
            sx={{
              position: "relative",
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <Box
              component="img"
              src={item.media_url}
              alt={item.title || "Portfolio image"}
              sx={{
                width: "100%",
                height: "auto",
                display: "block",
              }}
            />
          </Box>
        </motion.div>
      );

    case PortfolioMediaType.VIDEO:
      return (
        <motion.div>
          <Box
            sx={{
              position: "relative",
              borderRadius: 4,
              overflow: "hidden",
              aspectRatio: "16/9",
              bgcolor: "black",
            }}
          >
            <Box
              component="video"
              src={item.media_url}
              controls
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </Box>
        </motion.div>
      );

    case PortfolioMediaType.AUDIO:
      return (
        <Box
          sx={{
            p: 3,
            borderRadius: 4,
            bgcolor: "background.paper",
            boxShadow: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <AudioFile sx={{ fontSize: 40, color: "primary.main", mr: 2 }} />
            <Typography variant="h6">{item.title || "Audio Track"}</Typography>
          </Box>
          <Box
            component="audio"
            src={item.media_url}
            controls
            sx={{ width: "100%" }}
          />
        </Box>
      );

    case PortfolioMediaType.DOCUMENT:
      return (
        <Box
          sx={{
            p: 3,
            borderRadius: 4,
            bgcolor: "background.paper",
            boxShadow: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <PictureAsPdf sx={{ fontSize: 40, color: "error.main", mr: 2 }} />
            <Typography variant="h6">
              {item.name ||
                (item.media_url && typeof item.media_url === "string"
                  ? item.media_url
                      .split("/")
                      .pop()
                      .split("_")
                      .slice(1)
                      .join("_")
                  : "Document")}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Download />}
            href={item.media_url}
            target="_blank"
            download
          >
            Download Document
          </Button>
        </Box>
      );

    case PortfolioMediaType.URL:
      return (
        <Box
          component={motion.div}
          sx={{
            p: 3,
            borderRadius: 4,
            bgcolor: "background.paper",
            boxShadow: 1,
            transition: "all 0.3s ease",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <LinkIcon sx={{ fontSize: 40, color: "primary.main", mr: 2 }} />
            <Typography variant="h6">
              {item.title || "External Link"}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<LinkIcon />}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit Link
          </Button>
        </Box>
      );

    case PortfolioMediaType.TEXT:
      return (
        <Box>
          {item.heading && (
            <Typography
              variant="h5"
              sx={{
                fontSize: "1.5rem",
                fontWeight: 600,
                mb: 2,
                color: "text.primary",
              }}
            >
              {item.heading}
            </Typography>
          )}
          <Typography
            variant="body1"
            sx={{
              fontSize: "1.2rem",
              lineHeight: 1.8,
              color: "text.secondary",
            }}
          >
            {item.description}
          </Typography>
        </Box>
      );

    default:
      return null;
  }
};

const LoadingSkeleton = () => (
  <Box
    sx={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 3,
      bgcolor: "background.default",
    }}
  >
    <CircularProgress
      size={60}
      thickness={4}
      sx={{
        color: "primary.main",
      }}
    />
    <Typography
      variant="h6"
      sx={{
        color: "text.secondary",
        fontWeight: 500,
      }}
    >
      Loading ...
    </Typography>
  </Box>
);

export default SinglePortfolio;
