const messages = require("./lib/proto/hello_pb")
const services = require("./lib/proto/hello_grpc_pb")
const grpc = require("grpc")

const PORT = 60000

const unaryUnary = (remote) => {
    const req = new messages.HelloRequest()
    req.setName("Jonas")
    remote.sayHello(req, function(err, response) {
        console.log('# unaryUnary # Remote said: ', response.getMsg())
    })
}

const unaryStream = (remote) => {
    const req = new messages.HelloRequest()
    req.setName("Maria")
    req.setTimes(5)
    let call = remote.sayHelloNTimes(req)
    call.on('data',function(response){
        console.log('# unaryStream # Remote said: ', response.getMsg())
    })
    call.on('end',function(){
        console.log('# unaryStream # End of stream');
    })
}

const streamUnary = (remote) => {
    const names = ['Lucas', 'Marcela', 'Alice', 'Artur', 'João']
    const call = remote.sayHelloToEveryOne(function(err, response) {
        console.log('# streamUnary # Remote said: ', response.getMsg())
    })
    names.forEach( (name) => {
        const req = new messages.HelloRequest()
        req.setName(name)
        call.write(req)
    })
    call.end()
}

const streamStream = (remote) => {
    const names = ['Lucas', 'Marcela', 'Alice', 'Artur', 'João']
    const call = remote.sayHelloToEachOne()
    call.on('data',function(response){
        console.log('# streamStream # Remote said: ', response.getMsg())
    })
    names.forEach( (name) => {
        const req = new messages.HelloRequest()
        req.setName(name)
        call.write(req)
    })
    call.end()
}

const main = () => {
    const remote = new services.GreeterClient('localhost:'+PORT, 
        grpc.credentials.createInsecure() )
    
    unaryUnary(remote)
    setTimeout( () => unaryStream(remote),  100)
    setTimeout( () => streamUnary(remote),  200)
    setTimeout( () => streamStream(remote), 300)
}

main()
