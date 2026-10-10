import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { orchestrateLangflowBob, handleMcpJsonRpc } from '../langflow/langflow_bob_mcp.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getCounselorStudents = (req, res) => {
  try {
    const studentsPath = path.join(__dirname, '../data/synthetic_students.json');
    if (fs.existsSync(studentsPath)) {
      const data = JSON.parse(fs.readFileSync(studentsPath, 'utf8'));
      return res.json({ status: 'success', students: data });
    }
    return res.json({ status: 'success', students: [] });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

export const getCounselorFlow = (req, res) => {
  try {
    const flowPath = path.join(__dirname, '../counselor_flow.json');
    const fallbackPath = path.join(__dirname, '../langflow/counselor_flow.json');
    const target = fs.existsSync(flowPath) ? flowPath : fallbackPath;
    if (fs.existsSync(target)) {
      const data = JSON.parse(fs.readFileSync(target, 'utf8'));
      return res.json(data);
    }
    return res.json({ status: 'success', nodes: [], edges: [] });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

export const handleMcp = (req, res) => {
  const response = handleMcpJsonRpc(req.body);
  res.json(response);
};

export const processCounselor = (req, res) => {
  const studentData = req.body;
  if (!studentData || !studentData.reflection_text) {
    return res.status(400).json({
      status: 'error',
      message: 'reflection_text is required for processing.'
    });
  }
  const result = orchestrateLangflowBob(studentData);
  res.json(result);
};
