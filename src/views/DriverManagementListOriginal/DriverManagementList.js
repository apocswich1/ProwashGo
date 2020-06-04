import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';

import axios from 'utils/axios';
import { Page, SearchBar } from 'components';
import { Header, Results } from './components';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  results: {
    marginTop: theme.spacing(3)
  }
}));

const DriverManagementList = () => {
  const classes = useStyles();

  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    let mounted = true;

    const fetchDrivers = () => {
      axios.get('/api/management/customers').then(response => {
        if (mounted) {
          setDrivers(response.data.customers);
        }
      });
    };

    fetchDrivers();

    return () => {
      mounted = false;
    };
  }, []);

  const handleFilter = () => {};
  const handleSearch = () => {};

  return (
    <Page
      className={classes.root}
      title="Driver Management List"
    >
      <Header />
      <SearchBar
        onFilter={handleFilter}
        onSearch={handleSearch}
      />
      {drivers && (
        <Results
          className={classes.results}
          drivers={drivers}
        />
      )}
    </Page>
  );
};

export default DriverManagementList;
