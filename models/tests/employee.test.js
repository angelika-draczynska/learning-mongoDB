const Employee = require('../employees.model.js');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Employees', () => {
  it('should throw an error if no arguments', () => {
    const emp = new Employee({});

    emp.validate(err => {
      expect(err.errors.firstName).to.exist;
      expect(err.errors.lastName).to.exist;
      expect(err.errors.department).to.exist;
    });
    after(() => {
      mongoose.models = {};
    });
  });
  it('should throw an error if "firstName", "lastName", "department" is not a string', () => {
    const cases = [{}, []];
    for (let firstName of cases) {
      const emp = new Employee({ firstName });

      emp.validate(err => {
        expect(err.errors.firstName).to.exist;
      });
    }
    for (let lastName of cases) {
      const emp = new Employee({ lastName });

      emp.validate(err => {
        expect(err.errors.lastName).to.exist;
      });
    }
    for (let department of cases) {
      const emp = new Employee({ department });

      emp.validate(err => {
        expect(err.errors.department).to.exist;
      });
    }
  });
  it('should not throw an error if "name" is okay', () => {
    const cases = ['Management', 'Leila', 'John', 'Doe', 'IT'];
    for (let firstName of cases) {
      const emp = new Employee({ firstName });

      emp.validate(err => {
        expect(err.firstName).to.not.exist;
      });
    }

    for (let lastName of cases) {
      const emp = new Employee({ lastName });

      emp.validate(err => {
        expect(err.lastName).to.not.exist;
      });
    }

    for (let department of cases) {
      const emp = new Employee({ department });

      emp.validate(err => {
        expect(err.department).to.not.exist;
      });
    }
  });
});
