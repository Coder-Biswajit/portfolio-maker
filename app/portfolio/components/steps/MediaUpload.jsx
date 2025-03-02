import {
  Box,
  Typography,
  IconButton,
  Modal,
  Paper,
  Grid,
  TextField,
  Button,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import {
  Delete,
  Image,
  VideoLibrary,
  TextFields,
  Link,
  Description,
  AudioFile,
  Close,
  PictureAsPdf,
  DragIndicator,
} from "@mui/icons-material";
import { useDropzone } from "react-dropzone";
import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PortfolioMediaType } from "@prisma/client";

const MediaUpload = ({ formik }) => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [textContent, setTextContent] = useState({
    heading: "",
    description: "",
    type: PortfolioMediaType.TEXT,
  });
  const [linkData, setLinkData] = useState({
    url: "",
    title: "",
    type: PortfolioMediaType.URL,
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
      "video/*": [],
      "audio/*": [],
      "application/pdf": [],
      "application/msword": [],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [],
    },
    onDrop: (acceptedFiles) => {
      const fileType = getFileType(acceptedFiles[0]);
      const newFiles = acceptedFiles.map((file) => ({
        file,
        media_url: URL.createObjectURL(file),
        preview: URL.createObjectURL(file),
        type: fileType,
        name: file.name,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      }));

      formik.setFieldValue("media", [...formik.values.media, ...newFiles]);
      setOpenModal(false);
    },
  });

  const getFileType = (file) => {
    if (file.type.startsWith("image/")) return PortfolioMediaType.IMAGE;
    if (file.type.startsWith("video/")) return PortfolioMediaType.VIDEO;
    if (file.type.startsWith("audio/")) return PortfolioMediaType.AUDIO;
    return PortfolioMediaType.DOCUMENT;
  };

  const mediaTypes = [
    { type: PortfolioMediaType.IMAGE, icon: <Image />, label: "Image" },
    { type: PortfolioMediaType.VIDEO, icon: <VideoLibrary />, label: "Video" },
    {
      type: PortfolioMediaType.TEXT,
      icon: <TextFields />,
      label: "Text Block",
    },
    { type: PortfolioMediaType.URL, icon: <Link />, label: "Link" },
    {
      type: PortfolioMediaType.DOCUMENT,
      icon: <Description />,
      label: "Document",
    },
    { type: PortfolioMediaType.AUDIO, icon: <AudioFile />, label: "Audio" },
  ];

  const handleMediaTypeClick = (type) => {
    setSelectedType(type);
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setSelectedType(null);
    setTextContent({
      heading: "",
      description: "",
      type: PortfolioMediaType.TEXT,
    });
    setLinkData({ url: "", title: "", type: PortfolioMediaType.URL });
  };

  const handleSubmit = () => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const newItem = {
      id,
      type: selectedType,
      ...(selectedType === PortfolioMediaType.TEXT ? textContent : linkData),
    };

    formik.setFieldValue("media", [...formik.values.media, newItem]);
    handleModalClose();
  };

  const removeMedia = (e, id) => {
    e.stopPropagation();
    const updatedMedia = formik.values.media.filter((item) => item.id !== id);
    formik.setFieldValue("media", updatedMedia);
  };

  const modalContent = () => {
    switch (selectedType) {
      case PortfolioMediaType.IMAGE:
      case PortfolioMediaType.VIDEO:
      case PortfolioMediaType.DOCUMENT:
      case PortfolioMediaType.AUDIO:
        return (
          <Paper
            {...getRootProps()}
            sx={{
              cursor: "pointer",
              p: 3,
              textAlign: "center",
              border: "2px dashed #ccc",
              borderRadius: "10px",
              "&:hover": {
                border: "2px dashed #666",
              },
            }}
          >
            <input {...getInputProps()} />
            <Typography variant="h6" gutterBottom>
              Drag and drop your files here
            </Typography>
            <Typography variant="body2" color="textSecondary">
              or click to select files
            </Typography>
          </Paper>
        );
      case PortfolioMediaType.TEXT:
        return (
          <Box>
            <TextField
              fullWidth
              label="Heading"
              value={textContent.heading}
              onChange={(e) =>
                setTextContent({ ...textContent, heading: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              value={textContent.description}
              onChange={(e) =>
                setTextContent({ ...textContent, description: e.target.value })
              }
            />
          </Box>
        );
      case PortfolioMediaType.URL:
        return (
          <Box>
            <TextField
              fullWidth
              label="URL"
              value={linkData.url}
              onChange={(e) =>
                setLinkData({ ...linkData, url: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Title"
              value={linkData.title}
              onChange={(e) =>
                setLinkData({ ...linkData, title: e.target.value })
              }
            />
          </Box>
        );
      default:
        return null;
    }
  };

  console.log(formik.values.media);

  const renderMediaItem = (item, dragHandleProps) => {
    const { attributes, listeners } = dragHandleProps || {};

    switch (item.type) {
      case PortfolioMediaType.IMAGE:
        return (
          <Card
            sx={{
              position: "relative",
              mb: 2,
              "&:hover .media-buttons": {
                opacity: 1,
              },
            }}
          >
            <CardMedia
              component="img"
              height={200}
              image={item.preview || item.media_url}
              alt="Portfolio image"
            />
            <Box
              className="media-buttons"
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                opacity: 0,
                transition: "opacity 0.2s ease",
                display: "flex",
                gap: 1,
              }}
            >
              <IconButton
                size="small"
                onClick={(e) => removeMedia(e, item.id)}
                sx={{ color: "white" }}
              >
                <Delete />
              </IconButton>
              <IconButton
                {...attributes}
                {...listeners}
                size="small"
                sx={{
                  color: "white",
                  cursor: "grab",
                  "&:active": { cursor: "grabbing" },
                }}
              >
                <DragIndicator />
              </IconButton>
            </Box>
          </Card>
        );

      case PortfolioMediaType.VIDEO:
        return (
          <Card sx={{ mb: 2, position: "relative" }}>
            <CardMedia
              component="video"
              height="200"
              src={item.preview}
              controls
            />
            <Box
              sx={{ p: 1, display: "flex", justifyContent: "flex-end", gap: 1 }}
            >
              <IconButton size="small" onClick={(e) => removeMedia(e, item.id)}>
                <Delete />
              </IconButton>
              <IconButton
                {...attributes}
                {...listeners}
                size="small"
                sx={{ cursor: "grab", "&:active": { cursor: "grabbing" } }}
              >
                <DragIndicator />
              </IconButton>
            </Box>
          </Card>
        );

      case PortfolioMediaType.TEXT:
        return (
          <Paper sx={{ p: 2, mb: 2, position: "relative" }}>
            <Box
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                display: "flex",
                gap: 1,
              }}
            >
              <IconButton
                size="small"
                onClick={(e) => removeMedia(e, item.id)}
                sx={{ "&:hover": { bgcolor: "rgba(0, 0, 0, 0.1)" } }}
              >
                <Delete />
              </IconButton>
              <IconButton
                {...attributes}
                {...listeners}
                size="small"
                sx={{ cursor: "grab", "&:active": { cursor: "grabbing" } }}
              >
                <DragIndicator />
              </IconButton>
            </Box>
            <Typography variant="subtitle1">{item.heading}</Typography>
            <Typography variant="body2">{item.description}</Typography>
          </Paper>
        );

      case PortfolioMediaType.URL:
        return (
          <Paper sx={{ p: 2, mb: 2, position: "relative" }}>
            <Box
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                display: "flex",
                gap: 1,
              }}
            >
              <IconButton size="small" onClick={(e) => removeMedia(e, item.id)}>
                <Delete />
              </IconButton>
              <IconButton
                {...attributes}
                {...listeners}
                size="small"
                sx={{ cursor: "grab", "&:active": { cursor: "grabbing" } }}
              >
                <DragIndicator />
              </IconButton>
            </Box>
            <Typography variant="subtitle1">{item.title}</Typography>
            <Typography
              variant="body2"
              component="a"
              href={item.url}
              target="_blank"
            >
              {item.url}
            </Typography>
          </Paper>
        );

      case PortfolioMediaType.DOCUMENT:
        return (
          <Card sx={{ mb: 2, position: "relative" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <PictureAsPdf sx={{ fontSize: 40, color: "#f44336", mr: 2 }} />
                <Typography variant="subtitle1">
                  {item.name || item.preview.split("/").pop()}
                </Typography>
              </Box>
            </CardContent>
            <Box
              sx={{ p: 1, display: "flex", justifyContent: "flex-end", gap: 1 }}
            >
              <Button
                size="small"
                startIcon={<Description />}
                onClick={() => window.open(item.preview, "_blank")}
              >
                Preview
              </Button>
              <IconButton
                size="small"
                color="error"
                onClick={(e) => removeMedia(e, item.id)}
              >
                <Delete />
              </IconButton>
              <IconButton
                {...attributes}
                {...listeners}
                size="small"
                sx={{ cursor: "grab", "&:active": { cursor: "grabbing" } }}
              >
                <DragIndicator />
              </IconButton>
            </Box>
          </Card>
        );

      case PortfolioMediaType.AUDIO:
        return (
          <Card sx={{ mb: 2, position: "relative" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <AudioFile
                  sx={{ fontSize: 40, color: "primary.main", mr: 2 }}
                />
                <Typography variant="subtitle1">
                  {item.name || item.preview.split("/").pop()}
                </Typography>
              </Box>
              <audio controls src={item.preview} style={{ width: "100%" }} />
            </CardContent>
            <Box
              sx={{ p: 1, display: "flex", justifyContent: "flex-end", gap: 1 }}
            >
              <IconButton
                size="small"
                color="error"
                onClick={(e) => removeMedia(e, item.id)}
              >
                <Delete />
              </IconButton>
              <IconButton
                {...attributes}
                {...listeners}
                size="small"
                sx={{ cursor: "grab", "&:active": { cursor: "grabbing" } }}
              >
                <DragIndicator />
              </IconButton>
            </Box>
          </Card>
        );

      default:
        return null;
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = parseInt(active.id);
      const newIndex = parseInt(over.id);

      const items = [...formik.values.media];
      const reorderedItems = arrayMove(items, oldIndex, newIndex);

      formik.setFieldValue("media", reorderedItems);
    }
  };

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {mediaTypes.map((media) => (
          <Grid item xs={4} sm={2} key={media.type}>
            <Paper
              sx={{
                p: 2,
                textAlign: "center",
                cursor: "pointer",
                "&:hover": { bgcolor: "action.hover" },
              }}
              onClick={() => handleMediaTypeClick(media.type)}
            >
              {media.icon}
              <Typography variant="body2" sx={{ mt: 1 }}>
                {media.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <Box sx={{ mt: 3 }}>
          <SortableContext
            items={formik.values.media.map((_, index) => index)}
            strategy={verticalListSortingStrategy}
          >
            {formik.values.media.map((item, index) => (
              <SortableItem
                key={`${item.type}-${index}`}
                id={index}
                renderMediaItem={renderMediaItem}
              >
                {item}
              </SortableItem>
            ))}
          </SortableContext>
        </Box>
      </DndContext>

      <Modal
        open={openModal}
        onClose={handleModalClose}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Paper sx={{ p: 4, maxWidth: 500, width: "90%" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6">
              Add{" "}
              {selectedType?.charAt(0).toUpperCase() +
                selectedType?.slice(1).toLowerCase()}
            </Typography>
            <IconButton onClick={handleModalClose}>
              <Close />
            </IconButton>
          </Box>
          {modalContent()}
          {(selectedType === PortfolioMediaType.TEXT ||
            selectedType === PortfolioMediaType.URL) && (
            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
              <Button onClick={handleModalClose} sx={{ mr: 1 }}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={
                  (selectedType === PortfolioMediaType.TEXT &&
                    (!textContent.heading || !textContent.description)) ||
                  (selectedType === PortfolioMediaType.URL &&
                    (!linkData.url || !linkData.title))
                }
              >
                Add
              </Button>
            </Box>
          )}
        </Paper>
      </Modal>
    </Box>
  );
};

const SortableItem = ({ id, children, renderMediaItem }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Box ref={setNodeRef} style={style}>
      {renderMediaItem(children, { attributes, listeners })}
    </Box>
  );
};

export default MediaUpload;
