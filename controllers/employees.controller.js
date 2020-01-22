const Employees = require('../models/employees.model');

exports.getAll = async (req, res) => {
  try {
    res.json(await Employees.find().populate('department'));
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getRandom = async (req, res) => {
  try {
    const count = await Employees.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const emp = await Employees.findOne().populate('department').skip(rand);
    if (!emp) res.status(404).json({ message: 'Not found' });
    else res.json(emp);
  } catch (err) {
    res.json(err);
  }
};

exports.getById = async (req, res) => {
  try {
    const emp = await Employees.findById(req.params.id).populate('department');
    if (!emp) res.status(404).json({ message: 'Not found' });
    else res.json(emp);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.postEmployee = async (req, res) => {
  const { firstName, lastName, department } = req.body;
  try {
    const newEmployees = new Employees({
      firstName: firstName,
      lastName: lastName,
      department: department
    });
    await newEmployees.save().populate('department');
    res.json({ message: 'OK' });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.editEmployee = async (req, res) => {
  const { firstName, lastName, department } = req.body;
  try {
    await Employees.findByIdAndUpdate.populate('department')(
      { _id: req.params.id },
      {
        $set: {
          firstName: firstName,
          lastName: lastName,
          department: department
        }
      }
    );
    res.json({ message: 'OK' });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const emp = await Employees.findById(req.params.id);
    if (emp) {
      await Employees.deleteOne({ _id: req.params.id }).populate('department');
      res.json({ message: 'OK' });
    } else res.status(404).json({ message: 'Not found...' });
  } catch (err) {
    res.status(500).json(err);
  }
};
