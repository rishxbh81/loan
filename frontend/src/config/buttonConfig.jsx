export const buttonConfig = ({
    isLogin = false,
    isProfileUpdate = false,
    isLogout = false,
    isUpload = false,
    isLoading = false,
    handleLogout = () => {},
    onSubmit = () => {},
  }) => {
    if (isLogin) {
      return [
        {
          text: "Generate OTP",
          id: "generateOtp",
          type: "button",
          onClick: () => console.log("Generate OTP clicked"),
          className: "bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600",
        },
        {
          text: "Verify OTP",
          id: "verifyOtp",
          type: "button",
          onClick: () => console.log("Verify OTP clicked"),
          className: "bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600",
          hidden: true, 
        },
      ];
    }
  
    if (isProfileUpdate) {
      return [
        {
          text: "Update Profile",
          id: "updateProfile",
          type: "submit",
          onClick: onSubmit,
          className: "bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600",
        },
      ];
    }
  
    if (isLogout) {
      return [
        {
          text: "Logout",
          id: "logout",
          type: "button",
          onClick: handleLogout,
          className: "bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600",
        },
      ];
    }
  
    if (isUpload) {
      return [
        {
          text: isLoading ? "Uploading..." : "Upload Document",
          id: "uploadDoc",
          type: "submit",
          onClick: onSubmit,
          className: `w-full p-3 rounded-md ${isLoading ? "bg-gray-400" : "bg-blue-500 text-white"}`,
          disabled: isLoading, 
        },
      ];
    }
  
   
    return [
      {
        text: "Generate OTP",
        id: "generateOtp",
        type: "button",
        onClick: () => console.log("Generate OTP clicked"),
        className: "bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600",
      },
      {
        text: "Verify OTP",
        id: "verifyOtp",
        type: "button",
        onClick: () => console.log("Verify OTP clicked"),
        className: "bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600",
        hidden: true, 
      },
    ];
  };
  