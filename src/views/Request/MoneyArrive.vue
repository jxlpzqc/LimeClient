<template>
    <div v-loading="loading">
        <el-steps :space="200" :active="stepActive" finish-status="success">
            <el-step title="输入收款金额"></el-step>
            <el-step title="选择发票"></el-step>
            <el-step title="处理到账信息"></el-step>
            <el-step title="完成"></el-step>
        </el-steps>
        <div style="margin-top:20px;">
            <template v-if="stepActive == 0">
                <el-form label-width="80px" class="basic-form">
                    <el-form-item label="收款金额" required>
                        <el-input v-model="money" type="number">
                            <template slot="append">元</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="收款账户" required>
                        <!--<el-select v-model="account" style="width:320px"></el-select>-->
                        <el-input v-model="account"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="finishStepOne">下一步</el-button>

                    </el-form-item>
                </el-form>
            </template>
            <template v-else-if="stepActive == 1">
                <InvoiceList :choose="true" @selection-change="select" @no-login="$emit('no-login')"></InvoiceList>
                <p style="margin: 10px">您已经选择{{selectCount}}个项目</p>
                <el-button @click="previousStep">上一步</el-button>
                <el-button type="primary" @click="finishStepTwo">下一步</el-button>
            </template>
            <template v-else-if="stepActive == 2">
                <p style="margin: 10px;">总共收到{{moneyParse}}元。你可以选择一下方式自动分配</p>
                <el-button @click="arrangeByTime" size="small">按时间</el-button>
                <el-button @click="arrangeByDivision" size="small">按比例</el-button>
                <el-table :data="selection" style="width: 100%">
                    <el-table-column label="发票号" width="90" prop="id"></el-table-column>
                    <el-table-column label="负责人" width="70" prop="person"></el-table-column>
                    <el-table-column label="开具公司">
                        <template slot-scope="scope">
                            {{getpartyBName(scope.row.partyB)}}
                        </template>
                    </el-table-column>
                    <el-table-column label="项目名称" width="100" prop="projectName"></el-table-column>
                    <el-table-column label="甲方" width="100" prop="partyA"></el-table-column>
                    <el-table-column label="负责人" width="100" prop="person"></el-table-column>
                    <el-table-column label="价税总计" width="100" prop="sum"></el-table-column>
                    <el-table-column label="到账金额" prop="arrive"></el-table-column>
                    <el-table-column label="未到账金额">
                        <template slot-scope="scope">
                            {{ (parseFloat(scope.row.sum) - parseFloat(scope.row.arrive)).toFixed(2)}}
                        </template>
                    </el-table-column>
                    <!--<el-table-column label="税率" width="100" prop="rate"></el-table-column>-->
                    <!--<el-table-column label="金额" width="100" prop="price"></el-table-column>-->
                    <!--<el-table-column label="税额" width="100" prop="tax"></el-table-column>-->
                    <el-table-column label="时间" width="180" prop="time"></el-table-column>
                    <!--<el-table-column label="已交税款" width="100" prop="taxarrive"></el-table-column>-->
                    <el-table-column label="备注" prop="ps"></el-table-column>


                    <el-table-column label="分配" width="120">
                        <el-input slot-scope="scope" v-model="arrange[scope.$index]"></el-input>
                    </el-table-column>

                </el-table>
                <p style="margin:10px">当前已经分配:{{showArrangeSum}}元</p>
                <p style="margin:10px">剩余:{{showArrangeLeft}}元</p>
                <el-button @click="previousStep">上一步</el-button>
                <el-button type="primary" @click="submit" :disabled="!isAbled">提交</el-button>
                <span style="color: red;margin-left: 20px;">{{errorMsg}}</span>
            </template>
            <template v-else-if="stepActive == 3">
                <el-alert
                        title="收款登记成功"
                        type="success"
                        description="现在你可以打印收款结果"
                        :closable="false"
                        show-icon>
                </el-alert>
                <el-button type="primary" v-print="'#printAera'">打印结果</el-button>
                <div id="printAera" class="print-aera" style="@media screen {
                    display: none;
                }">
                    <h1>收款结果</h1>


                </div>
            </template>
        </div>
    </div>
</template>

<script>
    import ProjectList from "../../components/ProjectList";
    import InvoiceList from "../../components/InvoiceList";
    import {getpartyBName} from "../../partyB";
    import {LimeHttp} from "../../ajax";

    export default {
        name: "MoneyArrive",
        components: {InvoiceList, ProjectList},
        data() {
            return {
                stepActive: 0,
                project: [],
                money: '',
                account: '',
                errorMsg: '',
                selection: [],
                arrange: [],
                loading: false,
            }
        },
        methods: {
            finishStepOne() {
                if (isNaN(this.moneyParse)) {
                    this.$message("请输入正确的收款金额");
                } else {
                    this.nextStep();
                }
            },
            finishStepTwo() {
                if (this.selectCount == 0) {
                    this.$message("请选择发票");
                } else {
                    this.arrange = [];
                    for (let i = 0; i < this.selectCount; i++) {
                        this.arrange.push(0);
                    }
                    this.nextStep();
                }
            },
            nextStep() {
                this.stepActive++;
            },
            previousStep() {
                this.stepActive--;
            },
            chooseProject(project) {
                this.project = project;
                this.nextStep();
            },
            select(value) {
                this.selection = JSON.parse(JSON.stringify(value));
            },
            getpartyBName: getpartyBName,
            arrangeByTime() {
                //let timepool = [];
                this.selection.sort((a, b) => {
                    let at = new Date(a.time)
                    let bt = new Date(b.time)
                    if (at > bt) {
                        return 1;
                    } else {
                        return -1;
                    }
                })
                let ret = this.moneyParse;
                let newArrange = [];
                for (let i = 0; i < this.selectCount; i++) {
                    if (ret > 0) {
                        let retI = parseFloat((parseFloat(this.selection[i].sum) - parseFloat(this.selection[i].arrive)).toFixed(2))

                        newArrange[i] = parseFloat(Math.min(ret, retI).toFixed(2))

                        ret -= newArrange[i]
                    } else {
                        newArrange[i] = 0
                    }
                }
                this.arrange = newArrange;

            },
            arrangeByDivision() {
                let ret = this.moneyParse;
                let newArrange = [];
                let sum = 0;
                this.selection.forEach((value => {
                    sum += parseFloat((value.sum - value.arrive).toFixed(2));
                }))

                for (let i = 0; i < this.selectCount - 1; i++) {
                    let retI = parseFloat((parseFloat(this.selection[i].sum) - parseFloat(this.selection[i].arrive)).toFixed(2))

                    newArrange[i] = parseFloat(((retI / sum) * this.moneyParse).toFixed(2));
                    ret -= newArrange[i]
                }
                newArrange[this.selectCount - 1] = parseFloat(ret.toFixed(2));
                this.arrange = newArrange;
            },
            submit() {
                if (this.isAbled) {
                    this.loading = true;
                    let postData = [];
                    for (let i = 0; i < this.selectCount; i++) {
                        let x = {id: this.selection[i].id, money: this.arrange[i]};
                        postData.push(x);
                    }
                    LimeHttp.post("/invoice/moneyArrive", {
                        accountID: this.account,
                        list: postData
                    }).then((resp) => {
                        this.loading = false;
                        this.$message(resp.data.msg);
                        if (resp.data.code == 0) {
                            this.nextStep();
                        } else if (resp.data.code == -401) {
                            this.$emit('no-login');
                        } else {
                            this.$alert(resp.data.msg);
                        }
                    }).catch(() => {
                        this.loading = false;
                        this.$message("服务器出现异常");
                    })
                }
            },

        },
        computed: {
            selectCount() {
                return this.selection.length;
            },
            moneyParse() {

                return parseFloat(parseFloat(this.money).toFixed(2));
            },
            arrangeSum() {
                let sum = 0;
                this.arrange.forEach((value => {
                    sum += parseFloat(parseFloat(value).toFixed(2));
                }))
                return sum;

            },
            showArrangeSum(){
                if (isNaN(this.arrangeSum)) {
                    return "#出错#";
                } else {
                    return this.arrangeSum.toFixed(2);
                }
            },
            arrangeLeft() {
                let ret = this.moneyParse - this.arrangeSum;
                return ret;
            },
            showArrangeLeft(){
                if (isNaN(this.arrangeLeft)) {
                    return "#出错#";
                } else {
                    return this.arrangeLeft.toFixed(2);
                }
            },
            isAbled() {
                for (let i = 0; i < this.selectCount; i++) {
                    let retI = parseFloat((parseFloat(this.selection[i].sum) - parseFloat(this.selection[i].arrive)).toFixed(2))

                    if (retI < this.arrange[i]) {
                        this.errorMsg = "存在分配值大于未到账金额的数据！";
                        return false;
                    } else if (this.arrangeLeft != 0) {
                        this.errorMsg = "没有分配完全！"
                        return false;
                        0
                    }
                    this.errorMsg = '';
                    return true;
                }
            }
        },
    }
</script>

<style>
    @media screen{
        .print-aera{
            display: none;
        }
    }
    @media print{
        .print-aera{
            display: block;
        }
    }

</style>