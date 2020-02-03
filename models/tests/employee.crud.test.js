const Employees = require('../employees.model');
const expect = require('chai').expect;
const mongoose = require('mongoose');
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;

describe('Employees', () => {
  before(async () => {
    try {
      const fakeDB = new MongoMemoryServer();

      const uri = await fakeDB.getConnectionString();

      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
    } catch (err) {
      console.log(err);
    }
  });

  describe('Reading data', () => {
    before(async () => {
      const testEmpOne = new Employees({
        firstName: 'John',
        lastName: 'Kowalski',
        department: 'IT'
      });
      await testEmpOne.save();

      const testEmpTwo = new Employees({
        firstName: 'Caroline',
        lastName: 'Doe',
        department: 'Marketing'
      });
      await testEmpTwo.save();
    });

    it('should return all the data with "find" method', async () => {
      const employees = await Employees.find();
      const expectedLength = 2;
      expect(employees.length).to.be.equal(expectedLength);
    });

    it('should return a proper document by "firstName" with "findOne" method', async () => {
      const employees = await Employees.findOne({
        firstName: 'John',
        lastName: 'Kowalski',
        department: 'IT'
      });
      const expectedfirstName = 'John';
      expect(employees.firstName).to.be.equal(expectedfirstName);
    });

    after(async () => {
      await Employees.deleteMany();
    });
  });

  describe('Creating data', () => {
    it('should insert new document with "insertOne" method', async () => {
      const employee = new Employees({
        firstName: 'John',
        lastName: 'Kowalski',
        department: 'IT'
      });
      await employee.save();
      expect(employee.isNew).to.be.false;
    });
    after(async () => {
      await Employees.deleteMany();
    });
  });

  describe('Updating data', () => {
    beforeEach(async () => {
      const testEmpOne = new Employees({
        firstName: 'John',
        lastName: 'Kowalski',
        department: 'IT'
      });
      await testEmpOne.save();

      const testEmpTwo = new Employees({
        firstName: 'Caroline',
        lastName: 'Doe',
        department: 'Marketing'
      });
      await testEmpTwo.save();
    });

    it('should properly update one document with "updateOne" method', async () => {
      await Employees.updateOne(
        { firstName: 'John' },
        { $set: { firstName: 'Janek' } }
      );
      const updatedEmployee = await Employees.findOne({
        firstName: 'Janek'
      });
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update one document with "save" method', async () => {
      const employee = await Employees.findOne({
        firstName: 'Caroline',
        lastName: 'Doe',
        department: 'Marketing'
      });
      employee.firstName = 'Karolina';
      await employee.save();

      const updatedEmployee = await Employees.findOne({
        firstName: 'Karolina'
      });
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update multiple documents with "updateMany" method', async () => {
      await Employees.updateMany({}, { $set: { firstName: 'Updated!' } });
      const employees = await Employees.find({ firstName: 'Updated!' });
      expect(employees.length).to.be.equal(2);
    });
    afterEach(async () => {
      await Employees.deleteMany();
    });
  });

  describe('Removing data', () => {
    beforeEach(async () => {
      const testEmpOne = new Employees({
        firstName: 'John',
        lastName: 'Kowalski',
        department: 'IT'
      });
      await testEmpOne.save();

      const testEmpTwo = new Employees({
        firstName: 'Caroline',
        lastName: 'Doe',
        department: 'Marketing'
      });
      await testEmpTwo.save();
    });

    it('should properly remove one document with "deleteOne" method', async () => {
      await Employees.deleteOne({
        firstName: 'John',
        lastName: 'Kowalski',
        department: 'IT'
      });
      const removeEmployee = await Employees.findOne({
        firstName: 'John'
      });
      expect(removeEmployee).to.be.null;
    });

    it('should properly remove one document with "remove" method', async () => {
      const employee = await Employees.findOne({
        firstName: 'John',
        lastName: 'Kowalski',
        department: 'IT'
      });
      await employee.remove();
      const removedEmployee = await Employees.findOne({
        firstName: 'John'
      });
      expect(removedEmployee).to.be.null;
    });

    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Employees.deleteMany();
      const employees = await Employees.find();
      expect(employees.length).to.be.equal(0);
    });
    afterEach(async () => {
      await Employees.deleteMany();
    });
  });
});
