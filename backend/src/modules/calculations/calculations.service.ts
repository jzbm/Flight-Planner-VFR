import { Injectable } from '@nestjs/common';
import { NavigationCalculationDto, NavigationResultDto } from './dto/navigation.dto';

@Injectable()
export class CalculationsService {
  private readonly EARTH_RADIUS_NM = 3440.065; // Earth radius in nautical miles

  calculateNavigation(input: NavigationCalculationDto): NavigationResultDto {
    const { startLat, startLon, endLat, endLon, tas, windDirection, windSpeed, magneticVariation } = input;

    // Convert to radians
    const lat1 = this.toRadians(startLat);
    const lon1 = this.toRadians(startLon);
    const lat2 = this.toRadians(endLat);
    const lon2 = this.toRadians(endLon);

    // Calculate distance using Haversine formula
    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = this.EARTH_RADIUS_NM * c;

    // Calculate true course
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    let trueCourse = this.toDegrees(Math.atan2(y, x));
    trueCourse = (trueCourse + 360) % 360;

    // Calculate wind correction
    const { trueHeading, groundSpeed, wca } = this.calculateWindCorrection(
      trueCourse,
      tas,
      windDirection || 0,
      windSpeed || 0,
    );

    // Apply magnetic variation
    const magVar = magneticVariation || 0;
    const magneticCourse = (trueCourse - magVar + 360) % 360;
    const magneticHeading = (trueHeading - magVar + 360) % 360;

    // Calculate ETE in minutes
    const ete = groundSpeed > 0 ? (distance / groundSpeed) * 60 : 0;

    return {
      distance: Math.round(distance * 10) / 10,
      trueCourse: Math.round(trueCourse),
      magneticCourse: Math.round(magneticCourse),
      trueHeading: Math.round(trueHeading),
      magneticHeading: Math.round(magneticHeading),
      groundSpeed: Math.round(groundSpeed),
      windCorrectionAngle: Math.round(wca),
      ete: Math.round(ete),
    };
  }

  private calculateWindCorrection(
    trueCourse: number,
    tas: number,
    windDirection: number,
    windSpeed: number,
  ): { trueHeading: number; groundSpeed: number; wca: number } {
    if (windSpeed === 0) {
      return { trueHeading: trueCourse, groundSpeed: tas, wca: 0 };
    }

    // Wind triangle calculation
    const courseRad = this.toRadians(trueCourse);
    const windRad = this.toRadians(windDirection);

    // Calculate wind correction angle (WCA)
    const swc = (windSpeed / tas) * Math.sin(windRad - courseRad);
    const wca = this.toDegrees(Math.asin(Math.max(-1, Math.min(1, swc))));

    // True heading
    const trueHeading = (trueCourse + wca + 360) % 360;

    // Ground speed
    const headingRad = this.toRadians(trueHeading);
    const groundSpeed =
      tas * Math.cos(this.toRadians(wca)) +
      windSpeed * Math.cos(windRad - courseRad);

    return {
      trueHeading,
      groundSpeed: Math.max(0, groundSpeed),
      wca,
    };
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private toDegrees(radians: number): number {
    return radians * (180 / Math.PI);
  }
}
