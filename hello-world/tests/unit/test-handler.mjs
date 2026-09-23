'use strict'

import { expect } from 'chai'
import { lambdaHandler } from '../../app.mjs'

describe('Tests index', function () {
  it('verifies successful response', async () => {
    const result = await lambdaHandler()

    expect(result).to.be.an('object')
    expect(result.statusCode).to.equal(200)
    expect(result.body).to.be.an('string')

    const response = JSON.parse(result.body)

    expect(response).to.be.an('object')
    expect(response.message).to.equal('hello world')
  })
})