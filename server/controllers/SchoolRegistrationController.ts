import { Request, Response } from 'express';
import { SchoolRegistrationService } from '../services/SchoolRegistrationService.js';
import { startRegistrationSchema } from '../validators/schoolRegistrationValidator.js';
import { logger } from '../telemetry/logger.js';

const registrationService = new SchoolRegistrationService();

export class SchoolRegistrationController {
  public static async start(req: Request, res: Response) {
    try {
      const validatedData = startRegistrationSchema.parse(req.body);
      const registration = await registrationService.startRegistration(validatedData);
      
      logger.info('School registration started/resumed', { registration_id: registration.registration_id });
      
      // If it was just updated (resumed), it's a 200, else 201. We can just use 200/201 based on if it existed, but the prompt says:
      // "201" for newly created registration, "200" for resumed/updated draft.
      // But we don't have a way to distinguish easily. Let's just do 201 for now, or check created_at == updated_at.
      const isNew = registration.created_at.getTime() === registration.updated_at.getTime();
      const status = isNew ? 201 : 200;
      
      res.status(status).json({
        success: true,
        data: registration,
        message: 'Registration draft saved successfully'
      });
    } catch (error: any) {
      logger.error('Failed to start school registration', { error: error.message });
      const status = error.message.includes('already registered') ? 409 : 400;
      res.status(status).json({
        success: false,
        data: null,
        message: error.message || 'Validation failed'
      });
    }
  }

  public static async get(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const registration = await registrationService.getRegistration(id);
      res.status(200).json({
        success: true,
        data: registration,
        message: 'Registration fetched successfully'
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        data: null,
        message: error.message
      });
    }
  }

  public static async complete(req: Request, res: Response) {
    try {
      const { registrationId, formData, password } = req.body;
      if (!registrationId) throw new Error('Registration ID is required');
      
      const result = await registrationService.completeRegistration(registrationId, formData, password);
      
      logger.info('School registration completed', { registration_id: registrationId });
      
      res.status(200).json({
        success: true,
        data: result.registration,
        message: result.message
      });
    } catch (error: any) {
      logger.error('Failed to complete school registration', { error: error.message });
      res.status(400).json({
        success: false,
        data: null,
        message: error.message
      });
    }
  }
}
