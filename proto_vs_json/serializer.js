const fs = require("fs")
const proto = require("./user_pb")

const jsonStr = fs.readFileSync('./random_users.json')
const randomUsers = JSON.parse(jsonStr).results

sizes = randomUsers.map( (userOrig, i) => {
    const user = mapUser( userOrig )
    fs.writeFile('./data/pbdata/'+i+'.pbdata', user.serializeBinary(), "binary", function (err) {
        if (err) console.log("Error bin", err);
    })
    fs.writeFile('./data/json/'+i+'.json', JSON.stringify( user.toObject() ), function (err) {
        if (err) console.log("Error json", err);
    })
    return {
        item: i,
        json_size: Buffer.byteLength( JSON.stringify( user.toObject() ) ),
        proto_size: Buffer.byteLength(user.serializeBinary() )
    }
})

console.log(sizes)

function mapUser( userOrig ) {
    const user = new proto.User() 
    user.setGender(userOrig.gender)
    user.setEmail(userOrig.email)
    user.setName( mapName(userOrig.name) )
    user.setLogin( mapLogin( userOrig.login ) )
    user.setPicture( mapPicture(userOrig.picture) )
    user.setLocation( mapLocation(userOrig.location) )
    user.setIsactive( Math.random() < 0.5 )
    return user
}

function mapName( origName ) {
    const name = new proto.Name()
    name.setTitle( origName.title )
    name.setFirst( origName.first )
    name.setLast(  origName.last )
    return name
}

function mapLogin( origLogin ) {
    const login = new proto.Login()
    login.setUsername( origLogin.username )
    login.setUuid( Buffer.from(origLogin.uuid.replace(/-/g,''), 'hex') )
    login.setIsloggedin( Math.random() < 0.5 )
    return login
}

function mapPicture( origPicture ) {
    const picture = new proto.Picture()
    picture.setLarge( origPicture.large )
    picture.setMedium( origPicture.medium )
    picture.setThumbnail( origPicture.thumbnail )
    return picture
}

function mapLocation( locationOrig ) {
    const location = new proto.Location()
    location.setCity( locationOrig.city )
    location.setState( locationOrig.state )
    location.setCountry( locationOrig.country )
    location.setPostcode( locationOrig.postcode )
    location.setStreet( mapStreet(locationOrig.street) )
    location.setCoordinates( mapCoordinate( locationOrig.coordinates ) )
    location.setTimezone( mapTZ( locationOrig.timezone ) )
    return location
}

function mapStreet( streetOrig ) {
    const street = new proto.Street()
    street.setNumber( streetOrig.number )
    street.setName( streetOrig.name )
    return street
}

function mapCoordinate( coordinatesOrig ) {
    const geo = new proto.Geo()
    geo.setLatitude( coordinatesOrig.latitude )
    geo.setLongitude( coordinatesOrig.longitude )
    return geo
}

function mapTZ( tzOrig ) {
    const tz = new proto.TZ()
    tz.setOffset( tzOrig.offset )
    tz.setDescription( tzOrig.description )
    return tz
}