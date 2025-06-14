"use client";

import { useLiff } from "./LiffProvider";
import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Dialog,
  Avatar,
  Stack,
  Backdrop,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import RedeemIcon from "@mui/icons-material/Redeem";
import { sendLineMessage } from "./lineApi";

// Create styled components with Kanit font for Thai text
const ThaiTypography = styled(Typography)({
  fontFamily: "var(--font-kanit)",
});

// Define type for coupon
type Coupon = {
  id: number;
  title: string;
  description: string;
  dateValid: string;
  code: string;
  isUsed?: boolean;
  usedDate?: string;
};

// Sample coupon data
const coupons: Coupon[] = [
  {
    id: 1,
    title: "All You Can Eat Coupon!",
    description:
      "กินตามใจเนเน่สั่งได้หมดงบไม่จำกัด เหมือนความรักของน้องดาว อิอิ",
    dateValid: "Valid until July 17, 2025",
    code: "JUDE001",
  },
  {
    id: 2,
    title: "Beautiful as you Coupon!",
    description:
      "เพิ่มความมั่นใจให้คุณในทุกวัน ด้วยคูปองจากน้องดาว ลิป น้ำหอมไร อีกอย่าเลือกแพงนะ",
    dateValid: "Valid until Aug 17, 2025",
    code: "PINGPONG002",
  },
  {
    id: 3,
    title: "ยังคิดไม่ออกเดียวมาบอกทีหลัง",
    description: "soon",
    dateValid: "soon",
    code: "POONPPOON003",
  },
];

export default function Home() {
  const { liff, profile, isLoggedIn } = useLiff();
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [usedCoupons, setUsedCoupons] = useState<{ [key: number]: string }>(
    () => {
      // Load saved used coupons from localStorage if available
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("usedCoupons");
        return saved ? JSON.parse(saved) : {};
      }
      return {};
    }
  );

  // Handle login
  const handleLogin = () => {
    if (!liff) return;
    liff.login();
  };

  // Handle logout
  const handleLogout = () => {
    if (!liff) return;
    liff.logout();
    window.location.reload();
  };

  // Share message to LINE
  const shareCoupon = async (coupon: Coupon) => {
    if (!liff) return;

    setSelectedCoupon(coupon);
    setIsLoading(true);

    try {
      // Get the user ID from LIFF
      const userProfile = await liff.getProfile();
      const userId = userProfile.userId;

      // Prepare flex message for sharing
      const flexMessage = {
        type: "flex",
        altText: `คูปองถูกแลกเรียบร้อยแล้วนะ: ${coupon.title}`,
        contents: {
          type: "bubble",
          header: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "text",
                text: "แอดมินปิ๊งป่อง send this",
                color: "#FFFFFF",
                weight: "bold",
              },
            ],
            backgroundColor: "#8BE0A4",
          },
          hero: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "text",
                text: coupon.title,
                size: "xl",
                weight: "bold",
                align: "center",
              },
            ],
            paddingTop: "20px",
          },
          body: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "text",
                text: coupon.description,
                wrap: true,
                align: "center",
              },
              {
                type: "text",
                text: `Code: ${coupon.code}`,
                margin: "lg",
                align: "center",
                weight: "bold",
              },
            ],
            paddingBottom: "20px",
          },
          footer: {
            type: "box",
            layout: "horizontal",
            contents: [
              {
                type: "button",
                action: {
                  type: "uri",
                  label: "ใช้คูปองตอนนี้ไหมจ้ะ",
                  uri:
                    coupon.id === 1
                      ? "https://web.hungryhub.com/th/restaurants/group/bangkok-best-buffet-restaurants/web"
                      : "https://www.watsons.co.th/th/blog/makeup-styles-th/10-%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%AA%E0%B8%B3%E0%B8%AD%E0%B8%B2%E0%B8%87%E0%B8%96%E0%B8%B9%E0%B8%81%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%94%E0%B8%B5%E0%B8%AA",
                },
                color: "#B497E7",
                style: "primary",
              },
            ],
          },
        },
      };

      // First try to share via shareTargetPicker
      if (liff.isApiAvailable("shareTargetPicker")) {
        await liff.shareTargetPicker([flexMessage]);
      }

      // Then send message directly using Messaging API
      const success = await sendLineMessage(userId, flexMessage);

      if (success) {
        // Mark coupon as used with current date
        const currentDate = new Date().toLocaleDateString("th-TH", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        // Save to state and local storage
        const updatedUsedCoupons = { ...usedCoupons, [coupon.id]: currentDate };
        setUsedCoupons(updatedUsedCoupons);

        if (typeof window !== "undefined") {
          localStorage.setItem(
            "usedCoupons",
            JSON.stringify(updatedUsedCoupons)
          );
        }

        // Show success message
        setShowSuccess(true);
      } else {
        setErrorMsg("ไม่สามารถส่งข้อความถึง LINE ได้ กรุณาลองใหม่อีกครั้ง");
        setTimeout(() => {
          setErrorMsg("");
        }, 3000);
      }
    } catch (error) {
      console.error("Error during coupon redemption:", error);
      setErrorMsg("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "grey.100",
        p: 2,
        position: "relative",
      }}
    >
      <Paper
        elevation={2}
        sx={{ p: 3, mb: 3, borderRadius: 2, position: "relative" }}
      >
        <Typography
          variant="h6"
          align="center"
          sx={{ fontWeight: "bold", color: "#0d3b66" }}
        >
          KD and CO. Coupon App
        </Typography>
        <Typography
          variant="h6"
          align="center"
          sx={{ fontWeight: "bold", color: "#0d3b66" }}
        >
          for NeNe Chan
        </Typography>

        {/* User Profile Section */}
        <Box
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          {isLoggedIn && profile ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar
                src={profile.pictureUrl}
                alt="Profile"
                sx={{
                  width: 64,
                  height: 64,
                  border: 2,
                  borderColor: "green.500",
                }}
              />
              <Typography sx={{ mt: 1, fontWeight: "medium" }}>
                {profile.displayName}
              </Typography>
              <Button
                onClick={handleLogout}
                variant="contained"
                color="error"
                size="small"
                sx={{ mt: 1, borderRadius: 28, textTransform: "none" }}
              >
                Logout
              </Button>
            </Box>
          ) : (
            <Button
              onClick={handleLogin}
              variant="contained"
              color="success"
              sx={{ borderRadius: 28, textTransform: "none", px: 3, py: 1 }}
            >
              Login with LINE
            </Button>
          )}
        </Box>
      </Paper>
      {/* Main Content */}
      <Container maxWidth="md" sx={{ position: "relative", zIndex: 0, p: 0 }}>
        {/* Overlay when success message is shown */}
        {showSuccess && (
          <Backdrop
            open={true}
            sx={{
              zIndex: 40,
              bgcolor: "rgba(0, 0, 0, 0.7)",
              backdropFilter: "blur(2px)",
            }}
          />
        )}

        {/* Coupon list */}
        <Stack spacing={2}>
          {coupons.map((coupon) => (
            <Paper
              key={coupon.id}
              elevation={1}
              sx={{
                p: 2,
                borderRadius: 2,
                border: "1px solid #e0e0e0",
                "&:hover": { boxShadow: 3 },
                transition: "box-shadow 0.3s ease",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#000", mb: 1 }}
              >
                {coupon.title}
              </Typography>
              <ThaiTypography
                variant="body2"
                color="text.secondary"
                sx={{ my: 1 }}
              >
                {coupon.description}
              </ThaiTypography>
              <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
                {coupon.dateValid}
              </Typography>
              <Paper
                variant="outlined"
                sx={{ bgcolor: "grey.100", p: 1, mb: 1.5, textAlign: "center" }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontFamily: "monospace", fontWeight: "bold" }}
                >
                  {coupon.code}
                </Typography>
              </Paper>

              {/* Used badge when coupon has been redeemed */}
              {usedCoupons[coupon.id] && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    mb: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: "#FF5722",
                      color: "white",
                      borderRadius: 10,
                      px: 2,
                      py: 0.5,
                      display: "inline-block",
                      fontFamily: "var(--font-kanit)",
                    }}
                  >
                    <ThaiTypography variant="body2" sx={{ fontSize: "0.8rem" }}>
                      ใช้ไปแล้ว: {usedCoupons[coupon.id]}
                    </ThaiTypography>
                  </Box>
                </Box>
              )}

              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  onClick={() => shareCoupon(coupon)}
                  disabled={
                    !isLoggedIn ||
                    coupon.id === 3 ||
                    isLoading ||
                    usedCoupons[coupon.id] !== undefined
                  }
                  variant="contained"
                  disableElevation
                  sx={{
                    borderRadius: 28,
                    bgcolor:
                      isLoggedIn && coupon.id !== 3 && !usedCoupons[coupon.id]
                        ? "#B497E7"
                        : "grey.400",
                    "&:hover": {
                      bgcolor:
                        isLoggedIn && coupon.id !== 3 && !usedCoupons[coupon.id]
                          ? "#9A7DCF"
                          : "grey.400",
                    },
                    textTransform: "none",
                    px: 2,
                  }}
                  endIcon={<RedeemIcon />}
                >
                  {isLoading
                    ? "redeeming..."
                    : usedCoupons[coupon.id]
                    ? "used"
                    : "redeem"}
                </Button>
              </Box>
            </Paper>
          ))}
        </Stack>

        {/* Success message - Dialog Container */}
        {showSuccess && (
          <Dialog
            open={true}
            fullWidth
            maxWidth="sm"
            TransitionProps={{
              timeout: 500,
              enter: true,
              exit: true,
            }}
            sx={{
              "& .MuiDialog-paper": {
                borderRadius: 2,
                textAlign: "center",
                p: { xs: 2, sm: 3 },
                maxWidth: "95%",
                animation: "fadeIn 0.5s ease-out",
                "@keyframes fadeIn": {
                  "0%": {
                    opacity: 0,
                    transform: "scale(0.9)",
                  },
                  "100%": {
                    opacity: 1,
                    transform: "scale(1)",
                  },
                },
              },
            }}
          >
            <Box
              sx={{
                width: { xs: "4rem", sm: "5rem" },
                height: { xs: "4rem", sm: "5rem" },
                bgcolor: "#00B900",
                borderRadius: "50%",
                mx: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: { xs: 1.5, sm: 2 },
                animation: "bounceIn 0.6s ease-out 0.2s both",
                "@keyframes bounceIn": {
                  "0%": {
                    opacity: 0,
                    transform: "scale(0)",
                  },
                  "70%": {
                    transform: "scale(1.1)",
                  },
                  "100%": {
                    opacity: 1,
                    transform: "scale(1)",
                  },
                },
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </Box>{" "}
            <ThaiTypography
              variant="h5"
              sx={{
                fontWeight: "bold",
                mb: { xs: 0.5, sm: 1 },
                color: "#00B900",
              }}
            >
              แลกคูปองสำเร็จ!
            </ThaiTypography>
            {selectedCoupon && (
              <Paper
                sx={{
                  bgcolor: "grey.100",
                  p: 1.5,
                  borderRadius: 2,
                  mb: 2,
                  position: "relative",
                }}
              >
                {usedCoupons[selectedCoupon.id] && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: -10,
                      right: -10,
                      bgcolor: "#FF5722",
                      color: "white",
                      borderRadius: "50%",
                      width: 24,
                      height: 24,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.7rem",
                      fontWeight: "bold",
                      border: "2px solid white",
                    }}
                  >
                    ✓
                  </Box>
                )}
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: "semibold",
                    color: "#f4d35e",
                    mb: 0.5,
                  }}
                >
                  {selectedCoupon.title}
                </Typography>
                <ThaiTypography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    mb: 1,
                  }}
                >
                  {selectedCoupon.description}
                </ThaiTypography>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "monospace",
                    fontWeight: "bold",
                  }}
                >
                  {selectedCoupon.code}
                </Typography>
                {usedCoupons[selectedCoupon.id] && (
                  <ThaiTypography
                    variant="body2"
                    sx={{
                      color: "#FF5722",
                      fontWeight: "medium",
                      mt: 1,
                      fontFamily: "var(--font-kanit)",
                    }}
                  >
                    ใช้ไปแล้วเมื่อ: {usedCoupons[selectedCoupon.id]}
                  </ThaiTypography>
                )}
              </Paper>
            )}
            <Button
              onClick={() => setShowSuccess(false)}
              variant="contained"
              disableElevation
              sx={{
                bgcolor: "#FCCF55",
                "&:hover": { bgcolor: "#e5ba4c" },
                borderRadius: 28,
                px: 3,
                py: 1,
                textTransform: "none",
                fontWeight: "medium",
                fontFamily: "var(--font-kanit)",
              }}
            >
              ปิด
            </Button>
          </Dialog>
        )}

        {/* Error message notification */}
        {errorMsg && (
          <Snackbar
            open={!!errorMsg}
            autoHideDuration={3000}
            onClose={() => setErrorMsg("")}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              severity="error"
              variant="filled"
              sx={{ fontFamily: "var(--font-kanit)" }}
            >
              {errorMsg}
            </Alert>
          </Snackbar>
        )}
      </Container>
    </Box>
  );
}
