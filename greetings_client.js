// define proto file location
var PROTO_PATH = __dirname + "/proto/helloworld.proto";

// import dependencies
var parseArgs = require("minimist");
var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");
const prompt = require("prompt-sync")({ sigint: true });

// load proto file with it's options as package definition
var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

var hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;

function main() {
  var argv = parseArgs(process.argv.slice(2), {
    string: "target",
  });
  var target;

  if (argv.target) {
    target = argv.target;
  } else {
    target = "localhost:50052";
  }
  var client = new hello_proto.Greeter(target, grpc.credentials.createInsecure());
  var user;

  if (argv._.length > 0) {
    user = argv._[0];
  } else {
    user = prompt("what is your name: ");
  }
  client.sayHello({ name: user }, function (err, response) {
    console.log("Greeting:", response.message);
  });

  // new rpc call
  client.sayHelloAgain({ name: user }, function (err, response) {
    console.log("Greetings again :" + " " + response.message);
  });
}

main();
