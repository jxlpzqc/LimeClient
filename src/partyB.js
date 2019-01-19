export const partyB =[
    {code:'LP',name:'乐平公司LP'},
    {code:'JC',name:'江西景诚建设有限公司JC'}

]

export function getpartyBName(code){
    for(let ind of partyB){
        if(ind.code == code){
            return ind.name;
        }
    }
    return '未知';
}

export function getpartyBCode(name){
    for(let ind of partyB){
        if(ind.name == name){
            return ind.code;
        }
    }
    return '未知';
}