#!/usr/bin/env node

const { getParallelSum } = require('./sum');
const assert = require('assert');

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); 
}

function createRandIntArr() {
    const arrSize = getRandomInt(1, 100_000_000); 
    const arr = Array(arrSize);
    for (var i = 0; i < arrSize; i++) {
        arr[i] = getRandomInt(-1000, 1000); 
    }
    return arr;
}

function getTheadsNum() {
    return getRandomInt(1, 5);
}

async function testSimpleSingleThread() {
    const array = [1, 2, 3, 4, 5];
    const expectedSum = 15;
    var [ sum, time ] = await getParallelSum(array, 1)
    assert.strictEqual(sum, expectedSum);
    assert.strictEqual(typeof time === 'number', true)
    assert.strictEqual(0 < time, true);
    console.log('SimpleSingleThread test passed');
}

async function testIncorrectArgs() {
    var array = ['1', '2', '3', '4', '5'];
    var threadsNum = 1;
    async ()=> {
        await assert.rejects(
            getParallelSum(array, threadsNum), Error
        );
    }
    array = [1, 2, 3, 4, 5];
    threadsNum = -1;
    async ()=> {
        await assert.rejects(
            getParallelSum(array, threadsNum), Error
        );
    }
    array = []
    threadsNum = 1;
    async ()=> {
        await assert.rejects(
            getParallelSum(array, threadsNum), Error
        );
    }
    console.log('IncorrectArgs test passed');
}

async function testRandomArgs() {
    var array = createRandIntArr();
    var threads = getTheadsNum();
    var expectedSum = array.reduce((a, b) => a + b, 0);
    var [ sum, time ] = await getParallelSum(array, threads)
    assert.strictEqual(sum, expectedSum);
    assert.strictEqual(typeof time === 'number', true)
    assert.strictEqual(0 < time, true);
    console.log('RandomArgs test passed');
}

testSimpleSingleThread();
testIncorrectArgs();
testRandomArgs();
