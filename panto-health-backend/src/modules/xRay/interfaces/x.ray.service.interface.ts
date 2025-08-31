import { Payload } from '@nestjs/microservices';
import { XRay } from '../schemas/x.ray.schema';

export interface IXRayService {
  /**
   * Processes incoming x-ray data from a message queue.
   * @param data The payload received from the message queue.
   */
  processXRayData(data: Record<string, any>): Promise<void>;

  /**
   * Creates a new X-ray document.
   * @param createXRayDto The DTO containing the data for the new document.
   */
  create(createXRayDto: any): Promise<XRay>;

  /**
   * Finds all X-ray documents.
   */
  findAll(): Promise<XRay[]>;

  /**
   * Finds a single X-ray document by its ID.
   * @param id The ID of the document to find.
   */
  findOne(id: string): Promise<XRay>;

  /**
   * Updates an existing X-ray document.
   * @param id The ID of the document to update.
   * @param updateXRayDto The DTO with the fields to update.
   */
  update(id: string, updateXRayDto: any): Promise<XRay>;

  /**
   * Deletes an X-ray document by its ID.
   * @param id The ID of the document to delete.
   */
  delete(id: string): Promise<any>;

  /**
   * Finds X-ray documents based on optional filtering criteria.
   * @param deviceId Optional device ID to filter by.
   * @param startTime Optional start timestamp to filter by.
   * @param endTime Optional end timestamp to filter by.
   */
  findFiltered(deviceId?: string, startTime?: number, endTime?: number): Promise<XRay[]>;
}
