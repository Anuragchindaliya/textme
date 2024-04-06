import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer, Image } from '@react-pdf/renderer';
import { InvoiceSchemaType } from './page';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 50,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  table: {
    display: 'flex',
    width: 'auto',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    borderBottomWidth: 1,
    borderColor: '#bfbfbf',
    padding: 8,
    width:200
  },
  totalRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#bfbfbf',
    marginTop: 10,
  },
  totalLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
  },
  totalValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right',
  },
});
type InvoiceDataType = {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  customer: {
      name: string;
      address: string;
  };
  items: {
      description: string;
      quantity: number;
      price: number;
  }[];
  logo: string;
}

// Create the Invoice component
const PdfDcoument = ({invoiceData}:{invoiceData:InvoiceSchemaType}) => (
  <PDFViewer width={300} height={500}>
    <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Image style={styles.logo} src={invoiceData.logo} />
        <Text style={styles.headerText}>Invoice</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Invoice Details</Text>
        <Text>Invoice Number: {invoiceData.invoiceNumber}</Text>
        <Text>Date: {invoiceData.date.toDateString()}</Text>
        <Text>Due Date: {invoiceData.dueDate.toDateString()}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customer Details</Text>
        <Text>Name: {invoiceData.custName}</Text>
        <Text>Address: {invoiceData.custAddress}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Items</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Description</Text>
            <Text style={styles.tableCell}>Quantity</Text>
            <Text style={styles.tableCell}>Price</Text>
            <Text style={styles.tableCell}>Total</Text>
          </View>
          {invoiceData.items.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.tableCell} >{item.description}</Text>
              <Text style={styles.tableCell} >{item.quantity}</Text>
              <Text style={styles.tableCell} >{item.price}</Text>
              <Text style={styles.tableCell} >{item.quantity * item.price}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>
          {invoiceData.items.reduce((total, item) => total + item.quantity * item.price, 0)}
        </Text>
      </View>
    </Page>
  </Document>
  </PDFViewer>
);

export default PdfDcoument;
