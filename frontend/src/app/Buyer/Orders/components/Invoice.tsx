"use client";

import { useState } from "react";
import { FileText, Download } from "lucide-react";
import toast from "react-hot-toast";

// Types
interface OrderItem {
  id: string;
  quantity: number;
  priceAtPurchase: number;
  product?: {
    id: string;
    productName: string;
    category: string;
    shortDescription?: string;
    skuCode?: string;
    artist?: {
      id: string;
      fullName?: string;
      storeName?: string;
      email?: string;
    };
  };
}

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod?: string;
  placedAt: string;
  shippingAddress?: any;
  orderItems?: OrderItem[];
  buyer?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
}

interface InvoiceComponentProps {
  order: Order;
}

const InvoiceComponent = ({ order }: InvoiceComponentProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const formatAddress = (shippingAddress: any): string[] => {
    if (!shippingAddress) return ["Address not available"];

    if (typeof shippingAddress === "string") return [shippingAddress];

    if (typeof shippingAddress === "object") {
      const lines = [];

      if (shippingAddress.firstName || shippingAddress.lastName) {
        lines.push(
          `${shippingAddress.firstName || ""} ${
            shippingAddress.lastName || ""
          }`.trim()
        );
      }
      if (shippingAddress.company) lines.push(shippingAddress.company);
      if (shippingAddress.street) lines.push(shippingAddress.street);
      if (shippingAddress.apartment) lines.push(shippingAddress.apartment);

      const cityStateZip = [
        shippingAddress.city,
        shippingAddress.state,
        shippingAddress.postalCode,
      ]
        .filter(Boolean)
        .join(", ");
      if (cityStateZip) lines.push(cityStateZip);

      if (shippingAddress.country) lines.push(shippingAddress.country);
      if (shippingAddress.phone) lines.push(`Phone: ${shippingAddress.phone}`);

      return lines.length > 0 ? lines : ["Address not available"];
    }

    return ["Address not available"];
  };

  const generatePDF = async () => {
    setIsGenerating(true);

    try {
      const jsPDF = (await import("jspdf")).default;

      // A4 dimensions: 210mm x 297mm
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      // A4 page margins and layout constants
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 15;
      const contentWidth = pageWidth - margin * 2;

      // Set font
      doc.setFont("helvetica");

      // HEADER SECTION (0-40mm)
      doc.setFillColor(230, 126, 34);
      doc.rect(0, 0, pageWidth, 35, "F");

      // Company name
      doc.setFontSize(22);
      doc.setTextColor(255, 255, 255);
      doc.text("AadivaaEarth", margin, 20);

      // Company tagline
      doc.setFontSize(10);
      doc.text("Handcrafted Artisan Products", margin, 27);

      // Invoice title (right side)
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("TAX INVOICE", pageWidth - margin, 18, { align: "right" });

      // Invoice details (right side)
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Invoice #: INV-${order.id.slice(-8).toUpperCase()}`,
        pageWidth - margin,
        25,
        { align: "right" }
      );
      doc.text(
        `Date: ${new Date(order.placedAt).toLocaleDateString("en-IN")}`,
        pageWidth - margin,
        30,
        { align: "right" }
      );

      // Reset text color for body
      doc.setTextColor(0, 0, 0);

      // ORDER DETAILS SECTION (40-70mm)
      let currentY = 45;

      // Order details box
      doc.setFillColor(248, 248, 248);
      doc.rect(margin, currentY, contentWidth, 20, "F");
      doc.setDrawColor(220, 220, 220);
      doc.rect(margin, currentY, contentWidth, 20, "S");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("Order Information", margin + 5, currentY + 8);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      // Left column
      doc.text(`Order ID: ${order.id}`, margin + 5, currentY + 14);
      doc.text(
        `Order Date: ${new Date(order.placedAt).toLocaleDateString("en-IN")}`,
        margin + 5,
        currentY + 18
      );

      // Right column
      const midPoint = margin + contentWidth / 2;
      doc.text(
        `Status: ${order.status.toUpperCase()}`,
        midPoint,
        currentY + 14
      );
      doc.text(
        `Payment: ${order.paymentStatus.toUpperCase()}`,
        midPoint,
        currentY + 18
      );

      // ADDRESSES SECTION (75-125mm)
      currentY = 75;
      const addressBoxHeight = 45;
      const addressBoxWidth = (contentWidth - 10) / 2;

      // Billing Address Box
      doc.setFillColor(252, 252, 252);
      doc.rect(margin, currentY, addressBoxWidth, addressBoxHeight, "F");
      doc.setDrawColor(220, 220, 220);
      doc.rect(margin, currentY, addressBoxWidth, addressBoxHeight, "S");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("Billing Address", margin + 5, currentY + 8);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      const customerName =
        order.buyer?.firstName && order.buyer?.lastName
          ? `${order.buyer.firstName} ${order.buyer.lastName}`
          : "Customer";

      let yPos = currentY + 16;
      doc.text(customerName, margin + 5, yPos);
      yPos += 6;
      if (order.buyer?.email) {
        doc.text(order.buyer.email, margin + 5, yPos);
        yPos += 6;
      }
      if (order.buyer?.phone) {
        doc.text(`Phone: ${order.buyer.phone}`, margin + 5, yPos);
      }

      // Shipping Address Box
      const shippingBoxX = margin + addressBoxWidth + 10;
      doc.setFillColor(252, 252, 252);
      doc.rect(shippingBoxX, currentY, addressBoxWidth, addressBoxHeight, "F");
      doc.setDrawColor(220, 220, 220);
      doc.rect(shippingBoxX, currentY, addressBoxWidth, addressBoxHeight, "S");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("Shipping Address", shippingBoxX + 5, currentY + 8);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      const shippingLines = formatAddress(order.shippingAddress);
      yPos = currentY + 16;
      shippingLines.slice(0, 5).forEach((line) => {
        if (line.trim() && yPos < currentY + addressBoxHeight - 5) {
          const wrappedLines = doc.splitTextToSize(line, addressBoxWidth - 10);
          wrappedLines.forEach((wrappedLine: string) => {
            if (yPos < currentY + addressBoxHeight - 5) {
              doc.text(wrappedLine, shippingBoxX + 5, yPos);
              yPos += 5;
            }
          });
        }
      });

      // ITEMS TABLE SECTION (130mm onwards)
      currentY = 130;

      // Table header
      const tableHeaderHeight = 10;
      doc.setFillColor(44, 62, 80);
      doc.rect(margin, currentY, contentWidth, tableHeaderHeight, "F");

      // Column positions (precise alignment)
      const col1X = margin + 3; // Item Description
      const col2X = margin + 85; // SKU
      const col3X = margin + 110; // Qty
      const col4X = margin + 135; // Unit Price
      const col5X = margin + 165; // Amount

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);

      doc.text("Item Description", col1X, currentY + 7);
      doc.text("SKU", col2X, currentY + 7);
      doc.text("Qty", col3X, currentY + 7, { align: "center" });
      doc.text("Unit Price", col4X, currentY + 7, { align: "right" });
      doc.text("Amount", col5X, currentY + 7, { align: "right" });

      // Reset for table content
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      currentY += tableHeaderHeight;

      // Table rows
      const rowHeight = 12;
      order.orderItems?.forEach((item, index) => {
        // Alternate row background
        if (index % 2 === 0) {
          doc.setFillColor(248, 248, 248);
          doc.rect(margin, currentY, contentWidth, rowHeight, "F");
        }

        const itemName = item.product?.productName || "Unknown Product";
        const sku = item.product?.skuCode || "-";
        const qty = item.quantity;
        const unitPrice = item.priceAtPurchase;
        const totalPrice = item.quantity * item.priceAtPurchase;

        doc.setFontSize(9);

        // Item name (truncate if too long)
        const maxItemNameWidth = 75;
        const wrappedItemName = doc.splitTextToSize(itemName, maxItemNameWidth);
        doc.text(wrappedItemName[0], col1X, currentY + 7);

        // SKU
        doc.text(sku, col2X, currentY + 7);

        // Quantity (center aligned)
        doc.text(qty.toString(), col3X, currentY + 7, { align: "center" });

        // Unit Price (right aligned)
        doc.text(
          `₹${unitPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
          col4X,
          currentY + 7,
          { align: "right" }
        );

        // Total Amount (right aligned)
        doc.text(
          `₹${totalPrice.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
          })}`,
          col5X,
          currentY + 7,
          { align: "right" }
        );

        // Category/Artist info
        if (item.product?.category || item.product?.artist?.storeName) {
          doc.setFontSize(7);
          doc.setTextColor(128, 128, 128);
          const additionalInfo = [
            item.product?.category,
            item.product?.artist?.storeName &&
              `by ${item.product.artist.storeName}`,
          ]
            .filter(Boolean)
            .join(" • ");
          doc.text(additionalInfo, col1X, currentY + 10);
          doc.setTextColor(0, 0, 0);
        }

        currentY += rowHeight;
      });

      // Table border
      doc.setDrawColor(220, 220, 220);
      doc.rect(margin, 130, contentWidth, currentY - 130, "S");

      // Replace the summary section of your PDF generation code with the below

      // IMPROVED SUMMARY SECTION
      currentY += 15;
      const summaryBoxWidth = 80;
      const summaryBoxX = pageWidth - margin - summaryBoxWidth;
      const summaryBoxHeight = 55;

      // Summary box background
      doc.setFillColor(248, 248, 248);
      doc.rect(summaryBoxX, currentY, summaryBoxWidth, summaryBoxHeight, "F");
      doc.setDrawColor(220, 220, 220);
      doc.rect(summaryBoxX, currentY, summaryBoxWidth, summaryBoxHeight, "S");

      // Summary content with improved alignment
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      let summaryY = currentY + 12;

      // Calculate totals
      const subtotal = order.totalAmount;
      const tax = 0; // Add tax calculation if needed
      const shipping = 0; // Add shipping if needed
      const discount = 0; // Add discount if needed

      // Label and value positioning with more margin from edges
      const labelX = summaryBoxX + 8;
      const valueX = summaryBoxX + summaryBoxWidth - 8;
      const lineSpacing = 7;

      // Subtotal
      doc.text("Subtotal:", labelX, summaryY);
      doc.text(`₹${subtotal.toLocaleString("en-IN")}`, valueX, summaryY, {
        align: "right",
      });

      // Tax (if applicable)
      if (tax > 0) {
        summaryY += lineSpacing;
        doc.text("Tax:", labelX, summaryY);
        doc.text(
          `₹${tax.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
          valueX,
          summaryY,
          { align: "right" }
        );
      }

      // Shipping (if applicable)
      if (shipping > 0) {
        summaryY += lineSpacing;
        doc.text("Shipping:", labelX, summaryY);
        doc.text(
          `₹${shipping.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
          valueX,
          summaryY,
          { align: "right" }
        );
      }

      // Discount (if applicable)
      if (discount > 0) {
        summaryY += lineSpacing;
        doc.text("Discount:", labelX, summaryY);
        doc.text(
          `-₹${discount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
          valueX,
          summaryY,
          { align: "right" }
        );
      }

      // Separator line before total
      summaryY += lineSpacing + 2;
      doc.setLineWidth(0.5);
      doc.setDrawColor(180, 180, 180);
      doc.line(labelX, summaryY, valueX, summaryY);

      // Total with enhanced styling but contained within box
      summaryY += 8;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5); // Slightly smaller for containment

      // Total background highlight (smaller and within bounds)
      const totalBgX = summaryBoxX + 2;
      const totalBgWidth = summaryBoxWidth - 4;
      const totalBgY = summaryY - 4;
      const totalBgHeight = 10;

      doc.setFillColor(230, 126, 34);
      doc.rect(totalBgX, totalBgY, totalBgWidth, totalBgHeight, "F");

      // Total text in white
      doc.setTextColor(255, 255, 255);
      doc.text("Total:", labelX, summaryY + 1);
      doc.text(
        `₹${order.totalAmount.toLocaleString("en-IN")}`,
        valueX,
        summaryY + 1,
        { align: "right" }
      );

      // Reset text color
      doc.setTextColor(0, 0, 0);

      // PAYMENT INFORMATION SECTION
      currentY += 65;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      // Payment info box
      doc.setFillColor(252, 252, 252);
      doc.rect(margin, currentY, contentWidth, 15, "F");
      doc.setDrawColor(220, 220, 220);
      doc.rect(margin, currentY, contentWidth, 15, "S");

      doc.setFont("helvetica", "bold");
      doc.text("Payment Information", margin + 5, currentY + 6);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(
        `Payment Method: ${order.paymentMethod || "Not specified"}`,
        margin + 5,
        currentY + 11
      );
      doc.text(
        `Payment Status: ${order.paymentStatus.toUpperCase()}`,
        midPoint,
        currentY + 11
      );

      // FOOTER SECTION
      const footerY = pageHeight - 30;
      doc.setFillColor(230, 126, 34);
      doc.rect(0, footerY, pageWidth, 30, "F");

      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text(
        "Thank you for shopping with AadivaaEarth!",
        margin,
        footerY + 10
      );
      doc.text(
        "For support, contact us at support@aadivaa.shop",
        margin,
        footerY + 16
      );
      doc.text("GST No: 34723497234939847", margin, footerY + 22);

      // Footer right side
      doc.text("www.aadivaa.shop", pageWidth - margin, footerY + 10, {
        align: "right",
      });
      doc.text("1800-483-0808", pageWidth - margin, footerY + 16, {
        align: "right",
      });

      // Generate filename
      const filename = `AadivaaEarth_Invoice_${order.id
        .slice(-8)
        .toUpperCase()}.pdf`;

      // Save the PDF
      doc.save(filename);

      toast.success("Invoice generated successfully!", {
        duration: 2000,
        icon: "📄",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate invoice. Please try again.", {
        duration: 3000,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={generatePDF}
      disabled={isGenerating}
      className="w-full flex items-center justify-center px-4 py-3 border border-terracotta-300 text-terracotta-700 hover:bg-terracotta-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mb-4 shadow-sm"
    >
      {isGenerating ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-terracotta-600 mr-2"></div>
          Generating Invoice...
        </>
      ) : (
        <>
          <FileText className="w-4 h-4 mr-2" />
          Download Invoice
        </>
      )}
    </button>
  );
};

export default InvoiceComponent;
1;
