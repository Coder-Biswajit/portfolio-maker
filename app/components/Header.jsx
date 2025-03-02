'use client';
import { useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  AccountCircle,
  Work,
  Info,
  Mail,
  Login,
  AddCircleOutline,
} from '@mui/icons-material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const pages = [
  { title: 'Portfolio', href: '/portfolio', icon: <Work /> },
  { title: 'About', href: '/about', icon: <Info /> },
  { title: 'Contact', href: '/contact', icon: <Mail /> },
];

const settings = [
  { title: 'Profile', href: '/profile' },
  { title: 'My Portfolio', href: '/profile/portfolio' },
  { title: 'Settings', href: '/profile/settings' },
];

export default function Header() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isActive = (href) => pathname === href;

  if (!mounted) {
    return null;
  }

  return (
    <AppBar position="sticky" sx={{ backgroundColor: 'white', boxShadow: 2 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Desktop Logo */}
          <Typography
            variant="h6"
            noWrap
            component={Link}
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: 'primary.main',
              textDecoration: 'none',
            }}
          >
            Portfoli
          </Typography>

          {/* Mobile Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleDrawerToggle}
              color="primary"
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Mobile Logo */}
          <Typography
            variant="h6"
            noWrap
            component={Link}
            href="/"
            sx={{
              flexGrow: 1,
              display: { xs: 'flex', md: 'none' },
              fontWeight: 700,
              color: 'primary.main',
              textDecoration: 'none',
            }}
          >
            Portfoli
          </Typography>

          {/* Desktop Navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 4 }}>
            {pages.map((page) => (
              <Button
                key={page.title}
                component={Link}
                href={page.href}
                sx={{
                  my: 2,
                  mx: 1,
                  color: isActive(page.href) ? 'primary.main' : 'text.primary',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                {page.icon}
                {page.title}
              </Button>
            ))}
          </Box>

          {/* User Menu - Replace with actual user state check */}
          <Box sx={{ flexGrow: 0, display: 'flex', gap: 2 }}>
            <Button
              component={Link}
              href="/portfolio/add"
              variant="contained"
              startIcon={<AddCircleOutline />}
              sx={{
                display: { xs: 'none', md: 'flex' },
                borderRadius: '24px',
              }}
            >
              Create Portfolio
            </Button>
            
            {false ? ( // Replace with actual user state check
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="User Name" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
            ) : (
              <Button
                component={Link}
                href="/login"
                variant="outlined"
                startIcon={<Login />}
                sx={{ borderRadius: '24px' }}
              >
                Sign In
              </Button>
            )}
            
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting.title}
                  onClick={handleCloseUserMenu}
                  component={Link}
                  href={setting.href}
                >
                  <Typography textAlign="center">{setting.title}</Typography>
                </MenuItem>
              ))}
              <MenuItem onClick={handleCloseUserMenu}>
                <Typography textAlign="center" color="error">
                  Logout
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        <Box sx={{ p: 2 }}>
          <IconButton
            onClick={handleDrawerToggle}
            sx={{ mb: 2, ml: 'auto', display: 'block' }}
          >
            <CloseIcon />
          </IconButton>
          <List>
            {pages.map((page) => (
              <ListItem
                key={page.title}
                component={Link}
                href={page.href}
                onClick={handleDrawerToggle}
                sx={{
                  backgroundColor: isActive(page.href)
                    ? 'rgba(0, 0, 0, 0.04)'
                    : 'transparent',
                  borderRadius: 1,
                  mb: 1,
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{page.icon}</ListItemIcon>
                <ListItemText primary={page.title} />
              </ListItem>
            ))}
            <ListItem
              component={Link}
              href="/create"
              onClick={handleDrawerToggle}
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                borderRadius: 1,
                mt: 2,
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'white' }}>
                <AddCircleOutline />
              </ListItemIcon>
              <ListItemText primary="Create Portfolio" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
} 