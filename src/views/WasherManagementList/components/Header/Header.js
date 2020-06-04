import React,{ useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography, Button } from '@material-ui/core';
import { WasherAdd, WasherChange } from '../../../WasherManagementDetails/components/Summary/components/WasherInfo/components';
import { ReportWashers } from 'reportes';
import translate from 'translate';
import firebase from 'utils/firebase';
import { useSelector } from 'react-redux';

const t = translate;
const useStyles = makeStyles(() => ({
  root: {}
}));

const Header = props => {
  const { className, actualizar,setLoading, cboFranchises, ...rest } = props;
  const session = useSelector(state => state.session);
  const role = session.user.role;
  const [openEdit, setOpenEdit] = useState(false);
  const [openChange, setOpenChange] = useState(false);
  const [comision, setComision] = useState(false);

  const handleEditOpen = () => {
    setOpenEdit(true);
  };

  const handleChangeOpen = () => {
    setOpenChange(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
  };

  const handleChangeClose = () => {
    setOpenChange(false);
  };

  let commissions = [];
  const valComision = firebase.firestore().collection("rates");
        valComision.get().then((snapshot)=>{
            snapshot.forEach(function(doc) {
                commissions.push(doc.data());
        });
        setComision(commissions);
        }).catch((error)=>{
        console.log("Error getting documents");     
        });

  const classes = useStyles();

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Grid
        alignItems="flex-end"
        container
        justify="space-between"
        spacing={3}
      >
        <Grid item>
          <Typography
            component="h2"
            gutterBottom
            variant="overline"
          >
            {t("management")}
          </Typography>
          <Typography
            component="h1"
            variant="h3"
          >
            Prowashers
          </Typography>
        </Grid>
        {role==="ADMIN" && (
          <Grid item>
          <Button
            color="primary"
            variant="contained"
            onClick={handleChangeOpen}
          >
            {t("change")} comision
          </Button>
        </Grid>
        )}
        <Grid item>
          {<ReportWashers/>}
          <Button
            color="primary"
            variant="contained"
            onClick={handleEditOpen}
          >
            {t("add")} prowasher
          </Button>
        </Grid>
      </Grid>
      <WasherAdd
       // washer={washer}
        cboFranchises={cboFranchises}
        onClose={handleEditClose}
        open={openEdit}
        actualizar={actualizar}
        setLoading={setLoading}
        />
        <WasherChange
        cboFranchises={cboFranchises}
        onClose={handleChangeClose}
        open={openChange}
        actualizar={actualizar}
        setLoading={setLoading}
        comision={comision}
        />
    </div>
  );
};

Header.propTypes = {
  className: PropTypes.string
};

export default Header;
