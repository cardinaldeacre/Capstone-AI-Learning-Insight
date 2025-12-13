const express = require('express');
const router = express.Router();
const { authMiddleware, authorizeRole } = require('../middleware/auth');
const DashboardService = require('../services/DashboardService');

router.get('/teacher-stats', authMiddleware, authorizeRole('teacher', 'admin'), async (req, res) => {
    try {
        const stats = await DashboardService.getTeacherStats(req.user.id);
        res.json({ data: stats });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/learning-insight', authMiddleware, authorizeRole('student'), async (req, res) => {
    try {
        const learningInsight = await DashboardService.getLearningInsight(req.user.id);
        res.json({ data: learningInsight });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;