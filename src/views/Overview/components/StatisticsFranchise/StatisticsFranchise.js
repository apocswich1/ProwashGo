import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Card, Typography, Grid, colors } from '@material-ui/core';
import axios from 'utils/axios';
import { Label } from 'components';
import firebase from 'utils/firebase';
import moment from 'moment';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  item: {
    padding: theme.spacing(3),
    textAlign: 'center',
    [theme.breakpoints.up('md')]: {
      '&:not(:last-of-type)': {
        borderRight: `1px solid ${theme.palette.divider}`
      }
    },
    [theme.breakpoints.down('sm')]: {
      '&:not(:last-of-type)': {
        borderBottom: `1px solid ${theme.palette.divider}`
      }
    }
  },
  titleWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  label: {
    marginLeft: theme.spacing(1)
  },
  overline: {
    marginTop: theme.spacing(1)
  }
}));

const StatisticsFranchise = props => {
  const { className, id, ...rest } = props;
  const classes = useStyles();
  const [statisticsFranchise, setStatisticsFranchise] = useState(null);
  const [users, setUsers] = useState([]);
  const [promedio, setPromedio] = useState(null);
  const [orders, setOrders] = useState([]);
  const [ordersToday, setOrdersToday] = useState([]);
  const [ordersMonth, setOrdersMonth] = useState([]);
  const [amountMonth, setAmountMonth] = useState(null);
  const [amountAnual, setAmountAnual] = useState(null);

  useEffect(() => {
    let mounted = true;


    const thousands = (nStr) => {
      nStr += '';
      var x = nStr.split('.');
      var x1 = x[0];
      var x2 = x.length > 1 ? '.' + x[1] : '';
      var rgx = /(\d+)(\d{3})/;
      while (rgx.test(x1)) {
          x1 = x1.replace(rgx, '$1' + ',' + '$2');
      }
      return x1 + x2;    }

    const fetchAmountAnual = async () => {
      try {
        let ref = await firebase.firestore().collection('users').where("uid", "==", id).get();
        let datos = ref.docs.map(d => { return d.data() });
        let franchises = await firebase.firestore().collection('franchises').where("email", "==", datos[0].email).get();
        let datosFranchise = franchises.docs.map(d => { return d.data() });
        let orders = await firebase.firestore().collection('orders').get();
        let datosOrders = orders.docs.map(d => { return d.data() });
        let suma = 0;
        datosOrders.filter(item => item.franchiseID == datosFranchise[0].id).forEach(elem => {
          var evalo = elem.totalPrice ? elem.totalPrice : 0;
          suma = suma + evalo;
        });
        setAmountAnual(thousands(suma));
      } catch (error) {
        console.log(error);
      }
    }

    const fetchAmountMonth = async () => {
      try {
        let fechaInicio = firebase.firestore.Timestamp.fromDate(new Date(moment(new Date()).add(-1, 'days')));
        let fechaFinMesAnterior = firebase.firestore.Timestamp.fromDate(new Date(moment().date(0)));
        let fechaFinMesActual = firebase.firestore.Timestamp.fromDate(new Date(moment().date(31)));

        let fechaFin = firebase.firestore.Timestamp.fromDate(new Date(moment(new Date())));
        let ref = await firebase.firestore().collection('users').where("uid", "==", id).get();
        let datos = ref.docs.map(d => { return d.data() });
        let franchises = await firebase.firestore().collection('franchises').where("email", "==", datos[0].email).get();
        let datosFranchise = franchises.docs.map(d => { return d.data() });
        let orders = await firebase.firestore().collection('orders')
          .where('date', '>=', fechaFinMesAnterior)
          .where('date', '<=', fechaFinMesActual)
          .orderBy('date', 'desc')
          .get();
        let datosOrders = orders.docs.map(d => { return d.data() });
        console.log(datosOrders);
        //setOrdersMonth(datosOrders.filter(item => item.franchiseID == datosFranchise[0].id));
        let suma = 0;
        datosOrders.filter(item => item.franchiseID == datosFranchise[0].id).forEach(elem => {
          var evalo = elem.totalPrice ? elem.totalPrice : 0;
          console.log(evalo);
          suma = suma + evalo;
        });
        setAmountMonth(thousands(suma));
      } catch (error) {
        console.log(error);
      }
    }

    const fetchOrdersMonth = async () => {
      try {
        let fechaInicio = firebase.firestore.Timestamp.fromDate(new Date(moment(new Date()).add(-1, 'days')));
        let fechaFinMesAnterior = firebase.firestore.Timestamp.fromDate(new Date(moment().date(0)));
        let fechaFinMesActual = firebase.firestore.Timestamp.fromDate(new Date(moment().date(31)));

        let fechaFin = firebase.firestore.Timestamp.fromDate(new Date(moment(new Date())));
        let ref = await firebase.firestore().collection('users').where("uid", "==", id).get();
        let datos = ref.docs.map(d => { return d.data() });
        let franchises = await firebase.firestore().collection('franchises').where("email", "==", datos[0].email).get();
        let datosFranchise = franchises.docs.map(d => { return d.data() });
        let orders = await firebase.firestore().collection('orders')
          .where('date', '>=', fechaFinMesAnterior)
          .where('date', '<=', fechaFinMesActual)
          .orderBy('date', 'desc')
          .get();
        let datosOrders = orders.docs.map(d => { return d.data() });
        console.log(datosOrders);
        setOrdersMonth(datosOrders.filter(item => item.franchiseID == datosFranchise[0].id));
      } catch (error) {
        console.log(error);
      }
    }

    const fetchOrdersToday = async () => {
      try {
        let fechaInicio = firebase.firestore.Timestamp.fromDate(new Date(moment(new Date()).add(-1, 'days')));
        let ref = await firebase.firestore().collection('users').where("uid", "==", id).get();
        let datos = ref.docs.map(d => { return d.data() });
        let franchises = await firebase.firestore().collection('franchises').where("email", "==", datos[0].email).get();
        let datosFranchise = franchises.docs.map(d => { return d.data() });
        let orders = await firebase.firestore().collection('orders')
          // .where("franchiseID", "==", datosFranchise[0].id)
          .where('date', '>=', fechaInicio)
          .orderBy('date', 'desc')
          .get();
        let datosOrders = orders.docs.map(d => { return d.data() });
        //console.log(datosOrders.filter(item => item.franchiseID == datosFranchise[0].id));
        setOrdersToday(datosOrders.filter(item => item.franchiseID == datosFranchise[0].id));
      } catch (error) {
        console.log(error);
      }
    }

    const fetchWashers = async () => {
      try {
        let ref = await firebase.firestore().collection('users').where("uid", "==", id).get();
        let datos = ref.docs.map(d => { return d.data() });
        let franchises = await firebase.firestore().collection('franchises').where("email", "==", datos[0].email).get();
        let datosFranchise = franchises.docs.map(d => { return d.data() });
        let washers = await firebase.firestore().collection('washers').where("franchiseID", "==", datosFranchise[0].id).get();
        let datosWashers = washers.docs.map(d => { return d.data() });
        setUsers(datosWashers.filter(item => item.deleted !== true));
      } catch (error) {
        console.log(error);
      }

    }

    const redondeo2decimales = (numero) => {
      var flotante = parseFloat(numero);
      var resultado = Math.round(flotante * 100) / 100;
      return resultado;
    }

    const fetchPromedio = async () => {
      try {
        let ref = await firebase.firestore().collection('users').where("uid", "==", id).get();
        let datos = ref.docs.map(d => { return d.data() });
        let franchises = await firebase.firestore().collection('franchises').where("email", "==", datos[0].email).get();
        let datosFranchise = franchises.docs.map(d => { return d.data() });
        let orders = await firebase.firestore().collection('orders').where("franchiseID", "==", datosFranchise[0].id).get();
        let datosOrders = orders.docs.map(d => { return d.data() });
        let suma = 0;
        datosOrders.forEach(elem => {
          var evalo = elem.evaluationRate ? elem.evaluationRate : 0;
          console.log(evalo);
          suma = suma + evalo;
        });
        //console.log(redondeo2decimales(suma / datosOrders.length));
        setPromedio(redondeo2decimales(suma / datosOrders.length));
      } catch (error) {
        console.log(error);
      }

    }

    const fetchUsers = () => {
      fetch('https://us-central1-prowashgo-firebase.cloudfunctions.net/listUsersAdmin', {
        method: 'get',
        mode: 'cors',
      }).then(function (respuesta) {
        respuesta.json().then(body => {
          console.log(body.usuarios);
          setUsers(body.usuarios.filter(item => item.deleted !== true));
        });
      }).catch(function (err) {
        // Error :(
      });
    };

    const fetchOrders = () => {
      fetch('https://us-central1-prowashgo-firebase.cloudfunctions.net/listOrdersAdmin', {
        method: 'get',
        mode: 'cors',
      }).then(function (respuesta) {
        respuesta.json().then(body => {
          console.log(body.usuarios);
          setOrders(body.usuarios.filter(item => item.deleted !== true));
        });
      }).catch(function (err) {
        // Error :(
      });
    };

    const fetchStatisticsFranchise = () => {
      axios.get('/api/account/statistics').then(response => {
        if (mounted) {
          setStatisticsFranchise(response.data.statistics);
        }
      });
    };

    fetchOrders();
    fetchPromedio();
    fetchWashers();
    fetchStatisticsFranchise();
    fetchOrdersToday();
    fetchOrdersMonth();
    fetchAmountMonth();
    fetchAmountAnual();

    return () => {
      mounted = false;
    };
  }, []);

  if (!statisticsFranchise) {
    return null;
  }

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Grid
        alignItems="center"
        container
        justify="space-between"
      >
        <Grid
          className={classes.item}
          item
          md={2}
          sm={6}
          xs={12}
        >
          <Typography variant="h2">${amountAnual}</Typography>
          <Typography
            className={classes.overline}
            variant="overline"
          >
            Recaudación Anual
          </Typography>
        </Grid>
        <Grid
          className={classes.item}
          item
          md={2}
          sm={6}
          xs={12}
        >
          <Typography variant="h2">${amountMonth}</Typography>
          <Typography
            className={classes.overline}
            variant="overline"
          >
            Recaudación del Mes
          </Typography>
        </Grid>
        <Grid
          className={classes.item}
          item
          md={2}
          sm={6}
          xs={12}
        >
          <Typography variant="h2">{ordersMonth.length}</Typography>
          <Typography
            className={classes.overline}
            variant="overline"
          >
            Ordenes del Mes
          </Typography>
        </Grid>
        <Grid
          className={classes.item}
          item
          md={2}
          sm={6}
          xs={12}
        >
          <Typography variant="h2">{ordersToday.length}</Typography>
          <Typography
            className={classes.overline}
            variant="overline"
          >
            Ordenes del Día
          </Typography>
        </Grid>
        <Grid
          className={classes.item}
          item
          md={2}
          sm={6}
          xs={12}
        >
          <Typography variant="h2">{users.length}</Typography>
          <Typography
            className={classes.overline}
            variant="overline"
          >
            Total Prowashers
          </Typography>
        </Grid>
        <Grid
          className={classes.item}
          item
          md={2}
          sm={6}
          xs={12}
        >
          <div className={classes.titleWrapper}>
            <Typography
              component="span"
              variant="h2"
            >
              {promedio}
            </Typography>
            <Label
              className={classes.label}
              color={colors.green[600]}
            >
              Live
            </Label>
          </div>
          <Typography
            className={classes.overline}
            variant="overline"
          >
            Calificación Promedio
          </Typography>
        </Grid>
      </Grid>
    </Card>
  );
};

StatisticsFranchise.propTypes = {
  className: PropTypes.string
};

export default StatisticsFranchise;
