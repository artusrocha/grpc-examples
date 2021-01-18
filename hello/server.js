const messages = require("./lib/proto/hello_pb")
const services = require("./lib/proto/hello_grpc_pb")
const grpc = require("grpc")

const PORT = 5000

const mkResponse = (who) => {
    const resp = new messages.HelloResponse()
    resp.setMsg( "Hello " + who )
    return resp
}

const sayHello = (call, callback) => {
    const resp = mkResponse( call.request.getName() )
    callback(null, resp)
}

const sayHelloNTimes = (call) => {
    const times = call.request.getTimes()
    for(let i=0; i<times; i++) {
      const resp = mkResponse( call.request.getName() )
      call.write(resp)
    }
    call.end()
}

const sayHelloForAll = (call, callback) => {
    const names = []
    call.on('data', (data) => {
      names.push( data.getName() )
    })
    call.on('end', () => {
      callback(null, mkResponse( names.join(', ') ))
    })
}

const sayHelloForEach = (call, callback) => {
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
        sayHelloForAll: sayHelloForAll,
        sayHelloForEach: sayHelloForEach
    })
    server.bind('0.0.0.0:'+PORT, grpc.ServerCredentials.createInsecure())
    console.log('starting grpc server on port', PORT)
    server.start()
}

main()
