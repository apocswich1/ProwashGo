import React, { useState, useEffect } from 'react';
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
  colors
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import LockOpenIcon from '@material-ui/icons/LockOpenOutlined';
import PersonIcon from '@material-ui/icons/PersonOutline';

import { Label } from 'components';
import { WalletEditAmount } from './components';
import translate from 'translate';
import firebase from 'utils/firebase';

const t = translate;
const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
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

const ProductInfoPrice = props => {
  const { product, store, className, fetchWallet, wallet, actualizar,cboCategories, ...rest } = props;

  const classes = useStyles();

  const [openEdit, setOpenEdit] = useState(false);

  const handleEditOpen = () => {
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
  };
  console.log(wallet);
  useEffect(() => {
    let mounted = true;
    return () => {
      mounted = false;
    };
  }, []);

  return (
   
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader title={"Wallet"} />
      <Divider />
      <CardContent className={classes.content}>
      
        <Table>
          <TableBody>
              <TableRow>
              <TableCell>{t("Wallet")}</TableCell>
              <TableCell>{wallet.balance ? wallet.balance : 0}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        
      </CardContent>
      <CardActions className={classes.actions}>
        <Button onClick={handleEditOpen}>
          <EditIcon className={classes.buttonIcon} />
          {t("edit")} {"precios"}
        </Button>
      </CardActions>
     <WalletEditAmount
     product={product}
     actualizar={actualizar}
     onClose={handleEditClose}
     open={openEdit}
     cboCategories={cboCategories} 
     wallet={wallet}
     fetchWallet={fetchWallet}
   />
    </Card>
  );
};

ProductInfoPrice.propTypes = {
  className: PropTypes.string,
  product: PropTypes.object.isRequired
};

export default ProductInfoPrice;
