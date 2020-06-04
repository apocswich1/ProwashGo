import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Modal,
  Card,
  CardContent,
  CardActions,
  Grid,
  Typography,
  TextField,
  Switch,
  Button,
  colors
} from '@material-ui/core';
import firebase from 'utils/firebase';
import { useSelector } from 'react-redux';
import translate from 'translate';


const t = translate;
const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    outline: 'none',
    boxShadow: theme.shadows[20],
    width: 700,
    maxHeight: '100%',
    overflowY: 'auto',
    maxWidth: '100%'
  },
  container: {
    marginTop: theme.spacing(3)
  },
  actions: {
    justifyContent: 'flex-end'
  },
  saveButton: {
    color: theme.palette.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900]
    }
  }
}));

const WasherChange = props => {
  const { open, onClose, actualizar, setLoading, className, comision, ...rest } = props;

  const classes = useStyles();
  const session = useSelector(state => state.session);
  const role = session.user.role;
  const [formState, setFormState] = useState({});

  
  if (!open) {
    return null;
  }


  const validateForm = () => {
    let commissionError = "";
    let commissionErrorMessage = "";
    
    if(!formState.commission){
      commissionError = "Debe introducir la comisión";
      commissionErrorMessage = "Debe introducir la comision";
    }

    if(commissionError){
      setFormState(formState => ({
        ...formState,
        commissionError,commissionErrorMessage
      }));
      return false;
    }
    return true;
  }

  const handleFieldChange = event => {
    event.persist();
    setFormState(formState => ({
      ...formState,
      [event.target.name]:
        event.target.type === 'checkbox'
          ? event.target.checked
          : event.target.value,
    }));
  };

  const handleSave = (event) => {
    event.preventDefault();
    console.log(comision[0].id);
    let msg = "Comisión actualizada con exito";
    const isValid = validateForm();
    if(isValid){
      setLoading(true);
  

      let params = {
        "comission": +formState.commission,
        "id": comision[0].id
      }
console.log(params);
      fetch('https://us-central1-prowashgo-firebase.cloudfunctions.net/washerUpdateCommission', {
          method: 'post',
          mode: 'cors',
          body: JSON.stringify(params)
        }).then(function (respuesta) {
          respuesta.json().then(body => {
            console.log(body);
            actualizar(msg,body);
            });
        }).catch(function (err) {
          // Error :(
            console.log(err);
        });

      onClose();
      setFormState(formState => ({}));
    }

  };

  return (
    <Modal
      onClose={onClose}
      open={open}
    >
      <Card
        {...rest}
        className={clsx(classes.root, className)}
      >
        <form>
          <CardContent>
            <Typography
              align="center"
              gutterBottom
              variant="h3"
            >
              {t("change")} comisión global
            </Typography>
            <Grid
              className={classes.container}
              container
              spacing={3}
            >
             
              <Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                  fullWidth
                  label={t("Comisión")}
                  name="commission"
                  onChange={handleFieldChange}
                  value={formState.commission}
                  variant="outlined"
                  error={formState.commissionError}
                  helperText={formState.commissionErrorMessage}
                />
              </Grid>
             
            </Grid>
          </CardContent>
          <CardActions className={classes.actions}>
            <Button
              onClick={onClose}
              variant="contained"
            >
              {t("close")}
            </Button>
            <Button
              className={classes.saveButton}
              onClick={handleSave}
              variant="contained"
            >
              {t("save")}
            </Button>
          </CardActions>
        </form>
      </Card>
    </Modal>
  );
};

WasherChange.displayName = 'WasherChange';

WasherChange.propTypes = {
  className: PropTypes.string,
  washer: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool
};

WasherChange.defaultProps = {
  open: false,
  onClose: () => { }
};

export default WasherChange;
