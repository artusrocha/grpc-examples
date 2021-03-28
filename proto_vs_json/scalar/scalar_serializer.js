const fs = require("fs")
const { newRandomScalar } = require("./scalar_model")

main()

function main() {

    scalares = []
    for (let i=0; i < 1000; i++) {
        scalares.push( newRandomScalar() )
    }

    scalares.forEach( (scalar, i) => {
        console.log( scaalr.toObject() )
    //    writeProtobuf(scalar, i)
    //    writeJson(scalar, i)    
    })

    const sizes = scalares.map( scalar => {
        return {
            json_size: Buffer.byteLength( JSON.stringify( scalar.toObject() ) ),
            proto_size: Buffer.byteLength(scalar.serializeBinary() )
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

function writeProtobuf(scalar, i) {
    fs.writeFile('./data/scalar-' + zeroPad(i, 3) + '.pb', scalar.serializeBinary(), "binary", function (err) {
        if (err) console.log("Error bin", err);
    })
}

function writeJson(scalar, i) {
    fs.writeFile('./data/scalar-' + zeroPad(i, 3) + '.json', JSON.stringify( scalar.toObject() ), function (err) {
        if (err) console.log("Error json", err);
    })
}

function zeroPad(num, places) { return String(num).padStart(places, '0') }