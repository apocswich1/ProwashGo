import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, withStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import firebase from 'utils/firebase';
import axios from 'utils/axios';
import { CustomerInfo, Invoices, Wallet, SendEmails, OtherActions } from './components';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles(() => ({
  root: {}
}));

const Summary = props => {
  const { className, ...rest } = props;
  const classes = useStyles();
  const [customer, setCustomer] = useState();
  const [vertical, setVertical] = React.useState('top');
  const [horizontal, setHorizontal] = React.useState('center');
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [wallet, setWallet] = React.useState([]);
  const [typeMessage, setTypeMessage] = React.useState('');


  const ColorLinearProgress = withStyles({
    colorPrimary: {
      backgroundColor: '#b2dfdb',
    },
    barColorPrimary: {
      backgroundColor: '#00695c',
    },
  })(LinearProgress);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  useEffect(() => {
    let mounted = true;

    const fetchWallet = async () => {
      let ref = await firebase.firestore().collection("wallets").doc(props.id).get();
      let wallet = ref.data();
      setWallet(wallet);
    }

    const fetchCustomer = async () => {
      let users = [];
  
      fetch('https://us-central1-prowashgo-firebase.cloudfunctions.net/listUsersAdminByUserId', {
        method: 'post',
        mode: 'cors',
        body: JSON.stringify({ 'uid':props.id }),
      }).then(function (respuesta) {
        respuesta.json().then(body => {
          console.log(body);
          setCustomer(body.data);
          console.log(body.data);
        });
      }).catch(function (err) {
        console.log(err);
      });
    };  

    fetchCustomer();
    fetchWallet();

    return () => {
      mounted = false;
    };
  }, []);

  const fetchWallet = async () => {
    let ref = await firebase.firestore().collection("wallets").doc(props.id).get();
    let wallet = ref.data();
    setWallet(wallet);
  }

  const actualizar = async (msg,bodyres) => {
    let message = msg;
    let res = bodyres;
    let users = [];
    console.log("Actualizando...");
    setLoading(true);
    const refUser = firebase.firestore().collection('users').doc(props.id);
    refUser.get().then(async data=>{
      await users.push(data.data());        
      users[0].id = props.id;
      setCustomer(users[0]);
      console.log("Actualizado");
      
      if(res.code === 200){
        setMessage(message);
        setTypeMessage('success');
      }else{
        setMessage(res.message);
        setTypeMessage('warning');
      }
      
      setLoading(false);
      setOpen(true);
    }).catch(err => console.log(err));
  }

  if (!customer) {
    return null;
  }

  return (
    <Grid
      {...rest}
      className={clsx(classes.root, className)}
      container
      spacing={3}
    >
      <Snackbar
    autoHideDuration={6000}
    anchorOrigin={{ vertical, horizontal }}
    key={`${vertical},${horizontal}`}
    open={open}
    onClose={handleClose}
  >
    <Alert onClose={handleClose} severity={typeMessage}>
      {message}
    </Alert>
    </Snackbar>
      <Grid
        item
        lg={8}
        md={8}
        xl={8}
        xs={12}
      >
        {loading && (
      <ColorLinearProgress className={classes.margin} />
      )}
        <CustomerInfo customer={customer} actualizar={actualizar}/>
      </Grid>
      <Grid
        item
        lg={4}
        md={4}
        xl={4}
        xs={12}
      >
        <Wallet  
        product={customer} actualizar={actualizar} wallet={wallet} fetchWallet={fetchWallet}/>
      </Grid>
    {/*}  <Grid
        item
        lg={4}
        md={4}
        xl={4}
        xs={4}
      >
        <SendEmails customer={customer} />
    </Grid>*/}
      <Grid
        item
        lg={8}
        md={8}
        xl={8}
        xs={12}
      >
        <OtherActions  customer={customer} actualizar={actualizar}/>
      </Grid>
    </Grid>
  );
};

Summary.propTypes = {
  className: PropTypes.string
};

export default Summary;
