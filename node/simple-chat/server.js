const PROTO_PATH = __dirname + "/protos/chat.proto"
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
const helloHandler = function(call) {
    call.on("data", (resp) => {
        console.log(resp)
        call.write({
            id: "q",
            name: "a",
            message: "z"
        })
    })
    //console.log(">>> Name: ", call.request.name)
    // delay response on 1000 ms
    /*for (let i=0; i<=5;i++) {
        console.log("loop", i)
        setTimeout( () => {
            console.log("loop timeout", i) 
            call.write({message: "Hello " + i})
            //if(i==3) call.end()
        }, 1000*i)
    }*/
}

const main = async function(){
    const server = new grpc.Server()
    server.addService(proto.hello.Greeter.service, {hello: helloHandler})
    server.bind('0.0.0.0:3000', grpc.ServerCredentials.createInsecure())
    console.log("starting server...")
    server.start()
}

main()