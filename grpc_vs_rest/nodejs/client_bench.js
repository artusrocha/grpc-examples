const messages = require("./lib/proto/test_pb")
const services = require("./lib/proto/test_grpc_pb")
const grpc = require("grpc")

const PORT = 6000

const remote = new services.TestClient('localhost:'+PORT, 
        grpc.credentials.createInsecure() )

const r = []

const testUnary = async (req) => {
    remote.testUnary(req, function(err, response) {
//        console.log('# unaryUnary # Remote said: ', response.getMsg())
        r.push(response.getField1())
    })
    //r.push("z")
}

const mkRequest = () => {
  const req = new messages.TestRequest()
  req.setField1("786wiytlkwhlkw")
  req.setField2("76tywkhjgwlkjghiutysdkhg")
  req.setField3("876yglkhelkjehlkeuhlkj")
  req.setField4(12345)
  req.setField5(321564798798)
  req.setField6(123213.2132)
  req.setField7(4654654646546.67978765)
  req.setField8(true)
  return req
}

const main = async () => {
  const req = mkRequest()
  const initTime = new Date().getTime()    
  for (let i=0; i<10000; i++) {
    setImmediate( () => testUnary(req) )
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
