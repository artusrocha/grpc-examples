const PROTO_PATH = __dirname + "/protos/chat.proto"
const grpc = require("grpc")
const protoloader  = require("@grpc/proto-loader")
const readline = require("readline")

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

const reader = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const loop = function(client) {
    let name = "world"
    reader.question("What is your name? ", (answer) => {
        name = answer || name
        const call = client.hello({name: name})
        /*, (err, resp) => {
            loop(client)
        })*/

        call.on('data', (resp) => {
            console.log(resp.msg)
        })

        call.on('end', () => {
            console.log('end')
            loop(client)
        })
    })
}

const main = function(){
    const client = new proto.hello.Greeter( '0.0.0.0:3000',
                                            grpc.credentials.createInsecure())
    console.log("starting cliente...")
    loop(client)
}

main()