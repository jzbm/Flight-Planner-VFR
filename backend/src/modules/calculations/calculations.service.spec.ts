import { Test, TestingModule } from '@nestjs/testing';
import { CalculationsService } from './calculations.service';

describe('CalculationsService', () => {
  let service: CalculationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CalculationsService],
    }).compile();

    service = module.get<CalculationsService>(CalculationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateNavigation', () => {
    it('should calculate distance between two points', () => {
      const result = service.calculateNavigation({
        startLat: 52.1657,
        startLon: 20.9671,
        endLat: 50.0777,
        endLon: 19.7848,
        tas: 110,
      });

      expect(result.distance).toBeGreaterThan(0);
      expect(result.distance).toBeLessThan(200); // Warsaw to Krakow ~130 NM
    });

    it('should calculate correct true course', () => {
      const result = service.calculateNavigation({
        startLat: 52.0,
        startLon: 20.0,
        endLat: 52.0,
        endLon: 21.0,
        tas: 100,
      });

      // Flying east should give course ~90 degrees
      expect(result.trueCourse).toBeGreaterThan(80);
      expect(result.trueCourse).toBeLessThan(100);
    });

    it('should apply magnetic variation correctly', () => {
      const result = service.calculateNavigation({
        startLat: 52.0,
        startLon: 20.0,
        endLat: 53.0,
        endLon: 20.0,
        tas: 100,
        magneticVariation: 5,
      });

      // True course north (0) minus 5 east variation = 355 magnetic
      expect(result.magneticCourse).toBe(result.trueCourse - 5 + 360) % 360 || 
             expect(result.magneticCourse).toBeLessThan(result.trueCourse);
    });

    it('should calculate wind correction angle', () => {
      const result = service.calculateNavigation({
        startLat: 52.0,
        startLon: 20.0,
        endLat: 52.0,
        endLon: 21.0,
        tas: 100,
        windDirection: 180,
        windSpeed: 20,
      });

      // Crosswind from south should require WCA
      expect(result.windCorrectionAngle).not.toBe(0);
    });

    it('should calculate ground speed with headwind', () => {
      const resultNoWind = service.calculateNavigation({
        startLat: 52.0,
        startLon: 20.0,
        endLat: 52.0,
        endLon: 21.0,
        tas: 100,
      });

      const resultHeadwind = service.calculateNavigation({
        startLat: 52.0,
        startLon: 20.0,
        endLat: 52.0,
        endLon: 21.0,
        tas: 100,
        windDirection: 90,
        windSpeed: 20,
      });

      // Headwind should reduce ground speed
      expect(resultHeadwind.groundSpeed).toBeLessThan(resultNoWind.groundSpeed);
    });

    it('should calculate ETE correctly', () => {
      const result = service.calculateNavigation({
        startLat: 52.0,
        startLon: 20.0,
        endLat: 52.0,
        endLon: 21.0,
        tas: 120,
      });

      // ETE = distance / groundSpeed * 60
      const expectedEte = (result.distance / result.groundSpeed) * 60;
      expect(result.ete).toBeCloseTo(expectedEte, 0);
    });
  });

  describe('edge cases', () => {
    it('should handle zero wind', () => {
      const result = service.calculateNavigation({
        startLat: 52.0,
        startLon: 20.0,
        endLat: 53.0,
        endLon: 20.0,
        tas: 100,
        windDirection: 0,
        windSpeed: 0,
      });

      expect(result.windCorrectionAngle).toBe(0);
      expect(result.groundSpeed).toBe(100);
    });

    it('should handle same start and end point', () => {
      const result = service.calculateNavigation({
        startLat: 52.0,
        startLon: 20.0,
        endLat: 52.0,
        endLon: 20.0,
        tas: 100,
      });

      expect(result.distance).toBe(0);
    });
  });
});
