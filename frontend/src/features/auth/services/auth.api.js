import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1/auth",
  withCredentials: true,
});

export const register = async ({ username, email, password }) => {
  try {
    const response = await api.post(
      "/user/register",
      {
        username,
        email,
        password,
      },
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw { message: "Something went wrong" };
    }
  }
};

export const login = async ({ email, password, token }) => {
  try {
    const response = await api.post(
      "/user/login",
      {
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw { message: "Something went wrong" };
    }
  }
};

export const forgetPassword = async ({ email, token }) => {
  try {
    const response = await api.post(
      "/user/forget-password",
      {
        email,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw {
        message: "Something went wrong",
      };
    }
  }
};

export const resetPassword = async ({ token, password }) => {
  try {
    const response = await api.post(`/user/reset-password/${token}`, {
      password,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw {
        message: "Something went wrong",
      };
    }
  }
};

export const getMe = async () => {
  try {
    const response = await api.get("/user/get-me");
    return response.data.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw {
        message: "Something went wrong",
      };
    }
  }
};

export const logout = async () => {
  try {
    const response = await api.get("/user/logout");
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw {
        message: "Something went wrong",
      };
    }
  }
};