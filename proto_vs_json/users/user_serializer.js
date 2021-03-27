const fs = require("fs")
const { mapUser } = require("./user_mapper")

const randomUsers = JSON.parse( fs.readFileSync( __dirname + '/random_users.json') ).results
const users = randomUsers.map( userOrig => mapUser( userOrig ) )

main(users)

function main() {
    users.forEach( (user, i) => {
        writeProtobuf(user, i)
        writeJson(user, i)    
    })

    const sizes = users.map( user => {
        return {
            json_size: Buffer.byteLength( JSON.stringify( user.toObject() ) ),
            proto_size: Buffer.byteLength(user.serializeBinary() )
        }
    })

    console.log( calcAverages(sizes) )
}

function calcAverages( sizes ) {
    const sizes_sum = sizes.reduce((accumulator, current) => {
        accumulator.json_size += current.json_size
        accumulator.proto_size += current.proto_size
        return accumulator
    },{json_size: 0, proto_size: 0})
    
    return {
        json_size: Math.round( sizes_sum.json_size / sizes.length ),
        proto_size: Math.round( sizes_sum.proto_size / sizes.length )
    }
}

function writeProtobuf(user, i) {
    fs.writeFile('./data/user-' + zeroPad(i, 3) + '.pb', user.serializeBinary(), "binary", function (err) {
        if (err) console.log("Error bin", err);
    })
}

function writeJson(user, i) {
    fs.writeFile('./data/user-' + zeroPad(i, 3) + '.json', JSON.stringify( user.toObject() ), function (err) {
        if (err) console.log("Error json", err);
    })
}

function zeroPad(num, places) { return String(num).padStart(places, '0') }