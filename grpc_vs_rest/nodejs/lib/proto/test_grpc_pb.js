// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var lib_proto_test_pb = require('../../lib/proto/test_pb.js');

function serialize_grpc_experiments_TestRequest(arg) {
  if (!(arg instanceof lib_proto_test_pb.TestRequest)) {
    throw new Error('Expected argument of type grpc.experiments.TestRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_grpc_experiments_TestRequest(buffer_arg) {
  return lib_proto_test_pb.TestRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_grpc_experiments_TestResponse(arg) {
  if (!(arg instanceof lib_proto_test_pb.TestResponse)) {
    throw new Error('Expected argument of type grpc.experiments.TestResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_grpc_experiments_TestResponse(buffer_arg) {
  return lib_proto_test_pb.TestResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var TestService = exports.TestService = {
  testUnary: {
    path: '/grpc.experiments.Test/testUnary',
    requestStream: false,
    responseStream: false,
    requestType: lib_proto_test_pb.TestRequest,
    responseType: lib_proto_test_pb.TestResponse,
    requestSerialize: serialize_grpc_experiments_TestRequest,
    requestDeserialize: deserialize_grpc_experiments_TestRequest,
    responseSerialize: serialize_grpc_experiments_TestResponse,
    responseDeserialize: deserialize_grpc_experiments_TestResponse,
  },
  testStream: {
    path: '/grpc.experiments.Test/testStream',
    requestStream: true,
    responseStream: true,
    requestType: lib_proto_test_pb.TestRequest,
    responseType: lib_proto_test_pb.TestResponse,
    requestSerialize: serialize_grpc_experiments_TestRequest,
    requestDeserialize: deserialize_grpc_experiments_TestRequest,
    responseSerialize: serialize_grpc_experiments_TestResponse,
    responseDeserialize: deserialize_grpc_experiments_TestResponse,
  },
};

exports.TestClient = grpc.makeGenericClientConstructor(TestService);
