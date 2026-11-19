const mongoose = require('mongoose');
const Service = require('../models/Service');
const uploadOnCloudinary = require('../config/cloudinary');
const fs = require('fs');

const makeSlug = (text) =>
  text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

const parseFeatures = (input) => {
  if (!input) return [];
  if (Array.isArray(input)) {
    return input.map((f) => {
      if (typeof f === 'string') {
        try {
          return JSON.parse(f);
        } catch {
          return { title: f, desc: '' };
        }
      }
      if (typeof f === 'object' && f !== null) return f;
      return { title: String(f), desc: '' };
    });
  }
  if (typeof input === 'string') {
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) return parsed;
      return [parsed];
    } catch {
      return [{ title: input, desc: '' }];
    }
  }
  return [];
};

const parsePoints = (input) => {
  if (!input) return [];
  if (Array.isArray(input)) {
    return input
      .map((p) => {
        if (typeof p === 'string') return p.trim();
        try {
          return JSON.stringify(p);
        } catch {
          return String(p);
        }
      })
      .filter(Boolean);
  }
  if (typeof input === 'string') {
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) return parsed.map((p) => String(p).trim()).filter(Boolean);
      return [input.trim()];
    } catch {
      return [input.trim()];
    }
  }
  return [];
};

const parseFaqs = (input) => {
  if (!input) return [];
  if (Array.isArray(input)) {
    return input.map((item) => {
      if (typeof item === 'string') {
        try {
          return JSON.parse(item);
        } catch {
          return { q: item, a: '' };
        }
      }
      if (typeof item === 'object' && item !== null) return item;
      return { q: String(item), a: '' };
    });
  }
  if (typeof input === 'string') {
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) return parsed;
      return [parsed];
    } catch {
      return [{ q: input, a: '' }];
    }
  }
  return [];
};

exports.createService = async (req, res, next) => {
  try {
    const body = req.body || {};
    if (!body.title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    let slug = body.slug ? makeSlug(body.slug) : makeSlug(body.title);
    if (!slug) slug = `service-${Date.now()}`;

    const existing = await Service.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    let imageUrl = body.image || '';
    if (req.file && req.file.filename) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const features = parseFeatures(body.features);
    const points = parsePoints(body.points);
    const faqs = parseFaqs(body.faqs);

    const service = new Service({
      slug,
      title: body.title,
      image: imageUrl,
      desc: body.desc || '',
      desc2: body.desc2 || '',
      features,
      points,
      faqs,
    });

    await service.save();
    return res.status(201).json({ success: true, message: 'Service created successfully', data: service });
  } catch (error) {
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch {}
    }
    next(error);
  }
};

exports.getAllServices = async (req, res, next) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: services.length, data: services });
  } catch (error) {
    next(error);
  }
};

exports.getServiceBySlug = async (req, res, next) => {
  try {
    const param = req.params.slug;
    let service = await Service.findOne({
      $or: [
        { slug: param },
        { _id: param },
        ...(mongoose.Types.ObjectId.isValid(param) ? [{ _id: new mongoose.Types.ObjectId(param) }] : [])
      ]
    });
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    return res.status(200).json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
};

exports.updateService = async (req, res, next) => {
  try {
    const paramId = req.params.id;
    let service = await Service.findOne({
      $or: [
        { _id: paramId },
        ...(mongoose.Types.ObjectId.isValid(paramId) ? [{ _id: new mongoose.Types.ObjectId(paramId) }] : []),
        { slug: paramId }
      ]
    });
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    const body = req.body || {};
    const updates = {};

    if (body.title) updates.title = body.title;
    if (body.slug) {
      const newSlug = makeSlug(body.slug);
      const duplicate = await Service.findOne({ slug: newSlug, _id: { $ne: service._id } });
      if (!duplicate) updates.slug = newSlug;
    }
    if (body.desc !== undefined) updates.desc = body.desc;
    if (body.desc2 !== undefined) updates.desc2 = body.desc2;
    if (body.image !== undefined) updates.image = body.image;

    if (body.features !== undefined) updates.features = parseFeatures(body.features);
    if (body.points !== undefined) updates.points = parsePoints(body.points);
    if (body.faqs !== undefined) updates.faqs = parseFaqs(body.faqs);

    if (req.file && req.file.filename) {
      updates.image = `/uploads/${req.file.filename}`;
    }

    const updated = await Service.findOneAndUpdate(
      { _id: service._id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    return res.status(200).json({ success: true, message: 'Service updated successfully', data: updated });
  } catch (error) {
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch {}
    }
    next(error);
  }
};

exports.deleteService = async (req, res, next) => {
  try {
    const paramId = req.params.id;
    const service = await Service.findOne({
      $or: [
        { _id: paramId },
        ...(mongoose.Types.ObjectId.isValid(paramId) ? [{ _id: new mongoose.Types.ObjectId(paramId) }] : []),
        { slug: paramId }
      ]
    });
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    await Service.deleteOne({ _id: service._id });
    return res.status(200).json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    next(error);
  }
};