<template>
    <div v-loading="loading">
        <el-form style="width: 500px">
            <el-form-item label="查找发票" label-width="90px">
                <el-input v-model="searchText" placeholder="发票号" @blur="getData">
                    <el-button slot="append" type="primary" @click="getData">查询</el-button>
                </el-input>
            </el-form-item>

        </el-form>
        <el-table
                :data="tableData"
                style="width: 100%"
                @selection-change="selectionChange"
        ref="selectTable">

            <el-table-column type="selection" v-if="choose"></el-table-column>

            <el-table-column label="发票号" width="90" prop="id"></el-table-column>
            <el-table-column label="项目名称" width="180" prop="name" v-if="!choose"></el-table-column>
            <el-table-column label="负责人" width="70" prop="person" v-if="!choose"></el-table-column>

            <el-table-column label="开具公司" width="180">
                <template slot-scope="scope">
                    {{getpartyBName(scope.row.partyB)}}
                </template>
            </el-table-column>
            <el-table-column label="项目名称" width="100" prop="projectName"></el-table-column>
            <el-table-column label="甲方" width="100" prop="partyA"></el-table-column>
            <el-table-column label="负责人" width="100" prop="person"></el-table-column>
            <el-table-column label="价税总计" width="100" prop="sum"></el-table-column>
            <el-table-column label="到账金额" prop="arrive"></el-table-column>


            <el-table-column label="税率" width="100" prop="rate"></el-table-column>

            <el-table-column label="金额" width="100" prop="price"></el-table-column>
            <el-table-column label="税额" width="100" prop="tax"></el-table-column>


            <el-table-column label="已交税款" width="100" prop="taxarrive"></el-table-column>
            <el-table-column label="时间" width="180" prop="time"></el-table-column>

            <el-table-column label="备注" prop="ps"></el-table-column>
            <el-table-column label="操作" width="200px" v-if="!choose">
                <template slot-scope="scope">
                    <template v-if="scope.row.editable==true">
                        <el-button
                                size="mini"
                                @click="handleEdit(scope.row)">编辑
                        </el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                @click="handleDelete(scope.$index,scope.row)">删除
                        </el-button>
                    </template>

                    <template v-else>
                        无法修改
                    </template>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                :current-page.sync="currentPage"
                :page-size="10"
                @current-change="getData()"
                layout="prev, pager, next, jumper"
                :total="pageCount">
        </el-pagination>
        <EditProject :isShow="isEdit" :project="editProject" @no-login="$emit('no-login')" @success="handleSuccessEdit"
                     @close="handleClose"></EditProject>
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
        components: {EditProject},
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
                    pageNumber: this.currentPage - 1,
                    searchText: this.searchText,
                    projectID: this.projectID
                }).then((resp) => {
                    if (resp.data.code == -400) {
                        this.$emit("no-login");
                        return
                    }
                    this.loading = false;
                    console.log(resp.data.msg);
                    this.pageCount = resp.data.data.total;

                    let copy = JSON.parse(JSON.stringify(this.selection));
                    this.tableData = resp.data.data.data;

                    //谜之处理

                    setTimeout(()=>{
                        this.tableData.forEach((v1)=>{

                            copy.forEach((v2)=>{
                                if(v1.id == v2.id){
                                    console.log("true")
                                    this.$refs['selectTable'].toggleRowSelection(v1);
                                }
                            })
                        })
                    },100)



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
            handleClose() {
                this.isEdit = false;
            },
            handleEdit(row) {
                this.editProject = row;
                this.isEdit = true;
            },
            handleSuccessEdit() {
                this.isEdit = false;
                this.getData();
            },
            handleDelete(index, row) {
                this.$confirm("你确定要删除这个合同么").then(() => {
                    console.log(index)
                    LimeHttp.post('/invoice/deleteInvoice', {
                        id: row.id
                    }).then((resp) => {
                        this.$message(resp.data.msg)
                        if (resp.data.code == 0) {
                            this.tableData.splice(index, 1);
                        }
                    });
                });
            },
            initSelection(){

            },
            selectionChange(select) {
                //handle Add
                select.forEach((v1) => {
                    let flag = true;
                    this.selection.forEach((v2) => {
                        if (v1.id == v2.id) {
                            flag = false;
                        }
                    })
                    if (flag) {
                        this.selection.push(v1)
                    }
                })
                //handle delete
                this.tableData.forEach((v1) => {
                    this.selection.forEach((v2,index) => {
                        if (v1.id == v2.id) { //in the table and in the selection object
                            let flag2 = true;
                            select.forEach((v3) => {  //check whether it is selected
                                if (v3.id == v1.id) {
                                    flag2 = false;
                                }
                            })
                            if(flag2){
                                this.selection.splice(index,1)
                            }
                        }
                    })
                })
                //console.log(select)

                this.$emit('selection-change', this.selection);
            },
            //getRegionName: getRegionName,
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