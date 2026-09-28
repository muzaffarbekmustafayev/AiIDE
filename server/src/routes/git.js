const express = require('express');
const simpleGit = require('simple-git');
const path = require('path');
const router = express.Router();

router.get('/status', async (req, res) => {
    try {
        const root = req.query.root || process.env.WORKSPACE_ROOT || path.resolve(__dirname, '../../..');
        const git = simpleGit(root);
        const status = await git.status();
        res.json(status);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
