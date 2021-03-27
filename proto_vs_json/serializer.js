const fs = require("fs")
const proto = require("./user_pb");

const jsonStr = '{"gender":"female","name":{"title":"Miss","first":"Louane","last":"Vidal"},"location":{"street":{"number":2479,"name":"Place du 8 Février 1962"},"city":"Avignon","state":"Vendée","country":"France","postcode":78276,"coordinates":{"latitude":"2.0565","longitude":"95.2422"},"timezone":{"offset":"+1:00","description":"Brussels, Copenhagen, Madrid, Paris"}},"email":"louane.vidal@example.com","login":{"uuid":"9f07341f-c7e6-45b7-bab0-af6de5a4582d","username":"angryostrich988","password":"r2d2","salt":"B5ywSDUM","md5":"afce5fbe8f32bcec1a918f75617ab654","sha1":"1a5b1afa1d9913cf491af64ce78946d18fea6b04","sha256":"0124895aa1e6e5fb0596fad4c413602e0922e8a8c2dc758bbdb3fa070ad25a07"},"dob":{"date":"1966-06-26T11:50:25.558Z","age":55},"registered":{"date":"2016-08-11T06:51:52.086Z","age":5},"phone":"02-62-35-18-98","cell":"06-07-80-83-11","id":{"name":"INSEE","value":"2NNaN01776236 16"},"picture":{"large":"https://randomuser.me/api/portraits/women/88.jpg","medium":"https://randomuser.me/api/portraits/med/women/88.jpg","thumbnail":"https://randomuser.me/api/portraits/thumb/women/88.jpg"},"nat":"FR"}'
userOrig = JSON.parse(jsonStr)

const user = new proto.User()
user.setEmail(userOrig.email)

const name = new proto.Name()
name.setTitle( userOrig.name.title )
name.setFirst( userOrig.name.first )
name.setLast( userOrig.name.last )
user.setName( name )
console.log( user.serializeBinary().length )

const login = new proto.Login()
login.setUsername( userOrig.login.username )
login.setUuid( Buffer.from(userOrig.login.uuid.replace(/-/g,''), 'hex') )
user.setLogin(login)

const picture = new proto.Picture()
user.setPicture(picture)

const location = new proto.Location()
user.setLocation(location)


//console.log( user )
//console.log( user.toString() )
//console.log( user.toObject() )
console.log( JSON.stringify( user.toObject() ).length )
console.log( user.serializeBinary().length )

//  proto.User.deserializeBinary(bytes);
