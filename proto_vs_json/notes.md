Para realizar este teste/comparação entre o volume de dados nos dois tipos de serialização (string/json vs binary/protobuf) vamos obter dados de usuários fakes da API (https://randomuser.me/api/?format=json&results=1000&seed=teste_proto_vs_json). Serão obtidos 1000 usuários para este teste.  
  
Nem todos os dados obtidos desta API serão utilizados, pois passaremos por um mapeamento para o .proto que utilizará alguns dos campos, enquanto outros dados serão descartados no processo.
O json será gerado à partir do objeto mapeado para proto, para que ambos reflitam a mesma informação.

O arquivo proto é este:
```sh
syntax="proto3";

package my.system.person;

message User {
    string gender = 1;
    Name name = 2;
    string email = 3;
    Login login = 4;
    Picture picture = 5;
    Location location = 6;
    bool isactive = 7;
}

message Name {
    string title = 1;
    string first = 2;
    string last = 3;
}

message Location {
    Street street = 1;
    string city = 2;
    string state = 3;
    string country = 4;
    string postcode = 5;
    Geo coordinates = 6;
    TZ timezone = 7;
}

message Street {
    int32 number = 1;
    string name = 2;
}

message Geo {
    float latitude = 1;
    float longitude = 2;
}

message TZ {
    string offset = 1;
    string description = 2;
}

message Login {
    string username = 1;
    bytes uuid = 2;
    bool isloggedin = 3;
}

message Picture {
    string large = 1;
    string medium = 2;
    string thumbnail = 3;
}
```

Um objeto mapeado para este controto proto fica com esta cara:
```js
{
  gender: 'male',
  name: { title: 'Mr', first: 'Sean', last: 'Perkins' },
  email: 'sean.perkins@example.com',
  login: {
    username: 'blackdog194',
    uuid: '25eAaALBTHa5Ixo+RLtSZQ==',
    isloggedin: true
  },
  picture: {
    large: 'https://randomuser.me/api/portraits/men/91.jpg',
    medium: 'https://randomuser.me/api/portraits/med/men/91.jpg',
    thumbnail: 'https://randomuser.me/api/portraits/thumb/men/91.jpg'
  },
  location: {
    street: { number: 4481, name: 'Northaven Rd' },
    city: 'Adelaide',
    state: 'Queensland',
    country: 'Australia',
    postcode: 7056,
    coordinates: { latitude: -86.0805, longitude: -24.3252 },
    timezone: { offset: '+3:30', description: 'Tehran' }
  },
  isactive: false
}
```

O codigo que fará o mapeamento dos dados, a serialização e escrita dos arquivos será feito em js com node, mas poderia ser com qualquer outra linguagem.
As dependências (package.json):
```json
{
    "name": "proto_vs_json",
    "version": "0.1.0",
    "description": "Testing serialization with protobuf and json",
    "scripts": {
        "test-user": "node users/user_serializer.js",
        "build-user-proto": "protoc --js_out=import_style=commonjs,binary:./ --plugin=protoc-gen-grpc=node_modules/grpc-tools/bin/grpc_node_plugin users/user.proto"
    },
    "keywords": [],
    "author": "Artus Rocha",
    "dependencies": {
        "google-protobuf": "^3.15.6",
        "grpc": "^1.24.6"
    },
    "devDependencies": {
        "grpc-tools": "^1.11.1"
    }
}
```

Comando para gerar o códifo à partir do arquivo .proto:
```sh 
protoc --js_out=import_style=commonjs,binary:./ --plugin=protoc-gen-grpc=node_modules/grpc-tools/bin/grpc_node_plugin user.proto 
```
  
Eu não falarei de todo o código, porque não é o foco aqui, mas o código completo pode ser visto [aqui](https://github.com/artusrocha/grpc-examples/tree/master/proto_vs_json).
Destacarei apenas poucos trechos.
Serializando para binary/protobuf e escrevendo arquivo:
```js
function writeProtobuf(user, i) {
    fs.writeFile('./data/user-' + zeroPad(i, 3) + '.pb', user.serializeBinary(), "binary", function (err) {
        if (err) console.log("Error bin", err);
    })
}
```  
  
Serializando para string/json e escrevendo arquivo:
```js
function writeJson(user, i) {
    fs.writeFile('./data/user-' + zeroPad(i, 3)  + '.json', JSON.stringify( user.toObject() ), function (err) {
        if (err) console.log("Error json", err);
    })
}
```
  
Os arquivos com dados serializados em formato string json, ficaram com um tamanho médio de 688 bytes.

```sh
$> wc -c data/*.json 
# ...
   686 data/user-991.json
   662 data/user-992.json
   684 data/user-993.json
   682 data/user-994.json
   663 data/user-995.json
   729 data/user-996.json
   669 data/user-997.json
   699 data/user-998.json
   698 data/user-999.json
687943 total
```
Os arquivos com dados serializados em formato binário protobuf, que eu salvei com a extensão '.pb', ficaram com um tamanho médio de 362 bytes
```sh
$> wc -c data/*.pb 
# ...
   360 data/user-991.pb
   338 data/user-992.pb
   357 data/user-993.pb
   358 data/user-994.pb
   333 data/user-995.pb
   406 data/user-996.pb
   341 data/user-997.pb
   371 data/user-998.pb
   378 data/user-999.pb
362108 total
```

Vemos aqui que a versão serializada com um formato binário protobuf neste caso foi em média 47% menor que o mesmo dado serializado em formato string/json.  
  
Mas... aqui não estamos utilizando compressão e quando trafegamos estes dados as boas práticas orientam a utilização de uma compressão como a gzip.
Então vamos compactar os arquivos e verificarmos como fica esta relação:
```sh
$> gzip -6 data/*
```

```sh
$> wc -c data/*.json.gz
# ...
   429 data/user-991.json.gz
   413 data/user-992.json.gz
   433 data/user-993.json.gz
   431 data/user-994.json.gz
   413 data/user-995.json.gz
   455 data/user-996.json.gz
   416 data/user-997.json.gz
   442 data/user-998.json.gz
   438 data/user-999.json.gz
432815 total
```

```sh
$ wc -c data/*.pb.gz
# ...
   285 data/user-991.pb.gz
   274 data/user-992.pb.gz
   290 data/user-993.pb.gz
   287 data/user-994.pb.gz
   266 data/user-995.pb.gz
   320 data/user-996.pb.gz
   271 data/user-997.pb.gz
   303 data/user-998.pb.gz
   310 data/user-999.pb.gz
291953 total
```

Utilizando uma compressão gzip com fator de compressão 6, ficamos uma média de 433 bytes para arquivos com json. E uma média de 292 bytes para os arquivos com dados em formato binário protobuf.  
A proporção entre protobuf e json diminui, e agora o protobuf é em média 32% menor que o json.
A compactação da versão string/json ser maior é algo esperado pois, por já ser bem mais otimizado e ter menos dados repetidos a margem para compactação do protobuf diminui.