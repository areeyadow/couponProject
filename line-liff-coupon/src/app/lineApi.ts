/* eslint-disable @typescript-eslint/no-explicit-any */
// Define type for the message
type LineMessage = {
  type: string;
  altText?: string;
  contents?: any;
  text?: string;
};

export async function sendLineMessage(
  userId: string,
  message: LineMessage
): Promise<boolean> {
  try {
    // Call our server-side API endpoint to send the message
    const response = await fetch("/api/line/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        message,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to send LINE message:", errorData.error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error sending LINE message:", error);
    return false;
  }
}
