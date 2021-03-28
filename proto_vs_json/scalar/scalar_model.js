const proto = require("./scalar_pb")

exports.newRandomScalar = newRandomScalar

function newRandomScalar() {
    const scalar = new proto.Scalar() 
    scalar.setBoolean1( Math.random() < 0.5 )
    scalar.setBoolean2( Math.random() < 0.5 )
    scalar.setFloat1( Math.random() )
    scalar.setFloat2( Math.random() )
    scalar.setUint1( Math.floor(Math.random() * Number.MAX_VALUE) )
    scalar.setUint2( Math.floor(Math.random() * Number.MAX_VALUE) )
    scalar.setInt1( Math.floor(Math.random() * Number.MAX_VALUE) )
    scalar.setInt2( Math.floor(Math.random() * Number.MAX_VALUE) )
    return scalar
}

