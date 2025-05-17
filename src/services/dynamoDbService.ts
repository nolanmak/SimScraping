/**
 * Helper to determine if code is running on server or client
 */
const isServer = typeof window === "undefined";

/**
 * Get the base URL for API requests based on environment
 */
const getBaseUrl = () => {
  // For server-side requests, use the absolute URL
  if (isServer) {
    // Use environment variable if available, otherwise default to localhost
    return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  }
  // For client-side requests, use relative URL
  return "";
};

/**
 * Fetches the next article from the Lambda function via proxy
 * @returns {Promise<Object>} - Object containing the next article, metadata, and cycle articles
 */
export const fetchNextArticle = async () => {
  try {
    // Use our proxy API endpoint with the appropriate base URL
    const apiUrl = `${getBaseUrl()}/api/proxy`;

    // Call the proxy API to get the next article
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        endpoint: "/LinkSimulation",
        method: "GET",
      }),
      cache: "no-cache",
      next: { revalidate: 0 },
    });

    // Check if the response is ok
    if (!response.ok) {
      // Try to get error details from response
      let errorMessage = `API error: ${response.status}`;
      try {
        const errorData = await response.text();
        errorMessage = `API error: ${response.status} - ${
          errorData || "No additional details"
        }`;
      } catch (parseError) {
        // Ignore error parsing issues
        console.debug("Error parsing error response:", parseError);
      }
      throw new Error(errorMessage);
    }

    // Parse the JSON response
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching next article:", error);
    // Return a default structure instead of throwing
    return {
      article: null,
      metadata: {
        cycleCount: 0,
        totalArticles: 0,
      },
      cycleArticles: [],
    };
  }
};

/**
 * Fetches all articles for the current cycle via proxy
 * @returns {Promise<Array>} - Array of articles for the current cycle
 */
export const fetchCurrentCycleArticles = async () => {
  try {
    // Use our proxy API endpoint with the appropriate base URL
    const apiUrl = `${getBaseUrl()}/api/proxy`;

    // Call the proxy API to get all articles for the current cycle
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        endpoint: "/LinkSimulation/cycle-articles",
        method: "GET",
      }),
      cache: "no-cache",
      next: { revalidate: 0 },
    });

    // Check if the response is ok
    if (!response.ok) {
      // Try to get error details from response
      let errorMessage = `API error: ${response.status}`;
      try {
        const errorData = await response.text();
        errorMessage = `API error: ${response.status} - ${
          errorData || "No additional details"
        }`;
      } catch (parseError) {
        // Ignore error parsing issues
        console.debug("Error parsing error response:", parseError);
      }

      console.error(errorMessage);
      // Return empty array instead of throwing
      return [];
    }

    // Parse the JSON response
    const data = await response.json();

    return data.cycleArticles || [];
  } catch (error) {
    console.error("Error fetching cycle articles:", error);
    return [];
  }
};

/**
 * Resets the cycle in the Lambda function via proxy
 * @returns {Promise<boolean>} - Whether the operation was successful
 */
export const resetCycle = async () => {
  try {
    // Use our proxy API endpoint with the appropriate base URL
    const apiUrl = `${getBaseUrl()}/api/proxy`;

    // Call the proxy API to reset the cycle
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        endpoint: "/LinkSimulation/reset",
        method: "POST",
      }),
      cache: "no-cache",
      next: { revalidate: 0 },
    });

    // Check if the response is ok
    if (!response.ok) {
      console.error(`Reset cycle failed with status: ${response.status}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error resetting cycle:", error);
    return false;
  }
};
