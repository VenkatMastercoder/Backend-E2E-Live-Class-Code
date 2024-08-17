import { useEffect, useState } from "react";
import { axiosInstance } from "../Interceptor/AxiosInstance";

const User = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get("/protected", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        });
        setUserData(response.data);
        console.log(response.data);
      } catch (error) {
        setError("Failed to fetch user data");
      }
    };

    fetchUserData();
  }, []);

  return <p>User</p>;
};

export default User;
