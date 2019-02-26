<template>
    <div v-loading="loading">
        <el-form style="width: 500px">
            <el-form-item label="查找单据" label-width="90px">
                <el-input v-model="searchText" placeholder="单据号/发票号/开票操作员" @blur="getData">
                    <el-button slot="append" type="primary" @click="getData">查询</el-button>
                </el-input>
            </el-form-item>

        </el-form>
        <el-table
                :data="tableData"
                style="width: 100%"
                ref="selectTable">

            <el-table-column v-if="select">
                <el-button slot-scope='scope' @click="$emit('select',scope.row)">选择</el-button>
            </el-table-column>

            <el-table-column label="所有发票" type="expand">

            </el-table-column>
            <el-table-column label="单据号" prop="id"></el-table-column>
            <el-table-column label="开票人" prop="person"></el-table-column>
            <el-table-column label="金额" prop="person"></el-table-column>

        </el-table>


    </div>
</template>

<script>
    import {
        provinceAndCityData,
        regionData,
        provinceAndCityDataPlus,
        regionDataPlus,
        CodeToText,
        TextToCode
    } from 'element-china-area-data';
    import {LimeHttp} from "../ajax";
    import {getpartyBName} from "../partyB";
    import {getRegionName} from "../region";
    import EditProject from "./EditProject";

    export default {

        data() {
            return {
                loading: true,
                currentPage: 1,
                searchText: "",
                tableData: [],
                pageCount: 0,
                editProject: {},
                isEdit: false,
                selection: []
            }
        },

        props: {
            api: {
                type: String,
                default: '/invoice/getInvoice'
            },
            choose: {
                type: Boolean,
                default: false
            },
            projectID: {
                default: '%'
            }
        },
        methods: {
            getData() {
                this.loading = true;
                LimeHttp.post(this.api, {
                    startTime:this.startTime,
                    endTime:this.endTime,
                }).then((resp) => {
                    if (resp.data.code == -400) {
                        this.$emit("no-login");
                        return;
                    }
                    this.loading = false;
                    console.log(resp.data.msg);
                    this.pageCount = resp.data.data.total;

                    let copy = JSON.parse(JSON.stringify(this.selection));
                    this.tableData = resp.data.data.data;
                    // for (let i of this.tableData) {
                    //     i.region = CodeToText[i.region.slice(0, 2) + '0000'] + '-' +
                    //         CodeToText[i.region.slice(0, 4) + '00'] + '-' +
                    //         CodeToText[i.region];
                    //     i.partyA = getpartyAName(i.partyA);
                    // }
                }).catch(() => {
                    this.$alert("服务器发生异常！")
                })
            },
            getRegionName: getRegionName,
            getpartyBName: getpartyBName,
        },

        mounted() {
            this.getData();
        }
    }
</script>

<style>
    .table-expand {
        font-size: 0;
        width: 800px;
    }

    .table-expand label {
        width: 90px;
        color: #99a9bf;
    }

    .table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
</style>