const PROTO_PATH = __dirname + "/protos/hello.proto"
const grpc = require("grpc")
const protoloader  = require("@grpc/proto-loader")

const packageDefinition = protoloader.loadSync( 
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    }
)

const proto = {
    hello: grpc.loadPackageDefinition(packageDefinition).helloworld
}
const helloHandler = function(call, callback) {
    console.log(">>> Name: ", call.request.name)
    // delay response on 1000 ms
    setTimeout( () => callback(null, {msg: "Hello " + call.request.name}), 1000)
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}   

const main = async function(){
    const server = new grpc.Server()
    server.addService(proto.hello.Greeter.service, {hello: helloHandler})
    server.bind('0.0.0.0:3000', grpc.ServerCredentials.createInsecure())
    console.log("starting server...")
    server.start()
}

main()