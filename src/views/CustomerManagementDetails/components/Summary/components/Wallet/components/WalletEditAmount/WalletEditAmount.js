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
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import translate from 'translate';
import config from 'config';
import { FilesDropzone } from 'components';
import { FilesDropzoneFile } from 'components';
import { FilesDropzonePromo } from 'components';
import firebase from 'utils/firebase';

const t = translate;
const service = config.servicio;

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

const WalletEditAmount = props => {
  const { open, onClose, product, actualizar,wallet, fetchWallet, className, cboCategories, ...rest } = props;
  const [filess, setFiless] = useState([]);
  const [filessdoc, setFilessdoc] = useState([]);
  const [filesspromo, setFilesspromo] = useState([]);
  const classes = useStyles();

  const [formState, setFormState] = useState({
   balance:wallet.balance,
    ...product
  });

  if (!open) {
    return null;
  }

  const handleChangeCategory = async event => {
    event.persist();
        setFormState(formState => ({
          ...formState,
          'categoryID':event.target.value,
          'categoryName':event._targetInst.memoizedProps.children[0][0],
        }));      
    
  
    console.log(formState);
  }

  const handleFieldChange = event => {
    event.persist();
    setFormState(formState => ({
      ...formState,
      [event.target.name]:
        event.target.type === 'checkbox'
          ? event.target.checked
          : event.target.value
    }));
  };


  const validateForm = () => {
    let balanceError = "";
    let balanceErrorMessage = "";
   

    if(!formState.balance){
      balanceError = "Debe introducir el monto del balance";
      balanceErrorMessage = "Debe introducir el monto del balance";
    }


    if(balanceError){
      
      setFormState(formState => ({
        ...formState,
        balanceError,
        balanceErrorMessage
      }));
      return false;
    }
    return true;
  }

  const handleSave = async () => {
    console.log(formState);
    const isValid = validateForm();
    let msg = "Wallet actualizado exitosamente!";
    if(isValid){
      let productid = product.uid;
  

    console.log(productid+" ... "+formState.balance);
    try {
    
    const ref = await firebase.firestore().collection('wallets').doc(productid);
    await ref.set({balance: +formState.balance}, {merge: true});
    actualizar("Balance actualizado con éxito",{code:200,message:"Balance actualizado con éxito"});
    fetchWallet();
    } catch (error) {
    actualizar("Balance no actualizado, algo ocurrió",{code:500,message:"Balance no actualizado, algo ocurrió"});  
    fetchWallet();
    }
    
    onClose();
    return;
    }
  }

  // if (!salcobrand || !cruzverde || !ahumada) {
  //   return null;
  // }

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
              {t("Edit")} {t("Wallet")}
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
                  label={t("Balance")}
                  name="balance"
                  onChange={handleFieldChange}
                  value={formState.balance}
                  variant="outlined"
                  error={formState.balanceError}
                  helperText={formState.balanceErrorMessage}
                />
              </Grid>
              <Grid item />
          
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
              //onClick={onClose}
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

WalletEditAmount.displayName = 'WalletEditAmount';

WalletEditAmount.propTypes = {
  className: PropTypes.string,
  product: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool
};

WalletEditAmount.defaultProps = {
  open: false,
  onClose: () => {}
};

export default WalletEditAmount;
