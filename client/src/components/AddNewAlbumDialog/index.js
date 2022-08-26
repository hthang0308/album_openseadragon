import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function AddNewAlbumDialog(props) {
  const { open, setOpen, onSubmitForm } = props;
  const albumName = React.useRef(null);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Album</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter album's name and description</DialogContentText>
          <TextField autoFocus margin="dense" id="name" label="Album name" type="text" fullWidth inputRef={albumName} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={(e) => {
              onSubmitForm(e, albumName.current.value);
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
