const axios = require("axios")
const PORT = 8080

const options = {
  url: 'http://localhost:8080/',
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json;charset=UTF-8'
  },
  data: {
    field1: "76eiuehkljehgluetyoi",
    field2: "tsuytsuyglskjgskjduyiod",
    field3: "oiududhkjdhkljduydjhgdjh",
    field4: 123456,
    field5: 4654646489,
    field6: 45878.547,
    field7: 21313213.65487,
    field8: true
  }
};

const r = []

const testUnary = async (req) => {
  axios(options)
    .then(response => {
      r.push( response.status )
    })
}

const main = async () => {
  const initTime = new Date().getTime()    
  for (let i=0; i<10000; i++) {
    setImmediate( () => testUnary() )
  }
  const checkloop = () => {
    if ( r.length < 10000 ) {
      setTimeout( checkloop, 10 )
    } else {
      console.log(new Date().getTime() - initTime, r.length)
    }
  }
  
  setTimeout( checkloop, 100 )

}

main()
