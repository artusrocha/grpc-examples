Instalando o plugin para gerarção de código js à partir do .proto:
```sh
npm -s i grpc-tools -D
```

Comando para gerar o códifo à partir do arquivo .proto:
```sh 
protoc --js_out=import_style=commonjs,binary:./ --plugin=protoc-gen-grpc=node_modules/grpc-tools/bin/grpc_node_plugin user.proto 
```

