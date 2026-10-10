import FlagModel from '../models/flagModel.js';

export const getAllFlags = async (req, res) => {
  try {
    const flags = await FlagModel.getAll();
    res.json({
      status: 'success',
      count: flags.length,
      flags
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

export const updateFlagStatus = async (req, res) => {
  try {
    const { status, action, note } = req.body;
    const updated = await FlagModel.updateStatus(req.params.id, status, action, note);
    if (!updated) {
      return res.status(404).json({ status: 'error', message: 'Flag tidak ditemukan.' });
    }
    res.json({
      status: 'success',
      message: 'Status flag berhasil diperbarui.',
      flag: updated
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
