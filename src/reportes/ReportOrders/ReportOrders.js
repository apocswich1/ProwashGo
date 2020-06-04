import React , { useState, useEffect } from "react";
import ReactExport from "react-export-excel";
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography, Button } from '@material-ui/core';
import firebase from 'utils/firebase';
import { useSelector } from 'react-redux';
import { colors } from '@material-ui/core';
import moment from 'moment';

const useStyles = makeStyles(() => ({
  root: {}
}));

const ReportOrders = props => {
const { className, actualizar, ...rest } = props;
const classes = useStyles();

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const [customers, setCustomers] = useState(props.customers);
const [customersBkp, setCustomersBkp] = useState([]);
  
useEffect(() => {

}, []);

useEffect(() => {
    const fetchCustomers2 = () => {
        let posts = [];
        let fechaInicio = firebase.firestore.Timestamp.fromDate(new Date(props.selectedDate));
        let fechaFin = firebase.firestore.Timestamp.fromDate(new Date(props.selectedDateFin));
        const refUsers = firebase.firestore().collection('orders')
        .where('date','>=',fechaInicio)
        .where('date','<=',fechaFin)
        .orderBy('date', 'desc')
        .get()
        .then(snapshot => {
          console.log("Aquiiiii");
          if (snapshot.empty) {
            console.log('No matching documents.');
            return;
          }
      
          snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
            posts.push(doc.data());
          });
          console.log(posts)
          setCustomers(posts);
          setCustomersBkp(posts);
          
        })
        .catch(err => {
          console.log('Error getting documents', err);
        });
      }
    
  //    fetchCustomers2();

}, []);

//console.log(new Date(props.selectedDate) +" | "+new Date(props.selectedDateFin));
console.log(firebase.firestore.Timestamp.fromDate(new Date(props.selectedDate)) +' | '+firebase.firestore.Timestamp.fromDate(new Date(props.selectedDateFin)));
console.log(props.customers);
        return (
            <ExcelFile element={<Button
              color="primary"
              fullWidth
              type="submit"
              variant="contained"
              style={{marginTop:"10px"}}
            >
              Export Orders
            </Button>}>
                <ExcelSheet data={props.customers} name="Orders">
                    <ExcelColumn label="Id" value="id"/>
                    <ExcelColumn label="User Name" value="userName"/>
                    <ExcelColumn label="Prowasher Name" value="washerName"/>
                    <ExcelColumn label="User Name" value="userName"/>
                    <ExcelColumn label="Venue ID" value="venueID"/>
                    <ExcelColumn label="Sucursal" value="sucursal"/>
                    <ExcelColumn label="User Name" value="userName"/>
                    <ExcelColumn label="Address" value="address"/>
                    <ExcelColumn label="Service Date" value={(col) => new String(moment(col.date.toDate()).format("DD/MM/YYYY"))}/>
                    <ExcelColumn label="Hour" value={(col) => new String(moment(col.serviceDate.toDate()).format("HH:mm"))}/>
                    <ExcelColumn label="Status" value={(col) => 
                        col.status==1 ? "Solicitado" :
                        col.status==2 ? "Asignado" :
                        col.status==3 ? "En camino" :
                        col.status==4 ? "Llegado":
                        col.status==5 ? "Lavando" :
                        col.status==6 ? "Lavado Finalizado" :
                        col.status==7 ? "Cerrado" :
                        col.status==-1 ? "Cancelado" : ""}/>
                    <ExcelColumn label="Total Price" value={(col) => new String(col.totalPrice)}/>
                    <ExcelColumn label="Pay Method" value={(col) => col.payMethod ? new String(col.payMethod) : "Creditos"}/>
                    <ExcelColumn label="Prowasher Commision" value={(col) => new String(col.washerAmount)}/>
                    {/* <ExcelColumn label="Code" value="code"/>
                    <ExcelColumn label="Address" value="address"/>
                    <ExcelColumn label="Amount" value="amount"/>
                    <ExcelColumn label="AvailabilityHourID" value="availabilityHourID"/>
                    <ExcelColumn label="AvailabilityID" value="availabilityID"/>
                    <ExcelColumn label="billingActivityCode" value="billingActivityCode"/>
                    <ExcelColumn label="billingAddress" value="billingAddress"/>
                    <ExcelColumn label="billingDNI" value="billingDNI"/>
                    <ExcelColumn label="billingEmail" value="billingEmail"/>
                    <ExcelColumn label="billingGyre" value="billingGyre"/>
                    <ExcelColumn label="billingPhone" value="billingPhone"/>
                    <ExcelColumn label="billingReason" value="billingReason"/>
                    <ExcelColumn label="billingRequired" value="billingRequired"/>
                    <ExcelColumn label="carBrand" value="carBrand"/>
                    <ExcelColumn label="carModel" value="carModel"/>
                    <ExcelColumn label="carPatent" value="carPatent"/>
                    <ExcelColumn label="comment" value="comment"/>
                    <ExcelColumn label="date" value={(col) => new String(col.date.toDate())}/>
                    <ExcelColumn label="discount" value="discount"/>
                    <ExcelColumn label="evaluationComment" value="evaluationComment"/>
                    <ExcelColumn label="evaluationRate" value="evaluationRate"/>
                    <ExcelColumn label="franchiseName" value="franchiseName"/>
                    <ExcelColumn label="indications" value="indications"/>
                    <ExcelColumn label="orderID" value="orderID"/>
                    <ExcelColumn label="serviceDate"  value={(col) => new String(col.serviceDate.toDate())}/>
                    <ExcelColumn label="totalprice" value="totalPrice"/>
                    <ExcelColumn label="totalTime" value="totalTime"/>
                    <ExcelColumn label="userEmail" value="userEmail"/>
                    <ExcelColumn label="userID" value="userID"/>
                    <ExcelColumn label="washerAmount" value="washerAmount"/>
                    <ExcelColumn label="washerAvatar" value="washerAvatar"/>
                    <ExcelColumn label="washerDraft" value="washerDraft"/>
                    <ExcelColumn label="washerEmail" value="washerEmail"/>
                    <ExcelColumn label="washerID" value="washerID"/>
                    <ExcelColumn label="washerName" value="washerName"/>
                    <ExcelColumn label="washerPhone" value="washerPhone"/> */}
                </ExcelSheet>
            </ExcelFile>
        );
}

export default ReportOrders;