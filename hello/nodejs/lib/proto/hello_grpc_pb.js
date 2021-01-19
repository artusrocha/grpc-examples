// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var lib_proto_hello_pb = require('../../lib/proto/hello_pb.js');

function serialize_hello_HelloRequest(arg) {
  if (!(arg instanceof lib_proto_hello_pb.HelloRequest)) {
    throw new Error('Expected argument of type hello.HelloRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_hello_HelloRequest(buffer_arg) {
  return lib_proto_hello_pb.HelloRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_hello_HelloResponse(arg) {
  if (!(arg instanceof lib_proto_hello_pb.HelloResponse)) {
    throw new Error('Expected argument of type hello.HelloResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_hello_HelloResponse(buffer_arg) {
  return lib_proto_hello_pb.HelloResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var GreeterService = exports.GreeterService = {
  sayHello: {
    path: '/hello.Greeter/SayHello',
    requestStream: false,
    responseStream: false,
    requestType: lib_proto_hello_pb.HelloRequest,
    responseType: lib_proto_hello_pb.HelloResponse,
    requestSerialize: serialize_hello_HelloRequest,
    requestDeserialize: deserialize_hello_HelloRequest,
    responseSerialize: serialize_hello_HelloResponse,
    responseDeserialize: deserialize_hello_HelloResponse,
  },
  sayHelloNTimes: {
    path: '/hello.Greeter/SayHelloNTimes',
    requestStream: false,
    responseStream: true,
    requestType: lib_proto_hello_pb.HelloRequest,
    responseType: lib_proto_hello_pb.HelloResponse,
    requestSerialize: serialize_hello_HelloRequest,
    requestDeserialize: deserialize_hello_HelloRequest,
    responseSerialize: serialize_hello_HelloResponse,
    responseDeserialize: deserialize_hello_HelloResponse,
  },
  sayHelloToEveryOne: {
    path: '/hello.Greeter/SayHelloToEveryOne',
    requestStream: true,
    responseStream: false,
    requestType: lib_proto_hello_pb.HelloRequest,
    responseType: lib_proto_hello_pb.HelloResponse,
    requestSerialize: serialize_hello_HelloRequest,
    requestDeserialize: deserialize_hello_HelloRequest,
    responseSerialize: serialize_hello_HelloResponse,
    responseDeserialize: deserialize_hello_HelloResponse,
  },
  sayHelloToEachOne: {
    path: '/hello.Greeter/SayHelloToEachOne',
    requestStream: true,
    responseStream: true,
    requestType: lib_proto_hello_pb.HelloRequest,
    responseType: lib_proto_hello_pb.HelloResponse,
    requestSerialize: serialize_hello_HelloRequest,
    requestDeserialize: deserialize_hello_HelloRequest,
    responseSerialize: serialize_hello_HelloResponse,
    responseDeserialize: deserialize_hello_HelloResponse,
  },
};

exports.GreeterClient = grpc.makeGenericClientConstructor(GreeterService);
