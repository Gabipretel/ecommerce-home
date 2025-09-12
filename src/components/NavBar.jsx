import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Badge from "@mui/material/Badge";
import { Link } from "react-router";

function NavBar() {
  const pages = [
    "Inicio",
    "Productos",
    "Categorias",
    "Ofertas",
    "Sobre Nosotros",
    "Contacto",
  ];
  const settings = ["Cuenta", "Mis pedidos", "Favoritos", "Panel Admin", "Cerrar sesión"];
  const [openMenu, setOpenMenu] = useState(null);
  const [openMenuUser, setOpenMenuUser] = useState(null);

  const handleOpenNavMenu = () => {
    setOpenMenu(true);
  };
  const handleOpenUserMenu = () => {
    setOpenMenuUser(true);
  };

  const handleCloseNavMenu = () => {
    setOpenMenu(false);
  };

  const handleCloseUserMenu = () => {
    setOpenMenuUser(false);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: "100%",
        top: 0,
        backgroundColor: "#212121",
      }}
    >
      <Container disableGutters>
        <Toolbar disableGutters>
          <SportsEsportsIcon
            sx={{ display: { xs: "none", md: "flex" }, marginX: 2 }}
          />
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              fontFamily: "monospace",
              mr: 2,
              letterSpacing: "5px",
              display: { xs: "none", md: "flex" },
            }}
          >
            GG
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              onClick={handleOpenNavMenu}
              sx={{ color: "white" }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorOrigin={{
                horizontal: "left",
              }}
              open={openMenu}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" }, mt: 6.6 }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Link to={page === "Categorias" ? "/categorias" : "/"}>
                    <Typography>{page}</Typography>
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          {/* Icono mas logo centro */}
          <SportsEsportsIcon
            sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
          />
          <Typography
            variant="h5"
            sx={{
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: "bold",
              letterSpacing: "5px",
            }}
          >
            GG
          </Typography>

          {/* Paginas en web grande*/}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                <Link to={page === "Categorias" ? "/categorias" : "/"}>
                  {page}
                </Link>
              </Button>
            ))}
          </Box>
          {/* Icono de carrito y avatar */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Abrir menu">
              <Badge badgeContent={4} color="error" sx={{ marginRight: 3 }}>
                <IconButton sx={{ p: 0, color: "white" }}>
                  <ShoppingCartIcon />
                </IconButton>
              </Badge>

              <IconButton onClick={handleOpenUserMenu} sx={{ mr: 2 }}>
                <Avatar alt="avatar image" src={""} />
              </IconButton>
            </Tooltip>
            {/* Menu de usuario */}
            <Menu
              sx={{ mt: 6.6, mr: 2 }}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={openMenuUser}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  {setting === "Panel Admin" ? (
                    <Link to="/admin" style={{ textDecoration: 'none', color: 'inherit' }}>
                      <Typography sx={{ textAlign: "center" }}>
                        {setting}
                      </Typography>
                    </Link>
                  ) : (
                    <Typography sx={{ textAlign: "center" }}>
                      {setting}
                    </Typography>
                  )}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default NavBar;
