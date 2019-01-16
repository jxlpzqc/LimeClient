<template>
    <el-form :model="project" :rules="projectRule" ref="project" class="basic-form" label-width="80px">

        <el-form-item label="项目名称" prop="name">
            <el-input v-model="project.name"></el-input>
        </el-form-item>

        <el-form-item label="甲方" prop="partyA">
            <el-select v-model="project.partyA" :filterable="true" i style="width: 320px;">
                <el-option
                        v-for="item in partAList"

                        :key="item.code"
                        :label="item.name"
                        :value="item.code">
                </el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="乙方" prop="partyB">
            <el-input v-model="project.partyB"></el-input>
        </el-form-item>

        <el-form-item label="合同金额" prop="price">
            <el-input type="number" v-model="project.price">
                <template slot="append">元</template>
            </el-input>
        </el-form-item>

        <el-form-item label="施工地点" prop="region">
            <el-cascader
                    style="width: 320px;"
                    :options="options"
                    v-model="project.region"
                    filterable="true"
                    placeholder="请输入或选择地区"
            >
            </el-cascader>
        </el-form-item>

        <el-form-item label="负责人" prop="person">
            <el-input v-model="project.person"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
            <el-input v-model="project.phone"></el-input>
        </el-form-item>

        <el-form-item>
            <el-button type="primary" @click="submitForm">立即创建</el-button>
            <el-button @click="resetForm">清空</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import {
        provinceAndCityData,
        regionData,
        provinceAndCityDataPlus,
        regionDataPlus,
        CodeToText,
        TextToCode
    } from 'element-china-area-data'

    import {partyA} from '../../partyA.js';

    export default {
        name: "NewProject",
        data() {
            return {
                partAList : partyA,
                options: regionData,
                project: {
                    id: '',
                    name: '',
                    region: ["360000", "360200", "360281"],
                    partyA:'',
                    partyB:'',
                    price:'',
                    person:'',
                    phone:''

                },
                projectRule: {
                    id: [
                        {required: true, message: "请输入项目编号", trigger: 'blur'},
                        {min: 10, max: 10, message: "项目编号为10位数", trigger: 'change'}
                    ],
                    name: [
                        {required: true, message: "请输入项目名称"}
                    ],
                    region: [
                        {required:true,message:"请选择施工地点"}
                    ],
                    partyA:[
                        {required:true,message:"请选择甲方"}
                    ],
                    partyB:[
                        {required:true,message:"请输入乙方"}
                    ],
                    price:[
                        {required:true,message:"请输入金额"}
                    ],
                    person:[
                        {required:true,message:"请输入负责人"}
                    ],
                    phone:[
                        {required:true,message:"请输入电话号码"},
                        {min:11,max:11,message:"电话号码为11位",trigger:'change'}
                    ]
                }
            }
        },
        methods: {

            submitForm() {
                this.$refs['project'].validate((valid) => {
                    if (valid) {
                        this.$message('提交成功');
                    } else {
                        this.$message("提交失败")
                        return false;
                    }
                });
            },
            resetForm() {
                this.$refs['project'].resetFields();
            }
        },

        mounted() {

        }
    }
</script>

<style scoped>

</style>