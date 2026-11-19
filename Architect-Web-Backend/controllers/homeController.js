const HomePage = require('../models/HomePage');

// Helper to remove any accidental temporary blob URLs from documents
function removeBlobUrls(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === 'string' && obj[key].startsWith('blob:')) {
      obj[key] = '';
    } else if (typeof obj[key] === 'object') {
      removeBlobUrls(obj[key]);
    }
  }
  return obj;
}

// Get home content (creates default document if none exists yet)
exports.getHomeContent = async (req, res, next) => {
  try {
    let home = await HomePage.findOne();
    if (!home) {
      home = await HomePage.create({});
    }
    const homeObj = home.toObject ? home.toObject() : home;
    removeBlobUrls(homeObj);
    return res.status(200).json({ success: true, data: homeObj });
  } catch (err) {
    next(err);
  }
};

// Update home content (authenticated admin)
exports.updateHomeContent = async (req, res, next) => {
  try {
    const updateData = { ...(req.body || {}) };
    delete updateData._id;
    delete updateData.__v;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    removeBlobUrls(updateData);

    const home = await HomePage.findOneAndUpdate(
      {},
      { $set: updateData },
      { new: true, upsert: true, runValidators: true }
    );

    return res.status(200).json({ success: true, message: 'Home content updated successfully', data: home });
  } catch (err) {
    next(err);
  }
};

// Single image upload for any home section (saved locally in /uploads)
exports.uploadHomeImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    const filename = req.file.filename;
    const imageUrl = `/uploads/${filename}`;

    return res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      url: imageUrl
    });
  } catch (err) {
    next(err);
  }
};
