const mongoose = require('mongoose');
const Gallery = require('../models/Gallery');
const uploadOnCloudinary = require('../config/cloudinary');
const fs = require('fs');

const initialGalleryItems = [
  {
    title: 'Modern Minimalist Living Room',
    category: 'Living Room',
    mainImage: '/images/gallery-1.jpg',
    otherImages: [
      '/images/gallery-3.jpg',
      '/images/gallery-4.jpg',
      '/images/gallery-11.jpg'
    ]
  },
  {
    title: 'Luxury Executive Kitchen Suite',
    category: 'Kitchen',
    mainImage: '/images/gallery-6.jpg',
    otherImages: [
      '/images/gallery-7.jpg',
      '/images/gallery-9.jpg',
      '/images/gallery-3.jpg'
    ]
  },
  {
    title: 'Contemporary Master Bedroom Sanctuary',
    category: 'Bedroom',
    mainImage: '/images/gallery-11.jpg',
    otherImages: [
      '/images/gallery-12.jpg',
      '/images/gallery-7.jpg',
      '/images/gallery-1.jpg'
    ]
  },
  {
    title: 'Spa-Inspired Marble Bathroom Suite',
    category: 'Bathroom',
    mainImage: '/images/gallery-9.jpg',
    otherImages: [
      '/images/gallery-4.jpg',
      '/images/gallery-6.jpg',
      '/images/gallery-12.jpg'
    ]
  }
];

exports.createGalleryItem = async (req, res, next) => {
  try {
    const body = req.body || {};
    if (!body.title || !body.category) {
      return res.status(400).json({ success: false, message: 'Title and category are required' });
    }
    if (!req.files || !req.files.mainImage || !req.files.otherImages || req.files.otherImages.length < 1) {
      return res.status(400).json({ success: false, message: 'Main image and at least 1 other image are required' });
    }

    // Main image (stored locally in /uploads)
    const mainImageFile = req.files.mainImage[0];
    const mainImageUrl = `/uploads/${mainImageFile.filename}`;

    // Other images (stored locally in /uploads)
    const otherImages = req.files.otherImages.map((file) => `/uploads/${file.filename}`);

    if (otherImages.length === 0) {
      return res.status(500).json({ success: false, message: 'Failed to upload gallery images' });
    }

    const gallery = new Gallery({
      title: body.title,
      category: body.category,
      mainImage: mainImageUrl,
      otherImages,
    });

    await gallery.save();
    return res.status(201).json({ success: true, message: 'Gallery item created', data: gallery });
  } catch (error) {
    next(error);
  }
};

exports.getAllGalleryItems = async (req, res, next) => {
  try {
    const category = req.query.category;
    const query = category ? { category } : {};

    let count = await Gallery.countDocuments();
    if (count === 0) {
      await Gallery.insertMany(initialGalleryItems);
    }

    const items = await Gallery.find(query).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) { next(error); }
};

exports.getGalleryItemById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const item = await Gallery.findOne({
      $or: [
        { _id: id },
        ...(id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: new mongoose.Types.ObjectId(id) }] : [])
      ]
    });
    if (!item) return res.status(404).json({ success: false, message: 'Gallery item not found' });
    return res.status(200).json({ success: true, data: item });
  } catch (error) { next(error); }
};

exports.updateGalleryItem = async (req, res, next) => {
  try {
    const id = req.params.id;
    const item = await Gallery.findOne({
      $or: [
        { _id: id },
        ...(id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: new mongoose.Types.ObjectId(id) }] : [])
      ]
    });
    if (!item) return res.status(404).json({ success: false, message: 'Gallery item not found' });

    const body = req.body || {};
    if (body.title) item.title = body.title;
    if (body.category) item.category = body.category;

    // Direct string assignment if passed in body
    if (body.mainImage && typeof body.mainImage === 'string') {
      item.mainImage = body.mainImage;
    }

    // If new main image is uploaded via file
    if (req.files && req.files.mainImage && req.files.mainImage[0]) {
      const f = req.files.mainImage[0];
      item.mainImage = `/uploads/${f.filename}`;
    }

    // Handle otherImages
    let existingOtherImages = [];
    if (body.existingOtherImages) {
      if (Array.isArray(body.existingOtherImages)) {
        existingOtherImages = body.existingOtherImages;
      } else if (typeof body.existingOtherImages === 'string') {
        try {
          const parsed = JSON.parse(body.existingOtherImages);
          existingOtherImages = Array.isArray(parsed) ? parsed : [body.existingOtherImages];
        } catch {
          existingOtherImages = [body.existingOtherImages];
        }
      }
    } else if (body.otherImages && typeof body.otherImages === 'string') {
      try {
        const parsed = JSON.parse(body.otherImages);
        if (Array.isArray(parsed)) existingOtherImages = parsed;
      } catch {}
    }

    // New uploaded other files
    const newOtherFiles = (req.files && req.files.otherImages && req.files.otherImages.length > 0)
      ? req.files.otherImages.map((file) => `/uploads/${file.filename}`)
      : [];

    if (existingOtherImages.length > 0 || newOtherFiles.length > 0) {
      item.otherImages = [...existingOtherImages, ...newOtherFiles];
    }

    await item.save();
    return res.status(200).json({ success: true, message: 'Gallery item updated', data: item });
  } catch (error) { next(error); }
};

exports.deleteGalleryItem = async (req, res, next) => {
  try {
    const id = req.params.id;
    const item = await Gallery.findOne({
      $or: [
        { _id: id },
        ...(id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: new mongoose.Types.ObjectId(id) }] : [])
      ]
    });
    if (!item) return res.status(404).json({ success: false, message: 'Gallery item not found' });
    await Gallery.deleteOne({ _id: item._id });
    return res.status(200).json({ success: true, message: 'Gallery item deleted' });
  } catch (error) { next(error); }
};
