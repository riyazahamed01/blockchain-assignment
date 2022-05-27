/*
 * Student smart contract
 *
 * Student CRUD operation
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class StudentContract extends Contract {

    // AddNewStudent add a new student.
    async AddNewStudent(ctx, id, firstName, lastName, email, gender, mobile_no, address, city) {
        const studentExist = await ctx.stub.getState(id);
        if (studentExist) {
            throw new Error(`The student ${id} already exists`);
        }

        //Add new student details
        const student = {
            ID: id,
            FirstName: firstName,
            LastName: lastName,
            Email: email,
            Gender: gender,
            MobileNo: mobile_no,
            Address: address,
            City: city,
        };
        await ctx.stub.putState(id, Buffer.from(JSON.stringify(student)));
        return JSON.stringify(student);
    }

    // UpdateStudent updates an existing student with provided parameters. 
    async UpdateStudentInfo(ctx, id, firstName, lastName, email, gender, mobile_no, address, city) {
        const studentExist = await ctx.stub.getState(id);
        if (!studentExist) {
            throw new Error(`The student ${id} does not exist`);
        }

        // overwriting original student details with new student Information
        const updatedStudent = {
            ID: id,
            FirstName: firstName,
            LastName: lastName,
            Email: email,
            Gender: gender,
            MobileNo: mobile_no,
            Address: address,
            City: city,
        };
        return ctx.stub.putState(id, Buffer.from(JSON.stringify(updatedStudent)));
    }

    // get single stuent details with given student id.
    async GetSingleStudent(ctx, id) {
        const studentJSON = await ctx.stub.getState(id);  
        if (!studentJSON || studentJSON.length === 0) {
            throw new Error(`The student ${id} does not exist`);
        }
        return studentJSON.toString();
    }

    // GetAllStudent returns all students records.
    async GetAllStudents(ctx) {
        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all students in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: result.value.key, Record: record });
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }
}

module.exports = StudentContract;
