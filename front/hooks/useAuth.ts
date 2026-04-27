import { authService } from "@/services/api/auth.service";
import { IRootState, useAppDispatch } from "@/store";
import { setAuth, clearAuth } from "@/store/slices/authSlice";
import { LoginCredentials, RegisterCredentials } from "@/types/auth.types";
import { useState } from "react";
import { useSelector } from "react-redux";

export function useAuth() {
  const authState = useSelector((state: IRootState) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const logout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.logout();
    } catch (error) {
      // vẫn nên xóa state local dù API lỗi
    } finally {
      dispatch(clearAuth());
      setIsLoading(false);
    }
  };

  const register = async (
    credentials: RegisterCredentials,
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.register(credentials);
      dispatch(
        setAuth({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          user: response.user,
        }),
      );
      return true;
    } catch (error) {
      setError("Registration failed. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(credentials);

      dispatch(
        setAuth({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          user: response.user,
        }),
      );

      return true;
    } catch (error) {
      setError("Login failed. Please try again" + error);
      return false;
    }
  };

  return {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading,
    error,
    logout,
    login,
    register,
  };
}
