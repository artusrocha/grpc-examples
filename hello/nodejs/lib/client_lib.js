const messages = require("./proto/hello_pb")
const services = require("./proto/hello_grpc_pb")
const grpc = require("grpc")

const PORT = 6000
const remote = new services.GreeterClient('localhost:'+PORT, 
                                            grpc.credentials.createInsecure() )

const unaryUnary = (name) => {
    const req = new messages.HelloRequest()
    req.setName(name)
    remote.sayHello(req, function(err, response) {
        console.log('# unaryUnary # Remote said: ', response.getMsg())
    })
}

const unaryStream = async (name, times) => {
    const req = new messages.HelloRequest()
    req.setName(name)
    req.setTimes(times)
    let call = remote.sayHelloNTimes(req)
    call.on('data',function(response){
        console.log('# unaryStream # Remote said: ', response.getMsg())
    })
    call.on('end',function(){
        console.log('# unaryStream # End of stream');
    })
}

const streamUnary = (names = []) => {
//    const names = ['Lucas', 'Marcela', 'Alice', 'Artur', 'João']
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

const streamStream = async (names = []) => {
//    const names = ['Lucas', 'Marcela', 'Alice', 'Artur', 'João']
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

//const main = () => { 
//    unaryUnary(remote)
//    setTimeout( () => unaryStream(remote),  100)
//    setTimeout( () => streamUnary(remote),  200)
//    setTimeout( () => streamStream(remote), 300)
//}
//main()

module.exports = {
    sayHello: unaryUnary,
    sayHelloNTimes: unaryStream,
    sayHelloToEveryOne: streamUnary,
    sayHelloToEachOne: streamStream
}