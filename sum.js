#!/usr/bin/env node

const assert = require('assert');
const { Worker, isMainThread, parentPort, workerData } = require('node:worker_threads');

function makeParallelSum(arr, threadsNum) {
    return new Promise((resolve, reject) => {
    if (typeof arr !== typeof [] || typeof threadsNum !== 'number') {
        throw Error ('Incorrect argument type')
    }
    else if (arr.length < 0 || arr.length > 100_000_000) {
        throw Error (`Incorrect array size: [${arr.length}]`)
    } else if (threadsNum < 1 || threadsNum > 5) {
        throw Error (`Incorrect number of threads: [${threadsNum}]`)
    }
    const chunkSize = Math.ceil(arr.length / threadsNum);
    let sum = 0;
    let completedWorkers = 0; 

    for (let i = 0; i < threadsNum; i++) {
        let start = i * chunkSize;
        let end = Math.min(start + chunkSize, arr.length);
        const worker = new Worker('./sum.js', {
            workerData: {
                    start: start, end: end, arr: arr
                }, 
        });
        worker.on('message', (workerSum)  => {
            sum += workerSum;
            completedWorkers++;
            if (completedWorkers == threadsNum) {
                return resolve(sum);
            }
        })
        worker.on('error', (err) => {
            reject(err);
        })
        }
    })
}

function makeSumForChunk(start, end, arr) {
    let workerSum = 0;
    for (let i = start; i < end; i++) {
        if (typeof arr[i] !== 'number') {
            throw Error ('Passed array has element of wrong type')
        }
        workerSum += arr[i];
    }
    return workerSum;
}

async function getParallelSum(arr, threadsNum) {
    if (isMainThread) {
        const startTime = Date.now();
        let sum = await makeParallelSum(arr, threadsNum)
        const totalTime = Date.now() - startTime;
        return [ sum, totalTime ];
    } else {
        const {start, end, arr} = workerData;
        var workerSum = makeSumForChunk(start, end, arr) 
        parentPort.postMessage(workerSum);
    }
}

module.exports = {
    getParallelSum,
};

if (require.main === module) {
    getParallelSum();
}
