<template>
    <div>
        <el-form :model="invoice" v-loading="loading" :rules="rule" ref="form" class="basic-form"
                 label-width="80px">
            <el-form-item label="发票号" prop="id">
                <el-input v-model="invoice.id"></el-input>
            </el-form-item>
            <el-form-item label="合同编号" prop="projectId">
                <el-input v-model="invoice.projectId" disabled>
                    <el-button slot="append" @click="chooseDialog=true">选择</el-button>
                </el-input>
            </el-form-item>
            <el-form-item label="项目名称">{{handleEmpty(project.name)}}</el-form-item>
            <el-form-item label="负责人">{{handleEmpty(project.person)}}</el-form-item>

            <el-form-item label="开具公司" prop="partyB">
                <el-select v-model="invoice.partyB" :filterable="true" style="width: 320px">
                    <el-option v-for="i in partyBList" :value="i.code" :label="i.name" :key="i.code"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="价税合计" prop="sum">
                <el-input v-model="invoice.sum" type="number">
                    <template slot="append">元</template>
                </el-input>
            </el-form-item>
            <el-form-item label="税率" prop="rate">
                <!--<el-input v-model="invoice.rate"></el-input>-->
                <el-select v-model="invoice.rate" :filterable="true" style="width: 320px">
                    <el-option v-for="i in taxList" :value="i.value" :label="i.name" :key="i.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="金额">{{price}}</el-form-item>
            <el-form-item label="税额">{{tax}}</el-form-item>
            <el-form-item label="现金税款" prop="cash">
                <el-input v-model="invoice.cash" type="number">
                    <template slot="append">元</template>
                </el-input>
            </el-form-item>
            <el-form-item label="刷卡税款" prop="card">
                <el-input v-model="invoice.card" type="number">
                    <template slot="append">元</template>
                </el-input>
            </el-form-item>
            <el-form-item label="备注" prop="ps">
                <el-input v-model="invoice.ps" type="textarea"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm">立即创建</el-button>
                <el-button @click="resetForm">清空</el-button>
            </el-form-item>
        </el-form>
        <el-dialog title="选择合同" :visible="chooseDialog" :show-close="false" :close-on-click-modal="false">
            <ProjectList :choose="true" api="/project/allProject" @choose-item="finishChoose"></ProjectList>
        </el-dialog>

    </div>

</template>

<script>
    import {tax} from "../../tax";
    import {partyB} from "../../partyB";
    import ProjectList from "../../components/ProjectList";
    import {LimeHttp} from "../../ajax";

    export default {
        name: "NewInvoice",
        components: {ProjectList},
        data() {
            return {
                invoice: {
                    id: '',
                    projectId: '',
                    partyB: '',
                    sum: '',
                    rate: '',
                    cash: '0',
                    card: '0',
                    ps: ''
                },
                rule: {
                    id: [{required: true, message: '请填写发票号码'}, {min: 8, max: 8, message: "发票号码为8位", trigger: "change"}],
                    projectId: [{required: true, message: '不能为空！'}],
                    partyB: [{required: true, message: '不能为空！'}],
                    sum: [{required: true, message: '不能为空！'}],
                    rate: [{required: true, message: '不能为空！'}],
                    cash: [{required: true, message: '不能为空！'}],
                    card: [{required: true, message: '不能为空！'}],

                },
                taxList: tax,
                partyBList: partyB,
                chooseDialog: false,
                project: {},
                loading: false

            }
        },
        computed: {
            price() {
                let ret = parseFloat(this.invoice.sum) / (1 + parseFloat(this.invoice.rate));
                if (isNaN(ret)) {
                    return "###！无法计算！###";
                } else {
                    return ret.toFixed(2) + '元';
                }
            },
            tax() {
                let ret = parseFloat(this.invoice.sum) - (parseFloat(this.invoice.sum) / (1 + parseFloat(this.invoice.rate)));
                if (isNaN(ret)) {
                    return "###！无法计算！###";
                } else {
                    return ret.toFixed(2) + '元';
                }
            }
        },
        methods: {
            handleEmpty(value) {
                if (value == null) {
                    return "请选择合同";
                } else {
                    return value;
                }
            },


            finishChoose(row) {
                this.invoice.projectId = row.id;
                this.chooseDialog = false;
                this.project = row;
            },
            submitForm() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.loading = true;

                        LimeHttp.post("/invoice/newInvoice", this.invoice)
                            .then((resp) => {
                                this.loading = false;
                                this.$message(resp.data.msg);
                                if (resp.data.code == 0) {
                                    this.$alert("发票开具成功");
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
                this.$refs['form'].resetFields();
            }
        },
    }
</script>

<style scoped>

</style>