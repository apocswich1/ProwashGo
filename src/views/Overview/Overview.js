import React from 'react';
import { makeStyles } from '@material-ui/styles';

import { Page } from 'components';
import {
  Header,
  Statistics,
  StatisticsFranchise,
  Notifications,
  Projects,
  Todos
} from './components';
import { useSelector } from 'react-redux';

const useStyles = makeStyles(theme => ({
  root: {
    width: theme.breakpoints.values.lg,
    maxWidth: '100%',
    margin: '0 auto',
    padding: theme.spacing(3)
  },
  statistics: {
    marginTop: theme.spacing(3)
  },
  notifications: {
    marginTop: theme.spacing(6)
  },
  projects: {
    marginTop: theme.spacing(6)
  },
  todos: {
    marginTop: theme.spacing(6)
  }
}));

const Overview = () => {
  const classes = useStyles();
  const session = useSelector(state => state.session);
  const role = session.user.role;
  
  console.log(role);
  console.log(role);
  return (
    <Page
      className={classes.root}
      title="Overview"
    >
      <Header />
      {role=="ADMIN" && (
        <Statistics className={classes.statistics}  id={session.user.id}/>
      )}

      {role!=="ADMIN" && (
        <StatisticsFranchise className={classes.statistics} id={session.user.id}/>
      )}
      
      {/* <Notifications className={classes.notifications} />
      <Projects className={classes.projects} />
      <Todos className={classes.todos} /> */}
    </Page>
  );
};

export default Overview;
