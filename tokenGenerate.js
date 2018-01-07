'use strict';


const random = (max) => {
    let res = Math.floor(Math.random()*100);
    res >= max ? res = res - max : res;
    return res
};

const string = '1234567890qwertyuiopasdfghjklxcvbnm0987654321ASDFGHJKLPOIUYTREWQZXCVBNM';


const key = () =>{

    let key = '';

    for (let i = 0; i<16;i++){
        key = key + string[random(71)]
    }
    return key;
}

const result = key();

module.exports.generate = result;