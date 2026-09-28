const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();

// Default workspace (can be overridden per-request via ?root=)
const DEFAULT_WORKSPACE = process.env.WORKSPACE_ROOT || path.resolve(__dirname, '../../..');

// Get workspace root from query/body or use default
function getWorkspaceRoot(req) {
    return req.query.root || req.body?.root || DEFAULT_WORKSPACE;
}

// Folders to completely skip (do not read or recurse into)
const IGNORED_FOLDERS = new Set(['node_modules', '.git', 'dist', 'build', '.next', '.vscode', '.idea']);

// Helper to recursively read directory
async function buildTree(dirPath, workspaceRoot) {
    let items;
    try {
        items = await fs.readdir(dirPath, { withFileTypes: true });
    } catch (err) {
        // Permission denied or not a directory
        return [];
    }

    const nodes = await Promise.all(items.map(async (item) => {
        // Skip ignored folders immediately
        if (IGNORED_FOLDERS.has(item.name)) return null;

        const fullPath = path.join(dirPath, item.name);
        const isDirectory = item.isDirectory();
        
        let relativePath = fullPath.replace(workspaceRoot, '').replace(/\\/g, '/');
        if (!relativePath.startsWith('/')) {
            relativePath = '/' + relativePath;
        }

        let node = {
            name: item.name,
            path: relativePath,
            isDirectory
        };

        if (isDirectory) {
            node.children = await buildTree(fullPath, workspaceRoot);
        }
        
        return node;
    }));

    // Filter out nulls and sort (directories first, then files alphabetically)
    return nodes.filter(n => n !== null).sort((a, b) => {
        if (a.isDirectory === b.isDirectory) return a.name.localeCompare(b.name);
        return a.isDirectory ? -1 : 1;
    });
}

function resolveSecurePath(workspaceRoot, requestedPath) {
    const root = path.resolve(workspaceRoot);
    const cleanPath = requestedPath.replace(/^[/\\]+/, '');
    const fullPath = path.resolve(root, cleanPath);
    if (!fullPath.startsWith(root)) {
        return null;
    }
    return fullPath;
}

// 0. Get current default workspace
router.get('/workspace', (req, res) => {
    const workspaceRoot = getWorkspaceRoot(req);
    res.json({ root: workspaceRoot });
});

// 1. Get Workspace Tree (accepts ?root=/path/to/workspace)
router.get('/tree', async (req, res) => {
    try {
        const workspaceRoot = path.resolve(getWorkspaceRoot(req));
        const tree = await buildTree(workspaceRoot, workspaceRoot);
        res.json(tree);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Read specific file (accepts ?root=...&path=...)
router.get('/file', async (req, res) => {
    try {
        const workspaceRoot = getWorkspaceRoot(req);
        const filePath = req.query.path;
        if (!filePath) return res.status(400).json({ error: 'Path required' });

        const fullPath = resolveSecurePath(workspaceRoot, filePath);
        if (!fullPath) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const content = await fs.readFile(fullPath, 'utf-8');
        res.json({ content });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Save specific file (accepts { root, path, content })
router.put('/file', async (req, res) => {
    try {
        const workspaceRoot = getWorkspaceRoot(req);
        const { path: filePath, content } = req.body;
        if (!filePath) return res.status(400).json({ error: 'Path required' });

        const fullPath = resolveSecurePath(workspaceRoot, filePath);
        if (!fullPath) {
            return res.status(403).json({ error: 'Access denied' });
        }

        await fs.writeFile(fullPath, content, 'utf-8');
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Create file or folder
router.post('/create', async (req, res) => {
    try {
        const workspaceRoot = getWorkspaceRoot(req);
        const { path: filePath, isDirectory } = req.body;
        if (!filePath) return res.status(400).json({ error: 'Path required' });

        const fullPath = resolveSecurePath(workspaceRoot, filePath);
        if (!fullPath) {
            return res.status(403).json({ error: 'Access denied' });
        }

        if (isDirectory) {
            await fs.mkdir(fullPath, { recursive: true });
        } else {
            await fs.mkdir(path.dirname(fullPath), { recursive: true });
            await fs.writeFile(fullPath, '', 'utf-8');
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. Delete file or folder
router.delete('/delete', async (req, res) => {
    try {
        const workspaceRoot = getWorkspaceRoot(req);
        const filePath = req.query.path;
        if (!filePath) return res.status(400).json({ error: 'Path required' });

        const fullPath = resolveSecurePath(workspaceRoot, filePath);
        if (!fullPath) {
            return res.status(403).json({ error: 'Access denied' });
        }

        await fs.rm(fullPath, { recursive: true, force: true });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 6. Rename / Move file or folder
router.post('/rename', async (req, res) => {
    try {
        const workspaceRoot = getWorkspaceRoot(req);
        const { oldPath, newPath } = req.body;
        if (!oldPath || !newPath) return res.status(400).json({ error: 'oldPath and newPath required' });

        const fullOld = resolveSecurePath(workspaceRoot, oldPath);
        const fullNew = resolveSecurePath(workspaceRoot, newPath);
        if (!fullOld || !fullNew) {
            return res.status(403).json({ error: 'Access denied' });
        }

        await fs.rename(fullOld, fullNew);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
