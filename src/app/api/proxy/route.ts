import { NextRequest, NextResponse } from "next/server";

// Base URL for the external API
const API_BASE_URL =
  "https://b6zibzuazj.execute-api.us-east-1.amazonaws.com/LFG";

/**
 * Proxy handler for API requests
 */
export async function POST(request: NextRequest) {
  try {
    // Get the endpoint and request body from the request
    const {
      endpoint,
      method = "GET",
      headers = {},
      body = null,
    } = await request.json();

    if (!endpoint) {
      return NextResponse.json(
        { error: "Endpoint is required" },
        { status: 400 }
      );
    }

    // Construct the full URL
    const url = `${API_BASE_URL}${endpoint}`;

    // Set up headers with origin
    const requestHeaders = {
      Accept: "application/json",
      "Content-Type": "application/json",
      Origin: "https://localhost:3000",
      Referer: "https://localhost:3000/",
      ...headers,
    };

    // Make the request to the external API
    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : null,
      cache: "no-cache",
    });

    // If the response is not ok, throw an error
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error: ${response.status}`, errorText);

      return NextResponse.json(
        { error: `API error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    // Parse the response as JSON
    const data = await response.json();

    // Return the data
    return NextResponse.json(data);
  } catch (error) {
    console.error("Proxy error:", error);

    return NextResponse.json(
      { error: "Failed to proxy request", details: (error as Error).message },
      { status: 500 }
    );
  }
}
