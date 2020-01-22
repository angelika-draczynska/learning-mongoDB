const express = require('express');
const router = express.Router();
const Department = require('../models/department.model');

router.get('/departments', async (req, res) => {
  try {
    res.json(await Department.find());
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/departments/random', async (req, res) => {
  try {
    const count = await Department.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const dep = await Department.findOne().skip(rand);
    if (!dep) res.status(404).json({ message: 'Not found' });
    else res.json(dep);
  } catch (err) {
    res.json(err);
  }
});

router.get('/departments/:id', async (req, res) => {
  try {
    const dep = await Department.findById(req.params.id);
    if (!dep) res.status(404).json({ message: 'Not found' });
    else res.json(dep);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/departments', async (req, res) => {
  const { name } = req.body;

  try {
    const newDepartment = new Department({ name: name });
    await newDepartment.save();
    res.json({ message: 'OK' });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/departments/:id', async (req, res) => {
  const { name } = req.body;

  try {
    await Department.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { name: name } },
      { new: true }
    ).then(doc => {
      console.log(doc);
    });
    res.json({ message: 'OK' });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/departments/:id', async (req, res) => {
  try {
    const dep = await Department.findById(req.params.id);
    if (dep) {
      await Department.findOneAndRemove({ _id: req.params.id }).then(
        response => {
          console.log(response);
        }
      );
      res.json({ message: 'OK' });
    } else res.status(404).json({ message: 'Not found...' });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
