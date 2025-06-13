// Define types for LINE messages
type FlexContainer = {
  type: string;
  header?: FlexBox;
  hero?: FlexBox;
  body?: FlexBox;
  footer?: FlexBox;
  styles?: Record<string, any>;
};

type FlexBox = {
  type: string;
  layout: string;
  contents: Array<FlexComponent>;
  backgroundColor?: string;
  paddingTop?: string;
  paddingBottom?: string;
};

type FlexComponent = {
  type: string;
  text?: string;
  size?: string;
  weight?: string;
  color?: string;
  align?: string;
  wrap?: boolean;
  margin?: string;
  action?: {
    type: string;
    label: string;
    uri: string;
  };
};

type LineMessage = {
  type: string;
  altText?: string;
  contents?: FlexContainer;
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
