import React from "react";
import { Navigate } from "react-router-dom";

function ReplyPage() {
  const userId = sessionStorage.getItem("userId");
  if (!userId) {
    return <Navigate to="/" replace={true} />;
  }
  return <div>Replies</div>;
}

export default ReplyPage;
