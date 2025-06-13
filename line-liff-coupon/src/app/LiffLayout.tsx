"use client";
import { LiffProvider, useLiff } from "./LiffProvider";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";

// The LIFF wrapper component
function LiffInitializer({ children }: { children: React.ReactNode }) {
  const { liffError, isLoading } = useLiff();

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
          bgcolor: "grey.100",
        }}
      >
        <Paper
          elevation={2}
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 2,
            maxWidth: 300,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              mb: 3,
              fontWeight: "bold",
              color: "#0d3b66",
            }}
          >
            LINE LIFF
          </Typography>
          <Typography
            variant="body1"
            sx={{ mb: 3, fontFamily: "var(--font-kanit)" }}
          >
            กำลังโหลด...
          </Typography>
          <CircularProgress
            sx={{
              color: "#B497E7",
              mb: 2,
            }}
            size={40}
          />
        </Paper>
      </Box>
    );
  }

  if (liffError) {
    return (
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
          bgcolor: "grey.100",
        }}
      >
        <Paper
          elevation={2}
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 2,
            maxWidth: 350,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              mb: 2,
              fontWeight: "bold",
              color: "error.main",
            }}
          >
            ไม่สามารถโหลด LINE LIFF ได้
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              mb: 2,
              fontFamily: "var(--font-kanit)",
            }}
          >
            {liffError}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mt: 2,
              fontFamily: "var(--font-kanit)",
            }}
          >
            โปรดตรวจสอบว่าคุณกำลังเข้าถึงเพจนี้ผ่านแอป LINE หรือตั้งค่า LIFF
            อย่างถูกต้องแล้ว
          </Typography>
        </Paper>
      </Box>
    );
  }

  // LIFF is initialized successfully
  return <Box>{children}</Box>;
}

// The layout component that provides the LIFF context
export default function LiffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LiffProvider>
      <LiffInitializer>{children}</LiffInitializer>
    </LiffProvider>
  );
}
