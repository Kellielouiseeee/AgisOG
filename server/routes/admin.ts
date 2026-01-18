import { Router } from 'express';
import { ConfigRepository, TemplateRepository, LogRepository, SeasonRepository } from '../repositories';

const router = Router();

// Mock Admin Auth
const requireAdmin = (req: any, res: any, next: any) => {
    next();
};
router.use(requireAdmin);

// --- CONFIG ---
router.get('/config', (req, res) => res.json(ConfigRepository.get()));
router.put('/config', (req, res) => {
    const adminId = (req.headers['x-admin-id'] as string) || 'system_admin';
    res.json(ConfigRepository.update(req.body, adminId));
});

// --- LOGS ---
router.get('/logs', (req, res) => res.json(LogRepository.getAll()));

// --- TEMPLATES ---
router.get('/templates', (req, res) => res.json(TemplateRepository.getAll()));
router.post('/templates', (req, res) => {
    const adminId = (req.headers['x-admin-id'] as string) || 'system_admin';
    res.json(TemplateRepository.create(req.body, adminId));
});

// --- SEASONS ---
router.get('/seasons', (req, res) => res.json(SeasonRepository.getAll()));
router.post('/seasons/:id/toggle', (req, res) => {
    const { isActive } = req.body;
    res.json(SeasonRepository.toggle(req.params.id, isActive));
});

export default router;
