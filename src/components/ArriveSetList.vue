<template>
    <div v-loading="loading" style="margin-top:20px;">
        <el-form style="width: 500px" label-width="80px">
            <el-form-item label="施工期限" prop="date">
                <el-date-picker
                        v-model="during"
                        type="datetimerange"
                        range-separator="至"
                        value-format="yyyy-MM-dd hh:mm:ss"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        style="width: 420px">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="金额">
                <el-input v-model="money" placeholder="请输入单据金额，不填则不做筛选"></el-input>
            </el-form-item>
        </el-form>
        <el-table :data="tableData">
            <el-table-column label="单据号"></el-table-column>
            <el-table-column label="金额"></el-table-column>
            <el-table-column label="收款时间"></el-table-column>
        </el-table>
    </div>
</template>

<script>
    import {LimeHttp} from "../ajax";
    import moment from 'moment'

    export default {
        name: "ArriveSetList",
        data() {
            return {
                tableData: [],
                during: ["2000-01-01 00:00:00", moment().format('YYYY-MM-DD hh:mm:ss')],
                money:'',
                loading:true
            }
        },
        methods: {
            getData() {
                this.loading = true;
                LimeHttp.post("/invoice/getArriveSetList",{
                    start: this.during[0],
                    end:this.during[1],
                    sum:this.money,
                }).then((resp)=>{
                    this.loading = false;
                    if(resp.data.code == 0){
                        this.tableData =  resp.data.data
                    }
                }).catch(()=>{
                    this.$alert("服务器发生异常！")
                })
            }
        },
        mounted() {
            this.getData()
        }
    }
</script>

<style scoped>

</style>