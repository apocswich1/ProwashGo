import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { lighten, withStyles } from '@material-ui/core/styles';
import { Page, SearchBar } from 'components';
import { Header, Results } from './components';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import LinearProgress from '@material-ui/core/LinearProgress';
import firebase from 'utils/firebase';
import { useSelector } from 'react-redux';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  results: {
    marginTop: theme.spacing(3)
  },
  margin: {
    margin: theme.spacing(2),
    height: '5px'
  },
}));


const WasherManagementList = () => {
  const classes = useStyles();
  const session = useSelector(state => state.session);
  const role = session.user.role;
  const [washers, setWashers] = useState([]);
  const [washersBkp, setWashersBkp] = useState([]);
  const [search, setSearch] = useState('');
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [vertical, setVertical] = React.useState('top');
  const [horizontal, setHorizontal] = React.useState('center');
  const [typeMessage, setTypeMessage] = React.useState('');
  const [cboFranchises, setCboFranchises] = React.useState('');

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

  const handleChangeSearch = event => {
    setSearch(event.target.value);
  }

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const sortAsc = (array, label) => {
    const data = array.sort(function (a, b) {

      if (b[label] === "") {
        return 0;
      }
      if (b[label] > a[label]) {
        return -1;
      }
      if (a[label] > b[label]) {
        return 1;
      }
      return 0;
    });

    console.log(data);

    setWashers(data);
    setSearch([]);
    return;
  }

  const sortDesc = (array, label) => {
    const data = array.sort(function (a, b) {
      if (a[label] === "") {
        return 0;
      }
      if (a[label] > b[label]) {
        return -1;
      }
      if (b[label] > a[label]) {
        return 1;
      }
      return 0;
    });

    console.log(data);

    setWashers(data);
    setSearch([]);
    return;
  }



  useEffect(() => {

    let mounted = true;
    let usuarios = [];
    setLoading(true);

    const redondeo2decimales = (numero) => {
      var flotante = parseFloat(numero);
      var resultado = Math.round(flotante * 100) / 100;
      return resultado;
    }

    // const fetchPromedio = async () => {
    //   try {
    //     let ref = await firebase.firestore().collection('users').where("uid", "==", id).get();
    //     let datos = ref.docs.map(d => { return d.data() });
    //     let franchises = await firebase.firestore().collection('franchises').where("email", "==", datos[0].email).get();
    //     let datosFranchise = franchises.docs.map(d => { return d.data() });
    //     let orders = await firebase.firestore().collection('orders').where("franchiseID", "==", datosFranchise[0].id).get();
    //     let datosOrders = orders.docs.map(d => { return d.data() });
    //     let suma = 0;
    //     datosOrders.forEach(elem => {
    //       var evalo = elem.evaluationRate ? elem.evaluationRate : 0;
    //       console.log(evalo);
    //       suma = suma + evalo;
    //     });
    //     //console.log(redondeo2decimales(suma / datosOrders.length));
    //     setPromedio(redondeo2decimales(suma / datosOrders.length));
    //   } catch (error) {
    //     console.log(error);
    //   }

    // }


    const fetchWashers = async () => {
      let usuarios = [];
      fetch('https://us-central1-prowashgo-firebase.cloudfunctions.net/listWashersAdmin', {
        method: 'get',
        mode: 'cors',
      }).then(function (respuesta) {
        respuesta.json().then(async body => {

          for (var i = 0; i < body.usuarios.length; i++) {

            let todo = await firebase.firestore().collection('orders').where("washerID", "==", body.usuarios[i].id).get();
            let result = await todo.docs.map(item => { return item.data() });
            let suma = 0;
            let promedio = 0;
            if(result.length > 0){
              result.forEach(elem => {
                var evalo = elem.evaluationRate ? elem.evaluationRate : 0;
               // console.log(evalo);
                suma = suma + evalo;
              });
              console.log(redondeo2decimales(suma / result.length));
              promedio = redondeo2decimales(suma / result.length);
              }else{
              promedio = suma;
              }

              body.usuarios[i].promedio = promedio;
              usuarios.push(body.usuarios[i]);
              
            }
            

          if (role !== "ADMIN") {
            setWashers(usuarios.filter(item => item.franchiseID == session.user.id && item.deleted !== true));
            setWashersBkp(usuarios.filter(item => item.franchiseID == session.user.id && item.deleted !== true));
          } else {
            console.log("uso este condicional");
            setWashers(usuarios.filter(item => item.deleted !== true));
            setWashersBkp(usuarios.filter(item => item.deleted !== true));
          }

          console.log(usuarios);
          setLoading(false);
        });
      }).catch(function (err) {
        // Error :(
      });
    };

    let franchises = [];
    const cboFranchisesRef = firebase.firestore().collection("franchises").orderBy('name');
    //array de cbo de franquicias
    cboFranchisesRef.get().then((snapshot) => {
      snapshot.forEach(function (doc) {
        franchises.push(doc.data());
      });

      if (role !== "ADMIN") {
        setCboFranchises(franchises.filter(item => item.id == session.user.id));
      } else {
        setCboFranchises(franchises);
      }

    }).catch((error) => {
      console.log("Error getting documents");
    });

    fetchWashers();

    return () => {
      mounted = false;
    };
  }, []);
  const redondeo2decimales = (numero) => {
    var flotante = parseFloat(numero);
    var resultado = Math.round(flotante * 100) / 100;
    return resultado;
  }

  const actualizar = (msg, bodyres) => {
    const mensaje = msg;
    const res = bodyres;
    let usuarios = [];

    
    console.log("Actualizando...");
    setLoading(true);
    fetch('https://us-central1-prowashgo-firebase.cloudfunctions.net/listWashersAdmin', {
      method: 'get',
      mode: 'cors',
    }).then(function (respuesta) {
      respuesta.json().then(async body => {
        for (var i = 0; i < body.usuarios.length; i++) {

          let todo = await firebase.firestore().collection('orders').where("washerID", "==", body.usuarios[i].id).get();
          let result = await todo.docs.map(item => { return item.data() });
          let suma = 0;
          let promedio = 0;
          if(result.length > 0){
            result.forEach(elem => {
              var evalo = elem.evaluationRate ? elem.evaluationRate : 0;
             // console.log(evalo);
              suma = suma + evalo;
            });
            console.log(redondeo2decimales(suma / result.length));
            promedio = redondeo2decimales(suma / result.length);
            }else{
            promedio = suma;
            }

            body.usuarios[i].promedio = promedio;
            usuarios.push(body.usuarios[i]);
            
          }
        if (role !== "ADMIN") {
          setWashers(usuarios.filter(item => item.franchiseID == session.user.id && item.deleted !== true));
          setWashersBkp(usuarios.filter(item => item.franchiseID == session.user.id && item.deleted !== true));
        } else {
          setWashers(usuarios.filter(item => item.deleted !== true));
          setWashersBkp(usuarios.filter(item => item.deleted !== true));
        }

        console.log(usuarios);

        if (bodyres) {
          if (res.code === 200) {
            setMessage(mensaje);
            setTypeMessage('success');
          } else {
            setMessage(res.message);
            setTypeMessage('warning');
          }

          setLoading(false);
          setOpen(true);
        }
        setLoading(false);

      });
    }).catch(function (err) {
      // Error :(
    });
    console.log("Actualizado");
  }

  const handleFilter = () => { };

  const handleSearch = () => {
    let name = "";
    let email = "";
    let phone = "";
    let finded = [];

    if (search === "" || search == undefined) {
      actualizar();
      finded = [];
      setWashers(washersBkp);
      setWashersBkp(washersBkp);

    } else {

      let words = washersBkp.filter((item) => {
        if (item.hasOwnProperty('name') == true) {
          if (item.name != undefined) {
            if (item.name.toUpperCase().includes(search.toUpperCase()) == true) {
              //finded.push(item);
              name = 1;
            } else {
              name = 0;
            }
          }
        }

        if (item.hasOwnProperty('email') == true) {
          if (item.email != undefined) {
            if (item.email.toUpperCase().includes(search.toUpperCase()) == true) {
              //finded.push(item);
              email = 1;
            } else {
              email = 0;
            }
          }
        }

        if (item.hasOwnProperty('phone') == true) {
          if (item.phone != undefined) {
            if (item.phone.toUpperCase().includes(search.toUpperCase()) == true) {
              //finded.push(item);
              phone = 1;
            } else {
              phone = 0;
            }
          }
        }

        if (name === 1 || email === 1 || phone === 1) {
          finded.push(item);
        }

      });

      setWashers(finded);
    }
  };

  return (
    <Page
      className={classes.root}
      title="Washer Management List"
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
      <Header actualizar={actualizar} setLoading={setLoading} cboFranchises={cboFranchises} />
      <SearchBar
        onFilter={handleFilter}
        onSearch={handleSearch}
        handleChangeSearch={handleChangeSearch}
      />
      {loading && (
        <ColorLinearProgress className={classes.margin} />
      )}
      {washers && (
        <Results
          className={classes.results}
          washers={washers}
          actualizar={actualizar}
          sortAsc={sortAsc}
          sortDesc={sortDesc}
        />
      )}
    </Page>
  );
};

export default WasherManagementList;
