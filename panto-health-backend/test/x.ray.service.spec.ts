
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Logger } from '@nestjs/common';
import { XRayService } from '../src/modules/xRay/services/x.ray.service';
import { XRay, XRayDocument } from '../src/modules/xRay/schemas/x.ray.schema';
import { CreateXRayDto } from '../src/modules/xRay/dtos/create.x.ray.dto';
import { UpdateXRayDto } from '../src/modules/xRay/dtos/update.x.ray.dto';

// Mocks for the Mongoose Model and Document
const mockXRayModel = {
  constructor: jest.fn().mockImplementation(dto => ({
    ...dto,
    save: jest.fn().mockResolvedValue(dto),
  })),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  deleteOne: jest.fn(),
};

describe('XRayService', () => {
  let service: XRayService;
  let model: Model<XRayDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        XRayService,
        {
          provide: getModelToken(XRay.name),
          useValue: mockXRayModel,
        },
        // Mock the Logger to prevent console output during tests
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<XRayService>(XRayService);
    model = module.get<Model<XRayDocument>>(getModelToken(XRay.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processXRayData', () => {
    it('should save the x-ray data to the database on successful message processing', async () => {
      const mockData = {
        'device-123': {
          time: Date.now(),
          data: [{ value: 10 }, { value: 20 }],
        },
      };

      // Mock the save method for the document created by the service
      const mockSave = jest.fn().mockResolvedValue(true);
      jest.spyOn(model, 'constructor').mockImplementationOnce(dto => ({
        ...dto,
        save: mockSave,
      }));

      await service.processXRayData(mockData);
      expect(mockSave).toHaveBeenCalledTimes(1);
    });

    it('should log an error if the data format is invalid', async () => {
      const mockData = { 'device-123': null };
      const loggerSpy = jest.spyOn(service['logger'], 'error');

      await service.processXRayData(mockData);
      expect(loggerSpy).toHaveBeenCalledWith('Invalid data format received. Missing device data.');
    });

    it('should log an error if saving to the database fails', async () => {
      const mockData = {
        'device-123': {
          time: Date.now(),
          data: [{ value: 10 }],
        },
      };
      const loggerSpy = jest.spyOn(service['logger'], 'error');

      // Mock the save method to throw an error
      const mockSave = jest.fn().mockRejectedValue(new Error('DB error'));
      jest.spyOn(model, 'constructor').mockImplementationOnce(dto => ({
        ...dto,
        save: mockSave,
      }));

      await service.processXRayData(mockData);
      expect(loggerSpy).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should successfully create and save a new x-ray document', async () => {
      const createXRayDto = {
        deviceId: 'test-device',
        time: Date.now(),
        dataLength: 2,
        dataVolume: 100,
        raw_data: {
          time: Date.now(),
          data: [{ value: 10 }, { value: 20 }],
        },
      } as CreateXRayDto;

      const mockSave = jest.fn().mockResolvedValue(createXRayDto);
      jest.spyOn(model, 'constructor').mockImplementationOnce(dto => ({
        ...dto,
        save: mockSave,
      }));

      const result = await service.create(createXRayDto);
      expect(mockSave).toHaveBeenCalledTimes(1);
      expect(result).toEqual(createXRayDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of x-ray documents', async () => {
      const mockResult = [{ deviceId: 'test1' }, { deviceId: 'test2' }];
      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockResult),
      } as any);

      const result = await service.findAll();
      expect(model.find).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });
  });

  describe('findOne', () => {
    it('should return a single x-ray document', async () => {
      const mockId = '60c72b2f9b1d2f001c9c4d9a';
      const mockResult = { deviceId: 'test1' };
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockResult),
      } as any);

      const result = await service.findOne(mockId);
      expect(model.findById).toHaveBeenCalledWith(mockId);
      expect(result).toEqual(mockResult);
    });
  });

  describe('update', () => {
    it('should update an existing document and return the updated one', async () => {
      const mockId = '60c72b2f9b1d2f001c9c4d9a';
      const mockUpdateDto = { deviceId: 'updated-test-device' } as UpdateXRayDto;
      const mockUpdatedDoc = { _id: mockId, ...mockUpdateDto };

      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUpdatedDoc),
      } as any);
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUpdatedDoc as any);

      const result = await service.update(mockId, mockUpdateDto);
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(mockId, mockUpdateDto);
      expect(result).toEqual(mockUpdatedDoc);
    });
  });

  describe('delete', () => {
    it('should delete a document and return the deletion result', async () => {
      const mockId = '60c72b2f9b1d2f001c9c4d9a';
      const mockResult = { deletedCount: 1 };
      jest.spyOn(model, 'deleteOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockResult),
      } as any);

      const result = await service.delete(mockId);
      expect(model.deleteOne).toHaveBeenCalledWith({ _id: mockId });
      expect(result).toEqual(mockResult);
    });
  });

  describe('findFiltered', () => {
    it('should find documents by deviceId', async () => {
      const mockDeviceId = 'test-device-filter';
      const mockResult = [{ deviceId: mockDeviceId }];
      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockResult),
      } as any);

      const result = await service.findFiltered(mockDeviceId);
      expect(model.find).toHaveBeenCalledWith({ deviceId: mockDeviceId });
      expect(result).toEqual(mockResult);
    });

    it('should find documents by time range', async () => {
      const mockStartTime = 1672531200000;
      const mockEndTime = 1675209600000;
      const mockResult = [{ time: 1673856000000 }];
      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockResult),
      } as any);

      const result = await service.findFiltered(undefined, mockStartTime, mockEndTime);
      expect(model.find).toHaveBeenCalledWith({ time: { $gte: mockStartTime, $lte: mockEndTime } });
      expect(result).toEqual(mockResult);
    });

    it('should find documents by deviceId and time range', async () => {
      const mockDeviceId = 'test-device-filter';
      const mockStartTime = 1672531200000;
      const mockEndTime = 1675209600000;
      const mockResult = [{ deviceId: mockDeviceId, time: 1673856000000 }];
      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockResult),
      } as any);

      const result = await service.findFiltered(mockDeviceId, mockStartTime, mockEndTime);
      expect(model.find).toHaveBeenCalledWith({
        deviceId: mockDeviceId,
        time: { $gte: mockStartTime, $lte: mockEndTime },
      });
      expect(result).toEqual(mockResult);
    });
  });
});
