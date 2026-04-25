import { apiClient } from "./axios.config";

export const authService = {
  logout: async (): Promise<void> => {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed", error);
    }
  },
  refreshToken: async (refreshToken: string): Promise<string | null> => {
    if (!refreshToken) {
      return null;
    }
    try {
      const response = await apiClient.post<{ accessToken: string }>(
        "/auth/refresh",
        { refreshToken },
      );

      const { accessToken } = response.data;
      return accessToken;
    } catch (error) {
      console.error("Token refresh failed", error);
      return null;
    }
  },
};
