import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";

const ThumbnailUpload = ({ formik }) => {
  const { values, setFieldValue, errors, touched } = formik;
  const [preview, setPreview] = useState(
    values.thumbnail instanceof File
      ? URL.createObjectURL(values.thumbnail)
      : values.thumbnail
  );

  const [file, setFile] = useState(null);
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFieldValue("thumbnail", file);
    setFile(file);
  };

  useEffect(() => {
    if (file && file instanceof File) {
      setPreview(URL.createObjectURL(file));
    }
  }, [file]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Typography variant="h6">Thumbnail</Typography>
      <IconButton component="label">
        <input
          type="file"
          hidden
          onChange={handleFileChange}
          accept=".png, .jpg, .jpeg"
        />
        <CloudUploadIcon />
      </IconButton>
      {errors.thumbnail && touched.thumbnail && (
        <Typography color="error">{errors.thumbnail}</Typography>
      )}
      {values.thumbnail && (
        <img
          src={preview}
          alt="thumbnail"
          style={{ maxWidth: "100%", maxHeight: "200px" }}
        />
      )}
    </Box>
  );
};

export default ThumbnailUpload;
