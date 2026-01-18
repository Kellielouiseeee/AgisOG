import { db } from '../db/adapter';
import { MissionTemplate, SystemLog } from '../models/types';
import { v4 as uuidv4 } from 'uuid';

export const TemplateRepository = {
  getAll: (): MissionTemplate[] => {
    return db.get('templates');
  },

  create: (templateData: Omit<MissionTemplate, 'id'>, adminId: string): MissionTemplate => {
    const templates = db.get('templates');
    const newTemplate: MissionTemplate = {
      id: uuidv4(),
      ...templateData
    };
    
    templates.push(newTemplate);
    db.set('templates', templates);

    // Audit Log
    const logs = db.get('logs');
    logs.push({
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      action: 'CREATE_TEMPLATE',
      adminId,
      details: { templateId: newTemplate.id, title: newTemplate.title }
    });
    db.set('logs', logs);

    return newTemplate;
  }
};
