const ossConfig = require('../oss.config.js')
const oss = require('ali-oss');

const client = new oss(ossConfig);

module.exports  = {
    async getBuckets (etx) {
        try {
                const result = await client.listBuckets();
                etx.body = {
                    type: 1,
                    data: result.buckets
                }
            } catch (e) {
                console.log(e)
                etx.body = {
                    type: 0,
                    data: e.toString()
                }
        }
    },
    async createBucket (etx) {
        try {
            const { name } = etx.request.body
            const result = await client.putBucket(name);
            etx.body = {
                type: 1,
                data: result
            }
        } catch (e) {
            console.log(e)
            etx.body = {
                type: 0,
                data: e.toString()
            }
        }
    },
    async delBucket (etx) {
        const { name } = etx.request.body
        try {
            const result = await client.deleteBucket(name);
            etx.body = {
                type: 1,
                data: result
            }
        } catch (e) {
            console.log(e)
            etx.body = {
                type: 0,
                data: e.toString()
            }
        }
    }
}