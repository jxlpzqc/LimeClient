<template>
    <div v-loading="loading">
        <el-form style="width: 500px">
            <el-form-item label="查找合同" label-width="90px">
                <el-input v-model="searchText" placeholder="项目名称/甲方名称/负责人" @blur="getData">
                    <el-button slot="append" type="primary" @click="getData">查询</el-button>
                </el-input>
            </el-form-item>

        </el-form>
        <el-table
                :data="tableData"
                style="width: 100%">
            <!--<el-table-column type="expand">-->
            <!--<template slot-scope="props">-->
            <!--<el-form label-position="left" inline class="table-expand">-->
            <!--<el-form-item label="合同编号"><span>{{ props.row.id }}</span></el-form-item>-->
            <!--<el-form-item label="项目名称"><span>{{ props.row.name }}</span></el-form-item>-->
            <!--<el-form-item label="甲方"><span>{{ getpartyAName(props.row.partyA) }}</span></el-form-item>-->
            <!--<el-form-item label="乙方"><span>{{ props.row.partyB }}</span></el-form-item>-->
            <!--<el-form-item label="合同金额"><span>{{ props.row.price }}</span></el-form-item>-->
            <!--<el-form-item label="合同日期"><span>{{ props.row.date }}</span></el-form-item>-->
            <!--<el-form-item label="施工地点"><span>{{ getRegionName(props.row.region) }}</span></el-form-item>-->
            <!--<el-form-item label="负责人"><span>{{ props.row.person }}</span></el-form-item>-->
            <!--<el-form-item label="联系电话"><span>{{ props.row.phone }}</span></el-form-item>-->

            <!--</el-form>-->
            <!--</template>-->
            <!--</el-table-column>-->

            <el-table-column label="合同编号" width="90" prop="id"></el-table-column>
            <el-table-column label="项目名称" width="180" prop="name"></el-table-column>

            <el-table-column label="甲方" width="180" prop="partyA"></el-table-column>
            <el-table-column label="乙方" width="180">
                <template slot-scope="scope">
                    {{getpartyBName(scope.row.partyB)}}
                </template>
            </el-table-column>
            <el-table-column label="合同金额" width="90" prop="price"></el-table-column>
            <el-table-column label="合同日期" width="100" prop="date"></el-table-column>
            <el-table-column label="负责人" width="70" prop="person"></el-table-column>
            <el-table-column label="联系电话" width="100" prop="phone"></el-table-column>
            <el-table-column label="施工地点" width="180">
                <template slot-scope="scope">
                    {{getRegionName(scope.row.region)}}
                </template>
            </el-table-column>
            <el-table-column label="施工时间" width="180">
                <template slot-scope="scope">
                    {{scope.row.during[0]}} 至 {{scope.row.during[1]}}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200px">
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
    import {LimeHttp} from "../../ajax";
    import {getpartyBName} from "../../partyB";
    import {getRegionName} from "../../region";
    import EditProject from "../../components/EditProject";

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
                isEdit: false
            }
        },
        methods: {
            getData() {
                this.loading = true;
                LimeHttp.post("/project/myProject", {
                    pageNumber: this.currentPage - 1,
                    searchText: this.searchText
                }).then((resp) => {
                    if (resp.data.code == -400) {
                        this.$emit("no-login");
                        return
                    }
                    this.loading = false;
                    console.log(resp.data.msg);
                    this.pageCount = resp.data.data.total;
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
                    LimeHttp.post('/project/deleteProject', {
                        id: row.id
                    }).then((resp) => {
                        this.$message(resp.data.msg)
                        if (resp.data.code == 0) {
                            this.tableData.splice(index, 1);
                        }
                    });
                });
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