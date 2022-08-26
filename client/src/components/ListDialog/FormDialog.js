import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { post } from "../../utils/ApiCaller";

export default function FormDialog(props) {
  const { openMiniDialog, setOpenMiniDialog, onSubmitForm } = props;
  const username = React.useRef(null);

  const handleClose = () => {
    setOpenMiniDialog(false);
  };

  return (
    <div>
      <Dialog open={openMiniDialog} onClose={handleClose}>
        <DialogTitle>Share To This User</DialogTitle>
        <DialogContent>
          <DialogContentText>Shared user can view, but can neither edit nor delete.</DialogContentText>
          <TextField autoFocus margin="dense" id="name" label="Username" type="text" fullWidth inputRef={username} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {JSON.stringify(username?.current?.value)}
          <Button
            onClick={(e) => {
              onSubmitForm(e, username.current.value);
              handleClose();
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
