import { Box, TextField, Typography, Autocomplete, Chip } from "@mui/material";
import { useSelector } from "react-redux";

const BasicDetails = ({ formik }) => {
  const handleSkillsChange = (_, newValue) => {
    formik.setFieldValue(
      "skillsDeliverables",
      newValue.join(",") // Store as comma-separated string
    );
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Typography variant="h6" gutterBottom>
        Project Basic Information
      </Typography>

      <TextField
        slotProps={{
          input: {
            name: "projectTitle",
          },
        }}
        label="Project Title"
        name="projectTitle"
        fullWidth
        value={formik.values.projectTitle ?? ""}
        onChange={formik.handleChange}
      />

      <TextField
        label="Your Role"
        slotProps={{
          input: {
            name: "role",
          },
        }}
        fullWidth
        value={formik.values.role ?? ""}
        onChange={formik.handleChange}
      />

      <TextField
        label="Project Description"
        slotProps={{
          input: {
            name: "projectDescription",
          },
        }}
        fullWidth
        multiline
        rows={4}
        value={formik.values.projectDescription ?? ""}
        onChange={formik.handleChange}
      />

      <Autocomplete
        name="skillsDeliverables"
        multiple
        freeSolo
        options={[]}
        value={formik.values.skillsDeliverables.split(",").filter(Boolean)}
        onChange={handleSkillsChange}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip label={option} {...getTagProps({ index })} key={option} />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Skills & Deliverables"
            placeholder="Type and press enter to add skills"
          />
        )}
      />
    </Box>
  );
};

export default BasicDetails;
