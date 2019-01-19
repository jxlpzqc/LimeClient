<template>
    <el-dialog
            title="修改合同"
            :visible.sync="isShow"
            width="440px"
            v-loading="loading"
            :close-on-click-modal="false"
            @close="$emit('close')">
        <el-form :model="myProject" v-loading="loading" :rules="projectRule" ref="project" class="basic-form"
                 label-width="80px">

            <el-form-item label="项目名称" prop="name">
                <el-input v-model="myProject.name"></el-input>
            </el-form-item>

            <el-form-item label="甲方" prop="partyA">
                <el-input v-model="myProject.partyA"></el-input>
            </el-form-item>

            <el-form-item label="乙方" prop="partyB">
                <el-select v-model="myProject.partyB" :filterable="true" i style="width: 320px;">
                    <el-option
                            v-for="item in partyBList"
                            :key="item.code"
                            :label="item.name"
                            :value="item.code">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="合同金额" prop="price">
                <el-input type="number" v-model="myProject.price">
                    <template slot="append">元</template>
                </el-input>
            </el-form-item>

            <el-form-item label="合同日期" prop="date">
                <el-date-picker value-format="yyyy-MM-dd" style="width: 320px;" v-model="myProject.date" type="date" placeholder="选择日期">
                </el-date-picker>
            </el-form-item>

            <el-form-item label="施工地点" prop="region">
                <el-cascader
                        style="width: 320px;"
                        :options="options"
                        v-model="myProject.region"
                        filterable="true"
                        placeholder="请输入或选择地区"
                >
                </el-cascader>
            </el-form-item>
            <el-form-item label="施工期限" prop="date">
                <el-date-picker
                        v-model="myProject.during"
                        type="daterange"
                        range-separator="至"
                        value-format="yyyy-MM-dd"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        style="width: 320px">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="负责人" prop="person">
                <el-input v-model="myProject.person"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="phone">
                <el-input v-model="myProject.phone"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submitForm">立即修改</el-button>

            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
    import {LimeHttp} from "../ajax";
    import {TextToCode} from "element-china-area-data";
    import {getpartyBCode, partyB} from "../partyB";
    import {regionData} from 'element-china-area-data';

    export default {
        name: "EditProject",
        methods: {
            submitForm() {
                this.$refs['project'].validate((valid) => {
                    if (valid) {
                        this.loading = true;

                        LimeHttp.post("/project/updateProject", this.myProject)
                            .then((resp) => {
                                this.loading = false;
                                this.$message(resp.data.msg);
                                if (resp.data.code == 0) {
                                    this.$alert("修改成功");
                                    this.$emit("success");

                                } else if (resp.data.code == -400) {
                                    this.$emit('no-login');
                                }

                            })
                            .catch(() => {
                                this.loading = false;
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

        data() {
            return {
                loading: false,
                myProject: JSON.parse(JSON.stringify(this.project)),
                partyBList: partyB,
                options:regionData,
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
        props: {
            isShow: {
                type: Boolean,
                default: false
            },
            project: {
                type: Object,
                default() {
                    return {
                        name: '',
                        region: [],
                        partyA: '',
                        partyB: '',
                        price: '',
                        person: '',
                        phone: '',
                        date: new Date()

                    }
                },
            }
        },
        watch: {
            isShow() {
                this.myProject = JSON.parse(JSON.stringify(this.project));

            }
        },

    }
</script>

<style scoped>

</style>