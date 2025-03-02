'use client';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Button,
  TextField,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  LinkedIn,
  Instagram,
  GitHub,
  Send,
} from '@mui/icons-material';
import Link from 'next/link';
import { useState } from 'react';

const footerLinks = {
  product: [
    { title: 'Features', href: '/features' },
    { title: 'Pricing', href: '/pricing' },
    { title: 'Showcase', href: '/showcase' },
  ],
  company: [
    { title: 'About Us', href: '/about' },
    { title: 'Careers', href: '/careers' },
    { title: 'Contact', href: '/contact' },
  ],
  resources: [
    { title: 'Blog', href: '/blog' },
    { title: 'Documentation', href: '/docs' },
    { title: 'Help Center', href: '/help' },
  ],
};

const socialLinks = [
  { Icon: Facebook, href: '#', label: 'Facebook' },
  { Icon: Twitter, href: '#', label: 'Twitter' },
  { Icon: LinkedIn, href: '#', label: 'LinkedIn' },
  { Icon: Instagram, href: '#', label: 'Instagram' },
  { Icon: GitHub, href: '#', label: 'GitHub' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      setSnackbar({
        open: true,
        message: 'Please enter your email',
        severity: 'error',
      });
      return;
    }
    // Handle subscription logic here
    setSnackbar({
      open: true,
      message: 'Thank you for subscribing!',
      severity: 'success',
    });
    setEmail('');
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        pt: 8,
        pb: 6,
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand and Newsletter */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              color="primary"
              sx={{ fontWeight: 700, mb: 2 }}
            >
              Portfoli
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Create and showcase your professional portfolio with our modern,
              intuitive platform.
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubscribe}
              sx={{
                display: 'flex',
                gap: 1,
              }}
            >
              <TextField
                size="small"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  flexGrow: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '24px',
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{ borderRadius: '24px' }}
              >
                <Send />
              </Button>
            </Box>
          </Grid>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <Grid item xs={12} sm={6} md={2} key={category}>
              <Typography
                variant="subtitle1"
                color="text.primary"
                sx={{ fontWeight: 600, mb: 2, textTransform: 'capitalize' }}
              >
                {category}
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {links.map((link) => (
                  <Box component="li" key={link.title} sx={{ mb: 1 }}>
                    <Link
                      href={link.href}
                      style={{ textDecoration: 'none' }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          '&:hover': {
                            color: 'primary.main',
                          },
                        }}
                      >
                        {link.title}
                      </Typography>
                    </Link>
                  </Box>
                ))}
              </Box>
            </Grid>
          ))}

          {/* Social Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography
              variant="subtitle1"
              color="text.primary"
              sx={{ fontWeight: 600, mb: 2 }}
            >
              Connect
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {socialLinks.map(({ Icon, href, label }) => (
                <IconButton
                  key={label}
                  component="a"
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                  aria-label={label}
                >
                  <Icon />
                </IconButton>
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 8 }}
        >
          © {new Date().getFullYear()} Portfoli. All rights reserved.
        </Typography>
      </Container>

      {/* Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
} 