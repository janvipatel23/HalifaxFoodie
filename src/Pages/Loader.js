import { Box, CircularProgress, Dialog, DialogContent } from "@mui/material";

/**
 * Author: Janvi Patel
 * Loader Component.
 */
export function LoaderComp(props) {
  return (
    props.open != undefined && (
      <Dialog onClose={props.handleClose} open={props.open}>
        <DialogContent id="simple-dialog-title">
          <Box sx={{ display: "flex" }}>
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    )
  );
}
