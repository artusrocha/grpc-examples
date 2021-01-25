use tonic::{transport::Server, Request, Response, Status};
use std::pin::Pin;
use futures::{Stream, StreamExt};
use tokio::sync::mpsc;

use hello_world::greeter_server::{Greeter, GreeterServer};
use hello_world::{HelloResponse, HelloRequest};

pub mod hello_world {
    // The string specified here must match the proto package name
    tonic::include_proto!("grpc.experiments.hello");
}

#[derive(Debug, Default)]
pub struct MyGreeter {}

#[tonic::async_trait]
impl Greeter for MyGreeter {
    async fn say_hello( &self, request: Request<HelloRequest>,)
                        -> Result<Response<HelloResponse>, Status> {
        println!("Got a request: {:?}", request);
        let resp = HelloResponse {
            msg: format!("Hello {}!", request.into_inner().name).into(),
        };
        Ok(Response::new(resp))
    }

    type SayHelloNTimesStream = 
        Pin<Box<dyn Stream<Item = Result<HelloResponse, Status>> + Send + Sync + 'static>>;

    async fn say_hello_n_times( &self, request: Request<HelloRequest>, )
                            -> Result<Response<Self::SayHelloNTimesStream>, Status> {
        // https://docs.rs/tokio/1.1.0/tokio/sync/mpsc/fn.channel.html
        // mpsc: A multi-producer, single-consumer queue for
        // sending values across asynchronous tasks. Returns (Sender<T>, Receiver<T>)
        let (tx, rx) = mpsc::channel(4);
        tokio::spawn(async move {
            for i in 0..request.get_ref().times {
                println!("SayHelloNTimesStream - Loop {}", i+1);
                let resp = HelloResponse {
                    msg: format!( "Hello {}!", request.get_ref().name ).into(),
                };
                tx.send(Ok(resp)).await.unwrap();
            }
        });
        Ok(Response::new(Box::pin(
            tokio_stream::wrappers::ReceiverStream::new(rx),
        )))
    }

    type SayHelloToEachOneStream = 
        Pin<Box<dyn Stream<Item = Result<HelloResponse, Status>> + Send + Sync + 'static>>;

    async fn say_hello_to_every_one( &self, req_stream: Request<tonic::Streaming<HelloRequest>>,)
                            -> Result<Response<HelloResponse>, Status> {
        //
        let mut stream = req_stream.into_inner();
        let mut names: Vec<String>  = vec![];
        while let Some(request_opt) = stream.next().await {
            let request = request_opt?;
            println!("SayHelloToEveryOne - Loop {}", request.name);
            names.push(request.name)
        }
        let resp = HelloResponse {
            msg: format!("Hello {}!", names.join(", ")).into(),
        };
        Ok(Response::new(resp))
    }

    async fn say_hello_to_each_one( &self, req_stream: Request<tonic::Streaming<HelloRequest>>,)
                            -> Result<Response<Self::SayHelloToEachOneStream>, Status> {
        //
        let (tx, rx) = mpsc::channel(4);
        tokio::spawn(async move {
            let mut stream = req_stream.into_inner();
            while let Some(request_opt) = stream.next().await {
                let request = request_opt.unwrap();
                println!("SayHelloToEachOne - Loop {}", request.name);
                let resp = HelloResponse {
                    msg: format!( "Hello {}!", request.name ).into(),
                };
                tx.send(Ok(resp)).await.unwrap();
            }
        });
        Ok(Response::new(Box::pin(
            tokio_stream::wrappers::ReceiverStream::new(rx),
        )))
    }
}

#[tokio::main(flavor = "current_thread")]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let addr = "[::1]:6000".parse()?;
    let greeter = MyGreeter::default();

    Server::builder()
        .add_service(GreeterServer::new(greeter))
        .serve(addr)
        .await?;

    Ok(())
}