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
        }}
      >
        <Paper
          elevation={2}
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              mb: 3,
              fontWeight: "bold",
            }}
          >
            Loading Page...
          </Typography>
          <CircularProgress color="primary" size={40} />
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
        }}
      >
        <Paper
          elevation={2}
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 2,
            maxWidth: "sm",
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
            Error loading LIFF
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {liffError}
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Please make sure you are accessing this page through the LINE app or
            that you have set up LIFF correctly.
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
