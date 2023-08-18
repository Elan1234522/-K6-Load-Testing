import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';
import { SharedArray } from "k6/data";
import http from 'k6/http';
import { check } from 'k6';



const csvData = new SharedArray("another data name", function () {
    return papaparse.parse(open('./request.csv'), { header: true }).data;
});
let count = 1;

const BASE_URL = 'https://p2pint.finfotech.co.in:9443'

export const options = {
    // thresholds: {
    //     http_req_failed: ['rate<0.01'], // http errors should be less than 1% 
    //     http_req_duration: ['p(50)<200'], // 50% of requests should be below 200ms
    //     http_req_duration: ['p(95)<900'], // 95% of requests should be below 200ms
    // },
    vus: 1,
    duration: '30s',
}

export default function () {

    let body = getRandonId();
    let url = `${BASE_URL}/usrmgmt/v2/generateotp`;
    let headers = { 'Content-Type': 'application/json' };
    let res = http.post(url, JSON.stringify(body), { headers: headers });
    console.log(JSON.parse(res.body));
    let responseBody=JSON.parse(res.body);        
    const mobile=responseBody.msgdata.mobileref;
    const email=responseBody.msgdata.emailref;
    console.log(`${res.status} - ${url}`);



    check(res, {
        'status is 200': (r) => r.status === 200,


    });
    if(res){
        res.status===200?register(mobile,email):console.log("Error occured in otp generation")

    }
}

function getRandonId() {
    if (count < csvData.length) {
        count++;
        let body = csvData[count];
        let data = {
            mobilenumber: body.Mobile,
            email: body.EmailID,
            pan: body.PAN,
            utype: 3
        }
        return data;

    }
    
}

function register( mobile, EMail) {
    let data=csvData[count];
    console.log("i m register")
    const register = `${BASE_URL}/usrmgmt/registeruser`;

    const registerbody = {
        "name": "Test",
        "mobilenumber":data.Mobile,
        "email": data.EmailID,
        "pannumber": data.PAN,
        "otpm": 654321,
        "otpe": 654321,
        "dateofbirth": "1990-11-06",
        "utype": 3,
        "loginpassword": "test@123",
        "gender": "M",
        "mobileref": mobile,
        "emailref": EMail,
        "regmode": 1
    }

    const registerheaders = {
        'Content-Type': 'application/json',
    }
    const register_response = http.post(register, JSON.stringify(registerbody), { headers: registerheaders });

    const Reg_body = JSON.parse(register_response.body);
    console.log('heyyyyy resgitration------------',register_response)
}
