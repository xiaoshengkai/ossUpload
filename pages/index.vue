<template>
    <div class="upload">
        <el-upload
            class="upload-demo"
            ref="upload"
            action=""
            :before-upload="beforeUpload"
            auto-upload
            multiple>
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="fileList = []">清空</el-button>
        </el-upload>
        <div class="showImgs" v-if="fileList.length">
            <div v-for="(url, index) in fileList" :key="index" class="box">
                <img :src="url" alt="">
                <p>{{ url }}</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            fileList: []
        };
    },
    methods: {
        async beforeUpload (file) {
            const res = await this.$requestFormPsot('/upload', file)
            console.log(res)
            return false
        }
    }
}
</script>

<style lang="less" scoped>
.upload {
    margin: 20px;

    .box {
        display: flex;
        align-items: center;
        margin: 10px 0;
        img {
            width: 10%;
        }

        p {
            flex: 1;
            margin: 10px;
        }
    }
}
.showImgs {
    margin: 20px 0;
}
</style>
