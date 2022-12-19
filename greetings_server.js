// path of protobuffer definition file
var PROTO_PATH = __dirname + "/proto/helloworld.proto";

// import grpc and protobuffer loader dependencies
var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");

// add protobuf file to protoloader and it's options
var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

// add packageDefinition and proto file to grpc instance
var hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;

// rpc service function
function sayHello(call, callback) {
  callback(null, { message: "Hello " + call.request.name });
}

function sayHelloAgain(call, callback) {
  callback(null, { message: "Hello again" + " " + call.request.name });
}

// main function
function main() {
  var server = new grpc.Server();

  // add rpc service
  server.addService(hello_proto.Greeter.service, {
    sayHello: sayHello,
    sayHelloAgain: sayHelloAgain,
  });

  // start server and listen for request
  server.bindAsync("0.0.0.0:50052", grpc.ServerCredentials.createInsecure(), () => {
    server.start();
  });
}

// initialize server
main();
