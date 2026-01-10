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

  async generateWeatherBriefingPdf(data: {
    icaoCode: string;
    metar?: any;
    taf?: any;
    notams?: any[];
  }): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header
      doc.fontSize(20).font('Helvetica-Bold').text('WEATHER BRIEFING', { align: 'center' });
      doc.fontSize(14).text(data.icaoCode, { align: 'center' });
      doc.moveDown();

      // METAR
      if (data.metar) {
        doc.fontSize(12).font('Helvetica-Bold').text('METAR');
        doc.fontSize(10).font('Helvetica').text(data.metar.raw || 'No METAR available');
        doc.moveDown();

        if (data.metar.flightCategory) {
          doc.text(`Flight Category: ${data.metar.flightCategory}`);
        }
        if (data.metar.windDirection !== undefined) {
          doc.text(`Wind: ${data.metar.windDirection}° / ${data.metar.windSpeed} kt`);
        }
        if (data.metar.visibility !== undefined) {
          doc.text(`Visibility: ${data.metar.visibility} m`);
        }
        if (data.metar.temperature !== undefined) {
          doc.text(`Temperature: ${data.metar.temperature}°C / Dew Point: ${data.metar.dewPoint}°C`);
        }
        if (data.metar.qnh !== undefined) {
          doc.text(`QNH: ${data.metar.qnh} hPa`);
        }
        doc.moveDown();
      }

      // TAF
      if (data.taf) {
        doc.fontSize(12).font('Helvetica-Bold').text('TAF');
        doc.fontSize(10).font('Helvetica').text(data.taf.raw || 'No TAF available');
        doc.moveDown();
      }

      // NOTAMs
      if (data.notams && data.notams.length > 0) {
        doc.fontSize(12).font('Helvetica-Bold').text(`NOTAMs (${data.notams.length})`);
        doc.moveDown(0.5);

        data.notams.forEach((notam, index) => {
          doc.fontSize(10).font('Helvetica-Bold').text(`${index + 1}. ${notam.notamId || 'NOTAM'}`);
          doc.fontSize(9).font('Helvetica').text(notam.description || notam.raw || '');
          doc.text(`Valid: ${notam.effectiveFrom} - ${notam.effectiveTo}`);
          doc.moveDown(0.5);

          if (doc.y > 700) {
            doc.addPage();
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
