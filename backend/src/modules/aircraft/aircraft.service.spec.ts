import { Test, TestingModule } from '@nestjs/testing';
import { AircraftService } from './aircraft.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('AircraftService', () => {
  let service: AircraftService;
  let prisma: PrismaService;

  const mockPrismaService = {
    aircraft: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockUserId = 'user-123';
  const mockAircraft = {
    id: 'aircraft-123',
    userId: mockUserId,
    registration: 'SP-ABC',
    type: 'Cessna 172',
    emptyWeight: 750,
    emptyWeightArm: 1000,
    maxTakeoffWeight: 1111,
    fuelCapacity: 200,
    cruiseSpeed: 110,
    fuelConsumption: 32,
    cgEnvelope: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AircraftService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AircraftService>(AircraftService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an aircraft', async () => {
      const createDto = {
        registration: 'SP-ABC',
        type: 'Cessna 172',
        emptyWeight: 750,
        emptyWeightArm: 1000,
        maxTakeoffWeight: 1111,
        fuelCapacity: 200,
        cruiseSpeed: 110,
        fuelConsumption: 32,
      };

      mockPrismaService.aircraft.create.mockResolvedValue(mockAircraft);

      const result = await service.create(mockUserId, createDto);

      expect(mockPrismaService.aircraft.create).toHaveBeenCalledWith({
        data: { ...createDto, userId: mockUserId },
      });
      expect(result).toEqual(mockAircraft);
    });
  });

  describe('findAll', () => {
    it('should return all aircraft for user', async () => {
      mockPrismaService.aircraft.findMany.mockResolvedValue([mockAircraft]);

      const result = await service.findAll(mockUserId);

      expect(mockPrismaService.aircraft.findMany).toHaveBeenCalledWith({
        where: { userId: mockUserId },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual([mockAircraft]);
    });
  });

  describe('findOne', () => {
    it('should return aircraft by id', async () => {
      mockPrismaService.aircraft.findFirst.mockResolvedValue(mockAircraft);

      const result = await service.findOne('aircraft-123', mockUserId);

      expect(result).toEqual(mockAircraft);
    });

    it('should throw NotFoundException if aircraft not found', async () => {
      mockPrismaService.aircraft.findFirst.mockResolvedValue(null);

      await expect(service.findOne('invalid-id', mockUserId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update aircraft', async () => {
      const updateDto = { registration: 'SP-XYZ' };
      const updatedAircraft = { ...mockAircraft, ...updateDto };

      mockPrismaService.aircraft.findFirst.mockResolvedValue(mockAircraft);
      mockPrismaService.aircraft.update.mockResolvedValue(updatedAircraft);

      const result = await service.update('aircraft-123', mockUserId, updateDto);

      expect(mockPrismaService.aircraft.update).toHaveBeenCalledWith({
        where: { id: 'aircraft-123' },
        data: updateDto,
      });
      expect(result.registration).toBe('SP-XYZ');
    });
  });

  describe('remove', () => {
    it('should delete aircraft', async () => {
      mockPrismaService.aircraft.findFirst.mockResolvedValue(mockAircraft);
      mockPrismaService.aircraft.delete.mockResolvedValue(mockAircraft);

      const result = await service.remove('aircraft-123', mockUserId);

      expect(mockPrismaService.aircraft.delete).toHaveBeenCalledWith({
        where: { id: 'aircraft-123' },
      });
      expect(result).toEqual(mockAircraft);
    });
  });

  describe('calculateWeightBalance', () => {
    it('should calculate weight and balance', async () => {
      mockPrismaService.aircraft.findFirst.mockResolvedValue(mockAircraft);

      const input = {
        pilotWeight: 80,
        coPilotWeight: 75,
        fuelWeight: 100,
      };

      const result = await service.calculateWeightBalance('aircraft-123', mockUserId, input);

      expect(result.totalWeight).toBeGreaterThan(mockAircraft.emptyWeight);
      expect(result.maxTakeoffWeight).toBe(mockAircraft.maxTakeoffWeight);
      expect(result).toHaveProperty('centerOfGravity');
      expect(result).toHaveProperty('isWithinWeightLimits');
      expect(result).toHaveProperty('isWithinCGEnvelope');
    });
  });
});
