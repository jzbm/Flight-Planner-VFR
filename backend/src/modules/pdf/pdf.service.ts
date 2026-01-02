import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';

interface FlightPlanData {
  name: string;
  date: Date;
  aircraft?: { registration: string; type: string };
  departureAirport?: { icaoCode: string; name: string };
  arrivalAirport?: { icaoCode: string; name: string };
  waypoints?: any[];
  legs?: any[];
  totalDistance?: number;
  estimatedTime?: number;
  fuelRequired?: number;
}

@Injectable()
export class PdfService {
  async generateFlightPlanPdf(flightPlan: FlightPlanData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header
      doc.fontSize(20).font('Helvetica-Bold').text('VFR FLIGHT PLAN', { align: 'center' });
      doc.moveDown();

      // Flight info box
      doc.fontSize(12).font('Helvetica-Bold').text('Flight Information');
      doc.fontSize(10).font('Helvetica');
      doc.text(`Plan Name: ${flightPlan.name}`);
      doc.text(`Date: ${new Date(flightPlan.date).toLocaleDateString()}`);
      if (flightPlan.aircraft) {
        doc.text(`Aircraft: ${flightPlan.aircraft.registration} (${flightPlan.aircraft.type})`);
      }
      doc.moveDown();

      // Route
      doc.fontSize(12).font('Helvetica-Bold').text('Route');
      doc.fontSize(10).font('Helvetica');
      const departure = flightPlan.departureAirport;
      const arrival = flightPlan.arrivalAirport;
      if (departure && arrival) {
        doc.text(`${departure.icaoCode} (${departure.name}) -> ${arrival.icaoCode} (${arrival.name})`);
      }
      doc.moveDown();

      // Summary
      doc.fontSize(12).font('Helvetica-Bold').text('Summary');
      doc.fontSize(10).font('Helvetica');
      doc.text(`Total Distance: ${flightPlan.totalDistance?.toFixed(1) || 'N/A'} NM`);
      doc.text(`Estimated Time: ${flightPlan.estimatedTime || 'N/A'} min`);
      doc.text(`Fuel Required: ${flightPlan.fuelRequired?.toFixed(1) || 'N/A'} L`);
      doc.moveDown();

      // Navigation log table
      if (flightPlan.legs && flightPlan.legs.length > 0) {
        doc.fontSize(12).font('Helvetica-Bold').text('Navigation Log');
        doc.moveDown(0.5);

        // Table header
        const tableTop = doc.y;
        const colWidths = [60, 60, 50, 50, 50, 50, 50, 50];
        const headers = ['From', 'To', 'TC', 'TH', 'Dist', 'GS', 'ETE', 'Fuel'];

        doc.fontSize(8).font('Helvetica-Bold');
        let xPos = 50;
        headers.forEach((header, i) => {
          doc.text(header, xPos, tableTop, { width: colWidths[i], align: 'center' });
          xPos += colWidths[i];
        });

        // Table rows
        doc.font('Helvetica');
        let yPos = tableTop + 15;
        flightPlan.legs.forEach((leg) => {
          xPos = 50;
          const rowData = [
            leg.fromWaypoint || '-',
            leg.toWaypoint || '-',
            `${leg.trueCourse || '-'}`,
            `${leg.trueHeading || '-'}`,
            `${leg.distance?.toFixed(1) || '-'}`,
            `${leg.groundSpeed || '-'}`,
            `${leg.ete || '-'}`,
            `${leg.fuelRequired?.toFixed(1) || '-'}`,
          ];

          rowData.forEach((data, i) => {
            doc.text(data, xPos, yPos, { width: colWidths[i], align: 'center' });
            xPos += colWidths[i];
          });
          yPos += 12;

          if (yPos > 700) {
            doc.addPage();
            yPos = 50;
          }
        });
      }

      // Footer
      doc.fontSize(8).text(
        `Generated: ${new Date().toISOString()}`,
        50,
        doc.page.height - 50,
        { align: 'center' },
      );

      doc.end();
    });
  }
}
