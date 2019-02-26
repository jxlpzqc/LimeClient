<template>
    <div>
        <el-steps :space="200" :active="stepActive" finish-status="success">
            <el-step title="选择单据号"></el-step>
            <el-step title="扣款"></el-step>
            <el-step title="处理信息"></el-step>
            <el-step title="完成"></el-step>
        </el-steps>
        <div>
            <template v-if="stepActive==0">
                <ArriveSetList></ArriveSetList>
            </template>
            <template v-if="stepActive==1"></template>
            <template v-if="stepActive==2"></template>
            <template v-if="stepActive==3"></template>
        </div>
    </div>

</template>

<script>
    import ArriveSetList from "../../components/ArriveSetList";
    export default {
        name: "TaxArrive",
        components: {ArriveSetList},
        data() {
            return {
                stepActive:0,
                taxArrive: {
                    invoiceID : '',
                    method : '2',
                    money : 0
                }
            }
        },
    }
</script>

<style scoped>

</style>