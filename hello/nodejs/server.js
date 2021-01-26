const messages = require("./lib/proto/hello_pb")
const services = require("./lib/proto/hello_grpc_pb")
const grpc = require("grpc")

const argv = require("./lib/server_args.js")
const PORT = argv.port

const mkResponse = (who) => {
    const resp = new messages.HelloResponse()
    resp.setMsg( "Hello " + who )
    return resp
}

const sayHello = (call, callback) => {
    console.log("sayHello # Port: ", PORT)
    const resp = mkResponse( call.request.getName() )
    callback(null, resp)
}

const sayHelloNTimes = (call) => {
    console.log("sayHelloNTimes # Port: ", PORT)
    const times = call.request.getTimes()
    for(let i=0; i<times; i++) {
      const resp = mkResponse( call.request.getName() )
      call.write(resp)
    }
    call.end()
}

const sayHelloToEveryOne = (call, callback) => {
    console.log("sayHelloToEveryOne # Port: ", PORT)
    const names = []
    call.on('data', (data) => {
      names.push( data.getName() )
    })
    call.on('end', () => {
      callback(null, mkResponse( names.join(', ') ))
    })
}

const sayHelloToEachOne = (call, callback) => {
  console.log("sayHelloToEachOne # Port: ", PORT)
  call.on('data', (data) => {
    call.write( mkResponse( data.getName() ) )
  })
  call.on('end', () => call.end())
}

const main = () => {
    const server = new grpc.Server()
    server.addService(services.GreeterService, {
        sayHello: sayHello,
        sayHelloNTimes: sayHelloNTimes,
        sayHelloToEveryOne: sayHelloToEveryOne,
        sayHelloToEachOne: sayHelloToEachOne
    })
    server.bind('0.0.0.0:'+PORT, grpc.ServerCredentials.createInsecure())
    console.log('starting grpc server on port', PORT)
    server.start()
}

main()
