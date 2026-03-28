// PDF generation using @react-pdf/renderer
// This module is used in server components/routes only

import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

Font.register({
  family: "Helvetica",
  fonts: [],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    padding: 48,
    backgroundColor: "#ffffff",
    color: "#1e293b",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  logo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2563eb",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#0f172a",
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#1d4ed8",
    borderBottom: "1px solid #e2e8f0",
    paddingBottom: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  label: { color: "#64748b" },
  value: { color: "#0f172a", fontWeight: "bold" },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    padding: "6 8",
    borderRadius: 4,
    marginBottom: 4,
  },
  tableRow: {
    flexDirection: "row",
    padding: "5 8",
    borderBottom: "1px solid #f1f5f9",
  },
  col1: { flex: 3 },
  col2: { flex: 1, textAlign: "right" },
  col3: { flex: 1, textAlign: "right" },
  col4: { flex: 1, textAlign: "right" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
    paddingTop: 8,
    borderTop: "2px solid #2563eb",
  },
  totalLabel: { fontSize: 12, fontWeight: "bold", marginRight: 24 },
  totalValue: { fontSize: 12, fontWeight: "bold", color: "#2563eb" },
  footer: {
    position: "absolute",
    bottom: 32,
    left: 48,
    right: 48,
    fontSize: 8,
    color: "#94a3b8",
    borderTop: "1px solid #e2e8f0",
    paddingTop: 8,
  },
});

interface InvoiceData {
  number: string;
  date: string;
  dueDate?: string;
  company: {
    name: string;
    address: string;
    city: string;
    email: string;
    phone: string;
    taxId?: string;
  };
  customer: {
    name: string;
    address?: string;
    email: string;
  };
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
}

function InvoiceDocument({ data }: { data: InvoiceData }) {
  return React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: "A4", style: styles.page },
      // Header
      React.createElement(
        View,
        { style: styles.header },
        React.createElement(
          View,
          null,
          React.createElement(Text, { style: styles.logo }, "Handy & PC Service"),
          React.createElement(Text, { style: { fontSize: 9, color: "#64748b", marginTop: 4 } }, data.company.address),
          React.createElement(Text, { style: { fontSize: 9, color: "#64748b" } }, data.company.city),
          React.createElement(Text, { style: { fontSize: 9, color: "#64748b" } }, data.company.email),
          React.createElement(Text, { style: { fontSize: 9, color: "#64748b" } }, data.company.phone)
        ),
        React.createElement(
          View,
          { style: { alignItems: "flex-end" } },
          React.createElement(Text, { style: styles.title }, "RECHNUNG"),
          React.createElement(Text, { style: { fontSize: 9, color: "#64748b" } }, `Nr: ${data.number}`),
          React.createElement(Text, { style: { fontSize: 9, color: "#64748b" } }, `Datum: ${data.date}`),
          data.dueDate && React.createElement(Text, { style: { fontSize: 9, color: "#64748b" } }, `Fällig: ${data.dueDate}`)
        )
      ),
      // Customer
      React.createElement(
        View,
        { style: { marginBottom: 24 } },
        React.createElement(Text, { style: styles.sectionTitle }, "Rechnungsempfänger"),
        React.createElement(Text, null, data.customer.name),
        data.customer.address && React.createElement(Text, { style: { color: "#64748b" } }, data.customer.address),
        React.createElement(Text, { style: { color: "#64748b" } }, data.customer.email)
      ),
      // Table header
      React.createElement(
        View,
        { style: styles.tableHeader },
        React.createElement(Text, { style: styles.col1 }, "Beschreibung"),
        React.createElement(Text, { style: styles.col2 }, "Menge"),
        React.createElement(Text, { style: styles.col3 }, "Einzelpreis"),
        React.createElement(Text, { style: styles.col4 }, "Gesamt")
      ),
      // Table rows
      ...data.items.map((item, i) =>
        React.createElement(
          View,
          { key: i, style: styles.tableRow },
          React.createElement(Text, { style: styles.col1 }, item.description),
          React.createElement(Text, { style: styles.col2 }, String(item.quantity)),
          React.createElement(Text, { style: styles.col3 }, `${item.unitPrice.toFixed(2)} €`),
          React.createElement(Text, { style: styles.col4 }, `${item.total.toFixed(2)} €`)
        )
      ),
      // Totals
      React.createElement(
        View,
        { style: { marginTop: 16 } },
        React.createElement(
          View,
          { style: { flexDirection: "row", justifyContent: "flex-end", marginBottom: 4 } },
          React.createElement(Text, { style: { color: "#64748b", marginRight: 24 } }, "Nettobetrag:"),
          React.createElement(Text, null, `${data.subtotal.toFixed(2)} €`)
        ),
        React.createElement(
          View,
          { style: { flexDirection: "row", justifyContent: "flex-end", marginBottom: 4 } },
          React.createElement(Text, { style: { color: "#64748b", marginRight: 24 } }, "MwSt. (19%):"),
          React.createElement(Text, null, `${data.tax.toFixed(2)} €`)
        ),
        React.createElement(
          View,
          { style: styles.totalRow },
          React.createElement(Text, { style: styles.totalLabel }, "Gesamtbetrag:"),
          React.createElement(Text, { style: styles.totalValue }, `${data.total.toFixed(2)} €`)
        )
      ),
      // Notes
      data.notes &&
        React.createElement(
          View,
          { style: { marginTop: 24 } },
          React.createElement(Text, { style: styles.sectionTitle }, "Hinweise"),
          React.createElement(Text, { style: { color: "#64748b" } }, data.notes)
        ),
      // Footer
      React.createElement(
        View,
        { style: styles.footer },
        React.createElement(
          Text,
          null,
          `${data.company.name} · ${data.company.address} · ${data.company.city}` +
          (data.company.taxId ? ` · USt-ID: ${data.company.taxId}` : "")
        )
      )
    )
  );
}

export async function generateInvoicePDF(data: InvoiceData): Promise<Buffer> {
  const doc = React.createElement(InvoiceDocument, { data });
  return renderToBuffer(doc as React.ReactElement);
}

export const COMPANY_INFO = {
  name:    "Handy & PC Service",
  address: "Grömitzer Straße 4",
  city:    "23730 Schashagen",
  email:   "info@handyundpcservice.de",
  phone:   "017668917854",
  taxId:   "DE123456789",
};
