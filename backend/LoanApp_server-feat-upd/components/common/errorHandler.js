module.exports = {
    handleBadRequest: (res, message) => res.status(400).json({ status: "error", message }),
    handleInternalError: (res, error, logMessage = "Server Error") => {
      console.error(logMessage, error);
      res.status(500).json({ status: "error", message: "Internal Server Error" });
    },
  };
  