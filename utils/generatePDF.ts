import PDFDocument from "pdfkit";
import { Response } from "express";
import { IOrder } from "../interfaces/order";
import path from "path";

export const generatePDF = (res: Response, order: IOrder) => {
  const doc = new PDFDocument();

  doc.font(path.join(__dirname, "../fonts/Roboto-VariableFont_wdth,wght.ttf"));

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename=${order.id}.pdf`);

  doc.pipe(res);

  doc.fontSize(20).text("CHECK", { align: "center" });
  doc.moveDown();

  doc.fontSize(12);
  doc.text(`Order ID: ${order.id}`);
  doc.text(`Date: ${order.createdAt.toLocaleDateString()}`);
  doc.text(`Status: ${order.status}`);
  doc.moveDown();

  doc.text("CUSTOMER");
  doc.text(`${order.shippingFirstName} ${order.shippingLastName}`);
  doc.text(`${order.shippingEmail}`);
  doc.text(`${order.shippingPhone}`);
  doc.moveDown();

  doc.text("Shipping address:");
  doc.text(
    `${order.shippingStreet}, ${order.shippingCity}, ${order.shippingCountry}, ${order.shippingPostcode}`,
  );
  doc.moveDown();

  doc.text("ITEMS:", { underline: true });
  doc.moveDown(0.5);
  order.items.forEach((item) => {
    doc.text(`${item.productTitle} - ${item.quantity} x $${item.price}`);
  });
  doc.moveDown();

  doc.fontSize(14).text(`Total: $${order.totalPrice}`, { align: "right" });

  doc.end();
};
