import React from "react";
import Modal from "../Modal-Backdrop/Modal";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { AiFillCloseCircle } from "react-icons/ai";
import classes from "../Form/SignUp.module.css";
import { Button } from "@material-ui/core";
import ErrorModal from "../Modal-Backdrop/ErrorModal";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { useHttpClient } from "../hooks/http-hook";
import { UseSession } from "../../Context/Session";

function UserUpdate({ toggle }) {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const session = UseSession();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const newPass = data.get("update-password").trim();
    const verPass = data.get("update-verify").trim();
    if (!(newPass.length > 6 && verPass.length > 6 && newPass == verPass))
      return;

    try {
      await sendRequest(
        `http://localhost:3000/users/update/${session.session.userId}`,
        "PATCH",
        JSON.stringify({
          password: newPass,
        }),
        { "Content-Type": "application/json" }
      );
    } catch (err) {}
    toggle();
  };
  return (
    <>
      <Modal
        show={true}
        onCancel={toggle}
        header={
          <>
            <AiFillCloseCircle onClick={toggle} className={classes.icon} />
            <p>Set A New Password</p>
          </>
        }
        footer={<></>}
      >
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{ mt: 3 }}
          className="edit-from-container"
        >
          <TextField
            type="password"
            name="update-password"
            required
            fullWidth
            id="update-password"
            label="New Password"
          />
          <div className="text-space"></div>
          <TextField
            type="password"
            name="update-verify"
            required
            fullWidth
            id="update-verify"
            label="Verify New Password"
          />
          <div className="text-space"></div>
          <Button type="submit" variant="contained">
            change password
          </Button>
        </Box>
      </Modal>
    </>
  );
}

export default UserUpdate;
