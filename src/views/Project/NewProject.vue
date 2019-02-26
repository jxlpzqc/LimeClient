<template>
    <el-form :model="project" v-loading="submitting" :rules="projectRule" ref="project" class="basic-form"
             label-width="80px">

        <el-form-item label="项目名称" prop="name">
            <el-input v-model="project.name"></el-input>
        </el-form-item>

        <el-form-item label="甲方" prop="partyA">
            <el-input v-model="project.partyA"></el-input>
        </el-form-item>

        <el-form-item label="乙方" prop="partyB">

            <el-select v-model="project.partyB" :filterable="true" i style="width: 320px;">
                <el-option
                        v-for="item in partyBList"

                        :key="item.code"
                        :label="item.name"
                        :value="item.code">
                </el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="合同金额" prop="price">
            <el-input type="number" v-model="project.price">
                <template slot="append">元</template>
            </el-input>
        </el-form-item>

        <el-form-item label="合同日期" prop="date">
            <el-date-picker style="width: 320px;" v-model="project.date" type="date" placeholder="选择日期">
            </el-date-picker>
        </el-form-item>

        <el-form-item label="施工期限" prop="date">
            <el-date-picker
                    v-model="project.during"
                    type="daterange"
                    range-separator="至"
                    value-format="yyyy-MM-dd"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
            style="width: 320px">
            </el-date-picker>
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

    import {partyB} from '../../partyB.js';
    import {LimeHttp} from "../../ajax";

    export default {
        name: "NewProject",
        data() {
            return {
                submitting: false,
                partyBList: partyB,
                options: regionData,
                project: {
                    name: '',
                    region: ["360000", "360200", "360281"],
                    partyA: '',
                    partyB: '',
                    price: '',
                    person: '',
                    phone: '',
                    date: new Date(),
                    during:[]
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
                        {required: true, message: "请选择施工地点"}
                    ],
                    partyA: [
                        {required: true, message: "请选择甲方"}
                    ],
                    partyB: [
                        {required: true, message: "请输入乙方"}
                    ],
                    price: [
                        {required: true, message: "请输入金额"}
                    ],
                    person: [
                        {required: true, message: "请输入负责人"}
                    ],
                    phone: [
                        {required: true, message: "请输入电话号码"},
                        {min: 11, max: 11, message: "电话号码为11位", trigger: 'change'}
                    ],
                    date: [
                        {required: true, message: "请选择日期"}
                    ]
                }
            }
        },
        methods: {

            submitForm() {
                this.$refs['project'].validate((valid) => {
                    if (valid) {
                        this.submitting = true;
                        LimeHttp.post("/project/newProject", this.project)
                            .then((resp) => {
                                this.submitting = false;
                                this.$message(resp.data.msg);
                                if (resp.data.code == 0) {
                                    this.$alert("项目创建成功，项目ID：" + resp.data.data.id);
                                    this.$refs['project'].resetFields();
                                } else if (resp.data.code == -400) {
                                    this.$emit('no-login');
                                }

                            })
                            .catch(() => {
                                this.submitting = false;
                                this.$message("服务器发生异常");
                            })

                        this.$message('提交成功');
                    } else {
                        this.$message("提交失败");
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