import http from 'k6/http';
import { sleep } from 'k6';


export let options = {
    vus: 1,
    duration: '1s',
  };
const BASE_URL = 'https://ilpuat.finfotech.co.in';

export default function () {
    const Login = BASE_URL + '/usrmgmt/p2pusers/v2/login';
  
    const body = JSON.stringify({
      "username": "6380695905",
      "userpassword": "Test@1234",
      "usertype": 3
    });
  
    const login_header = {
      headers: {
        'Content-Type': 'application/json',
      }
    };
    
    const login_req = http.post(Login, body, login_header);
    const login_body=JSON.parse(login_req.body);
    if(login_req.status==200){
      
  console.log(login_body);
       const token = login_body.data.accessToken;
       const Bor_ID=login_body.data.userName;

    //    console.log(token);
       console.log(Bor_ID);

       const Transaction_url=BASE_URL+'/lsp/getborrowertxn';
       const Transaction_body =JSON.stringify({
        
            "borrowerid": Bor_ID,
            "fromdate": "2023-07-01",
            "todate": "2023-08-01"
          
     });
     const Trans_headers={
        headers:{
            'Authorization': 'Bearer ' + token, // Add a space after 'Bearer'
            'Content-Type': 'application/json',
            'Accept':'application/json'
        }
     };
     const Transaction_req=http.post(Transaction_url,Transaction_body,Trans_headers)
//console.log('Request =====',Transaction_req);
const Transaction=JSON.parse(Transaction_req.body)
console.log('data===',Transaction);


    }
    else{
        console.error(login_body)
    }
}