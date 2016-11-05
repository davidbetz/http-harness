// MIT License

// Copyright (c) 2016 David Betz

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

"use strict"

const expect = require('chai').expect
const assert = require('chai').assert

const debug = require('debug')('test')

const memorydb = require('memorydb')
const samples = require("../endpoints/samples")
const httpHarness = require('../http-harness')
const idgen = require('../idgen')

const createRequestOptions = () => {
    return Object.assign({}, {
        user: {
        },
        url: 'https://domain.local/api/samples'
    })
}

describe("GET /api/samples", function () {
    beforeEach(() => {
        memorydb.resetDatabase()
    })

    it("gets all", function (done) {
        const user_id = idgen.generate('0')
        let ro = createRequestOptions()
        ro.user._id = user_id
        ro.body = { value: 12345 }

        let req = httpHarness.createRequest(ro)
        let res = httpHarness.createResponse()

        res.setDone((obj) => {
            ro = createRequestOptions()
            ro.user._id = user_id
            ro.body = { value: 67890 }

            req = httpHarness.createRequest(ro)
            res = httpHarness.createResponse()

            res.setDone((obj) => {
                expect(obj.code).to.equal(200)
                const session_id = obj.json_obj

                ro = createRequestOptions()
                ro.user._id = user_id
                ro.body = { value: 12345 }

                req = httpHarness.createRequest(ro)
                res = httpHarness.createResponse()

                res.setDone((obj) => {
                    const results = obj.json_obj
                    expect(results.length).to.eq(2)
                    done()
                })
                samples.get(req, res, () => { })
            })
            samples.post(req, res, () => { })
        })
        samples.post(req, res, () => { })
    })

    it("gets by id", function (done) {
        const user_id = idgen.generate('0')
        let ro = createRequestOptions()
        ro.user._id = user_id
        ro.body = { value: 12345 }

        let req = httpHarness.createRequest(ro)
        let res = httpHarness.createResponse()


        res.setDone((obj) => {
            expect(obj.code).to.equal(200)
            const session_id = obj.json_obj

            ro = createRequestOptions()
            ro.user._id = user_id
            ro.body = { value: 12345 }
            ro.params = { id: session_id }

            req = httpHarness.createRequest(ro)
            res = httpHarness.createResponse()

            res.setDone((obj) => {
                const item = obj.json_obj
                expect(item.partition_key.length).to.gt(10)
                expect(item.row_key.length).to.gt(10)
                expect(item.value).to.eq(12345)
                done()
            })
            samples.getWithId(req, res, () => { })
        })
        samples.post(req, res, () => { })
    })
})

describe("POST /api/samples", function () {
    beforeEach(() => {
        memorydb.resetDatabase()
    })

    it("add new sample", function (done) {
        const user_id = idgen.generate('0')
        const ro = createRequestOptions()
        ro.user._id = user_id
        ro.body = { value: 12345 }

        const req = httpHarness.createRequest(ro)
        const res = httpHarness.createResponse()

        res.setDone((obj) => {
            expect(obj.code).to.equal(200)
            expect(obj.json_obj.length).to.gt(10)
            done()
        })
        samples.post(req, res, () => { })
    })

    it("add new sample (no auth)", function (done) {
        const user_id = idgen.generate('0')
        const ro = createRequestOptions()
        ro.body = { value: 12345 }

        const req = httpHarness.createRequest(ro)
        const res = httpHarness.createResponse()


        res.setDone((obj) => {
            expect(obj.code).to.equal(401)
            done()
        })
        samples.post(req, res, () => { })
    })
})