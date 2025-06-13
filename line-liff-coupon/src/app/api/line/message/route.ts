"use server";

import { LINE_CONFIG } from "@/app/lineConfig";

export async function POST(request: Request) {
  try {
    const { userId, message } = await request.json();
    
    if (!userId || !message) {
      return Response.json({ success: false, error: "Missing required parameters" }, { status: 400 });
    }
    
    if (!LINE_CONFIG.CHANNEL_ACCESS_TOKEN) {
      return Response.json(
        { success: false, error: "LINE_CHANNEL_ACCESS_TOKEN is not configured" }, 
        { status: 500 }
      );
    }
    
    const response = await fetch(LINE_CONFIG.MESSAGING_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LINE_CONFIG.CHANNEL_ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        to: userId,
        messages: [message]
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      return Response.json(
        { success: false, error: `LINE API Error: ${errorText}` }, 
        { status: response.status }
      );
    }
    
    return Response.json({ success: true });
  } catch (error) {
    console.error("Error sending LINE message:", error);
    return Response.json(
      { success: false, error: "Internal server error" }, 
      { status: 500 }
    );
  }
}
