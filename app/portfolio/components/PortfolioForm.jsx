"use client";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  Container,
  LinearProgress,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import BasicDetails from "./steps/BasicDetails";
import MediaUpload from "./steps/MediaUpload";
import { Form, Formik, useFormik } from "formik";
import * as Yup from "yup";
import { Status } from "@prisma/client";
import { useDispatch, useSelector } from "react-redux";
import {
  createPortfolio,
  getPortfolioById,
  handleModal,
  updatePortfolio,
} from "@/slices/PortfolioSlice";
import ThumbnailUpload from "./steps/ThumbnailUpload";
import Preview from "./steps/Preview";
import { useRouter } from "next/navigation";
import { post } from "@/utils/api";

const steps = ["Basic Details", "Media Upload", "Thumbnail", "Preview"];

const validationSchema = Yup.object().shape({
  projectTitle: Yup.string()
    .required("Project title is required")
    .min(3, "Project title must be at least 3 characters")
    .max(100, "Project title must not exceed 100 characters"),
  role: Yup.string()
    .required("Role is required")
    .min(2, "Role must be at least 2 characters")
    .max(50, "Role must not exceed 50 characters"),
  projectDescription: Yup.string()
    .required("Project description is required")
    .min(10, "Project description must be at least 10 characters")
    .max(2000, "Project description must not exceed 2000 characters"),
  skillsDeliverables: Yup.string()
    .required("Skills & deliverables are required")
    .min(10, "Skills & deliverables must be at least 10 characters")
    .max(1000, "Skills & deliverables must not exceed 1000 characters"),
  status: Yup.string().required("Status is required"),
  thumbnail: Yup.mixed().nullable(),
  images: Yup.array(),
  videos: Yup.array(),
  textBlocks: Yup.array().of(
    Yup.object().shape({
      heading: Yup.string().required("Heading is required"),
      description: Yup.string().required("Description is required"),
    })
  ),
  links: Yup.array().of(
    Yup.object().shape({
      title: Yup.string().required("Link title is required"),
      url: Yup.string().url("Must be a valid URL").required("URL is required"),
    })
  ),
});

const LoadingSkeleton = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Skeleton */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            width: { xs: "80%", sm: "300px" },
            height: 36,
            bgcolor: "grey.100",
            borderRadius: 1,
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
      </Box>

      <Card sx={{ p: 3 }}>
        {/* Stepper Skeleton */}
        <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between" }}>
          {[1, 2, 3, 4].map((step) => (
            <Box
              key={step}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flex: 1,
              }}
            >
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  bgcolor: "grey.100",
                }}
              />
              <Box
                sx={{
                  height: 8,
                  flex: 1,
                  bgcolor: "grey.100",
                  borderRadius: 1,
                }}
              />
            </Box>
          ))}
        </Box>

        {/* Progress Bar Skeleton */}
        <Box
          sx={{
            width: "100%",
            height: 4,
            bgcolor: "grey.100",
            borderRadius: 2,
            mb: 4,
          }}
        />

        {/* Form Fields Skeleton */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mb: 4 }}>
          {[1, 2, 3].map((field) => (
            <Box key={field}>
              <Box
                sx={{
                  width: "120px",
                  height: 16,
                  bgcolor: "grey.100",
                  borderRadius: 0.5,
                  mb: 1,
                }}
              />
              <Box
                sx={{
                  width: "100%",
                  height: 48,
                  bgcolor: "grey.100",
                  borderRadius: 1,
                }}
              />
            </Box>
          ))}
        </Box>

        {/* Buttons Skeleton */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          <Box
            sx={{
              width: 100,
              height: 36,
              bgcolor: "grey.100",
              borderRadius: 1,
            }}
          />
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box
              sx={{
                width: 120,
                height: 36,
                bgcolor: "grey.100",
                borderRadius: 1,
              }}
            />
            <Box
              sx={{
                width: 120,
                height: 36,
                bgcolor: "grey.100",
                borderRadius: 1,
              }}
            />
          </Box>
        </Box>
      </Card>
    </Container>
  );
};

const PortfolioForm = ({ id }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [stepErrors, setStepErrors] = useState({});
  const { data, loading, error } = useSelector(
    (state) => state.portfolio.portfolio
  );
  const formik = useFormik({
    initialValues: {
      projectTitle: id ? data?.projectTitle : "",
      role: id ? data?.role : "",
      projectDescription: id ? data?.projectDescription : "",
      skillsDeliverables: id ? data?.skillsDeliverables ?? "" : "",
      status: id ? data?.status : Status.DRAFT,
      thumbnail: id ? data?.thumbnail : null,
      media: id ? data?.media : [],
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (id) {
        await Promise.all(
          values.media.map(async (item) => {
            if (item.file) {
              const media = await post("/api/portfolio/media", {
                file: item.file,
              });
              if (media?.data?.url) {
                item.media_url = media?.data?.url;
              }
              return item;
            }
          })
        );

        dispatch(
          updatePortfolio({
            id: id,
            data: {
              ...values,
              status: Status.PUBLISHED,
              media: JSON.stringify(values.media),
            },
          })
        );

        router.push(`/`);
      } else {
        await Promise.all(
          values.media.map(async (item) => {
            if (item.file) {
              const media = await post("/api/portfolio/media", {
                file: item.file,
              });
              if (media?.data?.url) {
                item.media_url = media?.data?.url;
              }
              return item;
            }
          })
        );

        dispatch(
          createPortfolio({
            ...values,
            media: JSON.stringify(values.media),
          })
        );

        router.push(`/`);
      }
      dispatch(handleModal(false));
      router.refresh();
    },
  });

  // Validation schemas for each step
  const stepValidationSchemas = {
    0: Yup.object().shape({
      projectTitle: Yup.string()
        .required("Project title is required")
        .min(3, "Project title must be at least 3 characters")
        .max(100, "Project title must not exceed 100 characters"),
      role: Yup.string()
        .required("Role is required")
        .min(2, "Role must be at least 2 characters")
        .max(50, "Role must not exceed 50 characters"),
      projectDescription: Yup.string()
        .required("Project description is required")
        .min(10, "Project description must be at least 10 characters")
        .max(2000, "Project description must not exceed 2000 characters"),
      skillsDeliverables: Yup.string()
        .required("Skills & deliverables are required")
        .min(10, "Skills & deliverables must be at least 10 characters")
        .max(1000, "Skills & deliverables must not exceed 1000 characters"),
      status: Yup.string().required("Status is required"),
    }),
    1: Yup.object().shape({
      textBlocks: Yup.array().of(
        Yup.object().shape({
          heading: Yup.string().required("Heading is required"),
          description: Yup.string().required("Description is required"),
        })
      ),
      links: Yup.array().of(
        Yup.object().shape({
          title: Yup.string().required("Link title is required"),
          url: Yup.string()
            .url("Must be a valid URL")
            .required("URL is required"),
        })
      ),
    }),
    2: Yup.object().shape({
      thumbnail: Yup.mixed().required("Thumbnail is required"),
    }),
  };

  const validateStep = async (step) => {
    try {
      const schema = stepValidationSchemas[step];
      if (!schema) return true; // If no validation schema exists for this step

      await schema.validate(formik.values, { abortEarly: false });
      setStepErrors({});
      return true;
    } catch (err) {
      const errors = {};
      err.inner.forEach((error) => {
        errors[error.path] = error.message;
      });
      setStepErrors(errors);
      return false;
    }
  };

  const handleNext = async () => {
    const isValid = await validateStep(activeStep);
    if (isValid) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setStepErrors({}); // Clear errors when going back
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <BasicDetails formik={formik} />;
      case 1:
        return <MediaUpload formik={formik} />;
      case 2:
        return <ThumbnailUpload formik={formik} />;
      case 3:
        return <Preview formik={formik} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(getPortfolioById(id));
    }
  }, [id]);

  if (loading && id) {
    return <LoadingSkeleton />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {`${id ? "Edit" : "Create"}`} Portfolio Project
        </Typography>
      </Box>
      <Formik initialValues={formik.initialValues}>
        <Form onSubmit={formik.handleSubmit}>
          <Card sx={{ p: 3 }}>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel
                    error={
                      Object.keys(stepErrors).length > 0 && activeStep === index
                    }
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>

            {/* Show error summary if there are errors */}
            {Object.keys(stepErrors).length > 0 && (
              <Box
                sx={{
                  mt: 2,
                  mb: 2,
                  p: 2,
                  bgcolor: "error.main",
                  borderRadius: 1,
                  color: "#fff",
                }}
              >
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Please fix the following errors:
                </Typography>
                {Object.values(stepErrors).map((error, index) => (
                  <Typography key={index} variant="body2" sx={{ ml: 2 }}>
                    • {error}
                  </Typography>
                ))}
              </Box>
            )}

            <LinearProgress
              variant="determinate"
              value={(activeStep / (steps.length - 1)) * 100}
              sx={{ mb: 4 }}
            />

            <Box sx={{ minHeight: "400px" }}>{renderStepContent()}</Box>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}
            >
              <Button
                onClick={handleBack}
                disabled={activeStep === 0}
                startIcon={<ArrowBack />}
              >
                Back
              </Button>
              <Box>
                {!id && (
                  <Button
                    disabled={formik.isSubmitting}
                    variant="outlined"
                    sx={{ mr: 1 }}
                    onClick={async () => {
                      const isValid = await validateStep(activeStep);
                      if (isValid) {
                        formik.setFieldValue("status", Status.DRAFT);
                        formik.handleSubmit();
                      }
                    }}
                  >
                    Save as Draft
                  </Button>
                )}
                {activeStep === steps.length - 1 ? (
                  <Button
                    variant="contained"
                    disabled={formik.isSubmitting}
                    onClick={async () => {
                      const isValid = await validateStep(activeStep);
                      if (isValid) {
                        formik.setFieldValue("status", Status.PUBLISHED);
                        formik.handleSubmit();
                      }
                    }}
                  >
                    {id ? "Update" : "Publish"}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    endIcon={<ArrowForward />}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Box>
          </Card>
        </Form>
      </Formik>
    </Container>
  );
};

export default PortfolioForm;
