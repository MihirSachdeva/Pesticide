import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import ColorSwatches from "./TagColorSwatches";

export default function FormDialog(props) {
  const handleClose = (choice = false) => {
    props.confirmFormDialog(props.action, choice, props.data, fields);
    props.closeFormDialog();
  };

  const [fields, setFields] = React.useState(props.fields);
  const [colorSwatchesType, setColorSwatchesType] = React.useState(
    props.colorSwatchesType
  );
  const handleFieldChange = (event) => {
    let fieldName = event.target.name;
    let fieldValue = event.target.value;
    setFields((prevFields) => {
      let index = prevFields.findIndex((field) => field.name == fieldName);
      let newFields = [...prevFields];
      newFields[index].value = fieldValue;
      return newFields;
    });
  };

  React.useEffect(() => {
    setFields(props.fields);
    setColorSwatchesType(props.colorSwatchesType);
  }, [props]);

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={() => {
          handleClose(false);
        }}
        aria-labelledby="form-dialog-title"
        className="alert-dialog"
      >
        <DialogTitle id="form-dialog-title">{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{props.description}</DialogContentText>
          {fields &&
            fields != [] &&
            fields.map((field) => (
              <TextField
                margin="dense"
                label={field.title}
                name={field.name}
                value={field.value}
                onChange={handleFieldChange}
                style={{
                  fontWeight: "600",
                }}
              />
            ))}
          {props.showColorSwatches && (
            <ColorSwatches type={colorSwatchesType} />
          )}
        </DialogContent>
        <hr className="divider2 divider-thin" />
        <DialogActions>
          <Button
            onClick={() => {
              handleClose(false);
            }}
            color="secondary"
            className="alert-action-button"
          >
            {props.cancel}
          </Button>
          <div className="divider-vertical"></div>
          <Button
            onClick={() => {
              handleClose(true);
            }}
            color="secondary"
            className="alert-action-button"
          >
            {props.confirm}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
