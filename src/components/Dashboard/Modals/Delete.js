import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import jwtAxios from "../../../libs/jwtAxios/jwtAxios";
import { toast } from "sonner";

export default function DeleteModal({ title, open, setOpen, content, api }) {
  const [loading, setLoading] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (b) => {
    setOpen(false);
  };

  const handleAgree = async () => {
    console.log(api);
    setLoading(true);
    let response = await jwtAxios.post(api.url, { id: api.data });
    setLoading(false);
    if (response.data.success) {
      toast.success(response.data.message);
      handleClose();
    } else {
      toast.error(response.data.message);
    }
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose("CANCEL")}>Cancel</Button>
          <Button onClick={() => handleAgree()} autoFocus>
            {loading ? "Please wait" : "Agree"}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
