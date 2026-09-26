import { useState, useRef } from "react";

import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  Avatar,
  Divider,
} from "@mui/material";

import { GoogleLogin } from "@react-oauth/google";

import API from "../api/axios";

import { useTranslation } from "react-i18next";

import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

export default function ProfileMenu() {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const timer = useRef(null);

  const token = localStorage.getItem("token");

  const getUser = () => {
    try {
      const data = localStorage.getItem("user");

      if (!data || data === "undefined") {
        return null;
      }

      return JSON.parse(data);
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  };

  const user = getUser();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  const googleLogin = async (credentialResponse) => {
    try {
      const res = await API.post("/auth/google", {
        token: credentialResponse.credential,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setOpen(false);
    } catch (error) {
      console.log("Google Login Error", error);
    }
  };

  return (
    <Box
      onMouseEnter={() => {
        clearTimeout(timer.current);

        if (window.innerWidth > 900) {
          setOpen(true);
        }
      }}
      onMouseLeave={() => {
        if (window.innerWidth > 900) {
          timer.current = setTimeout(() => {
            if (!confirmLogout) {
              setOpen(false);
            }
          }, 300);
        }
      }}
      sx={{
        position: "relative",
        zIndex: 9999,
        direction: "inherit",
        overflow: "visible",
      }}
    >
      {/* PROFILE BUTTON */}
      <IconButton
        onClick={() => {
          setOpen((prev) => !prev);
        }}
        sx={{
          width: {
            xs: 40,
            md: 42,
          },

          height: {
            xs: 40,
            md: 42,
          },

          border: "1px solid #ddd",
          padding: 0,
          overflow: "hidden",
          transition: "0.3s",

          "&:hover": {
            transform: "translateY(-2px)",
            background: "#000",
          },
        }}
      >
        {token && user?.picture ? (
          <Avatar
            src={user.picture}
            sx={{
              width: "100%",
              height: "100%",
            }}
          />
        ) : (
          <PersonOutlineOutlinedIcon
            sx={{
              fontSize: 30,
              color: "#000",
            }}
          />
        )}
      </IconButton>

      {/* DROPDOWN */}
      {open && (
        <Paper
          elevation={15}
          sx={{
            position: "absolute",

            top: {
              xs: "48px",
              md: "66px",
            },

            insetInlineEnd: 0,

            width: {
              xs: 250,
              md: 270,
            },

            borderRadius: "22px",
            overflow: "hidden",

            zIndex: 99999,

            background: "#fff",
            direction: "inherit",
          }}
        >
          {token ? (
            <>
              {/* BLACK HEADER */}
              <Box
                sx={{
                  background: "#000",
                  height: 72,
                }}
              />

              {/* USER INFO */}
              <Box
                sx={{
                  mt: -4.5,
                  textAlign: "center",
                  px: 2.5,
                }}
              >
                <Avatar
                  src={user?.picture}
                  sx={{
                    width: 78,
                    height: 78,
                    margin: "auto",

                    border: "4px solid white",

                    boxShadow: "0 5px 18px #ccc",
                  }}
                />

                <Typography
                  sx={{
                    fontSize: 18,
                    fontWeight: 800,
                    mt: 1.5,

                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {user?.name}
                </Typography>

                <Typography
                  sx={{
                    color: "#777",
                    fontSize: 12.5,
                    mt: 0.4,

                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",

                    direction: "ltr",
                  }}
                >
                  {user?.email}
                </Typography>
              </Box>

              <Divider sx={{ my: 1.5 }} />

              {/* LOGOUT */}
              {confirmLogout ? (
                <Box
                  sx={{
                    px: 2.5,
                    pb: 2.5,
                    textAlign: "center",
                  }}
                >
                  <Typography fontWeight={700} fontSize={13.5} mb={1.5}>
                    {t("profile.logoutConfirm")}
                  </Typography>

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={logout}
                    sx={{
                      minHeight: 36,
                      px: 1.5,

                      borderRadius: 30,

                      background: "#000",

                      fontSize: 12,
                      fontWeight: 600,

                      whiteSpace: "normal",
                      lineHeight: 1.2,

                      "&:hover": {
                        background: "#222",
                      },
                    }}
                  >
                    {t("profile.yesLogout")}
                  </Button>

                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => setConfirmLogout(false)}
                    sx={{
                      minHeight: 36,
                      px: 1.5,

                      mt: 0.8,

                      borderRadius: 30,

                      fontSize: 12,
                      fontWeight: 500,

                      whiteSpace: "normal",
                      lineHeight: 1.2,
                    }}
                  >
                    {t("profile.cancel")}
                  </Button>
                </Box>
              ) : (
                <Box
                  sx={{
                    px: 2.5,
                    pb: 2.5,
                  }}
                >
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => setConfirmLogout(true)}
                    sx={{
                      minHeight: 36,

                      px: 1.5,

                      borderRadius: 30,

                      background: "#000",

                      fontSize: 12,
                      fontWeight: 600,

                      // مهم للعربي والإنجليزي
                      whiteSpace: "normal",
                      overflow: "hidden",
                      textOverflow: "clip",
                      lineHeight: 1.25,

                      "&:hover": {
                        background: "#222",
                      },
                    }}
                  >
                    {t("profile.logout")}
                  </Button>
                </Box>
              )}
            </>
          ) : (
            <Box
              sx={{
                p: 2.5,
                textAlign: "center",
              }}
            >
              <Typography fontWeight={800} fontSize={18} mb={0.8}>
                {t("profile.welcome")}
              </Typography>

              <Typography color="gray" fontSize={13} mb={2.5}>
                {t("profile.loginMessage")}
              </Typography>

              <GoogleLogin
                onSuccess={googleLogin}
                onError={() => console.log("Google Error")}
              />
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
}
