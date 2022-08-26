import * as React from "react";
import PersonIcon from "@material-ui/icons/Person";
import AddIcon from "@material-ui/icons/Add";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { useState } from "react";
import FormDialog from "./FormDialog";
import {
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  DialogTitle,
  Dialog,
  Typography,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import { set } from "lodash";

export default function SimpleDialog(props) {
  const { items, open, setOpen, onSubmitForm, onListItemDelete } = props;

  const [openMiniDialog, setOpenMiniDialog] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleListItemClick = (value) => {
    setOpenMiniDialog(true);
  };

  const handleListItemDelete = (value) => {
    onListItemDelete(value);
  };

  const onSubmitMiniform = (e, value) => {
    onSubmitForm(e, value);
  };

  return (
    <>
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Share</DialogTitle>
        <List sx={{ pt: 0 }}>
          {items?.map((item) => (
            <ListItem key={item}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={item} />
              <Button onClick={() => handleListItemDelete(item)}>
                <DeleteIcon />
              </Button>
            </ListItem>
          ))}
          <ListItem
            style={{ cursor: "pointer" }}
            sx={{ "&:hover": { background: "#f5f5f5" } }}
            onClick={() => handleListItemClick("addAccount")}
          >
            <ListItemAvatar>
              <Avatar>
                <AddIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Add account" />
          </ListItem>
        </List>
      </Dialog>
      <FormDialog
        openMiniDialog={openMiniDialog}
        setOpenMiniDialog={setOpenMiniDialog}
        onSubmitForm={onSubmitMiniform}
      />
    </>
  );
}

// export default function SimpleDialogDemo(props) {
//   const [open, setOpen] = React.useState(false);
//   const [selectedValue, setSelectedValue] = React.useState(items[1]);

//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = (value) => {
//     setOpen(false);
//     setSelectedValue(value);
//   };

//   return (

//   );
// }
