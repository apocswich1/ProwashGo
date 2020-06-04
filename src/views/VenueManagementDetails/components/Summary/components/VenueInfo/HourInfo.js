import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Divider,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Typography, Grid, colors
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import LockOpenIcon from '@material-ui/icons/LockOpenOutlined';
import PersonIcon from '@material-ui/icons/PersonOutline';
import { Label } from 'components';
import { VenueEdit } from './components';
import translate from 'translate';

const t = translate;
// const useStyles = makeStyles(theme => ({
//   root: {},
//   content: {
//     padding: 0
//   },
//   actions: {
//     flexDirection: 'column',
//     alignItems: 'flex-start',
//     '& > * + *': {
//       marginLeft: 0
//     }
//   },
//   buttonIcon: {
//     marginRight: theme.spacing(1)
//   }
// }));

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
  },
  actions: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    '& > * + *': {
      marginLeft: 0
    }
  },
  buttonIcon: {
    marginRight: theme.spacing(1)
  }
}));

const HourInfo = props => {
  const { venue, className, actualizar, horas, idfranchise, ...rest } = props;

  const classes = useStyles();

  const [openEdit, setOpenEdit] = useState(false);

  const handleEditOpen = () => {
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
  };

  console.log(venue);

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
          md={4}
          sm={4}
          xs={12}
        >
          <Typography variant="h2">{horas} Horas</Typography>
          <Typography
            className={classes.overline}
            variant="overline"
          >
            Disponibilidad semanal
          </Typography>
        </Grid>
      </Grid>
    </Card>
  );
};

HourInfo.propTypes = {
  className: PropTypes.string,
  venue: PropTypes.object.isRequired
};

export default HourInfo;
