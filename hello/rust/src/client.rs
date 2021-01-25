use std::error::Error;
use tonic::{ Request };
use tonic::transport::Channel;

use hello_world::greeter_client::{GreeterClient};
use hello_world::{HelloRequest};

pub mod hello_world {
    // The string specified here must match the proto package name
    tonic::include_proto!("grpc.experiments.hello");
}


async fn sayHello(greeter: &mut GreeterClient<Channel>) -> Result<(), Box<dyn Error>> {
    let resp = greeter.say_hello(
        Request::new(HelloRequest{
            name: String::from("Epicuro"),
            times: 0, // this field is not used on sayHello - unaryUnary
        })).await?.into_inner();
    println!("{}",resp.msg);
    Ok(())
}

async fn sayHelloNTimes(greeter: &mut GreeterClient<Channel>) -> Result<(), Box<dyn Error>> {
    let mut resp_n_times = greeter.say_hello_n_times(
        Request::new(HelloRequest{
            name: String::from("Seneca"),
            times: 5,
        })).await?.into_inner();
    while let Some(resp) = resp_n_times.message().await? {
        println!("{}",resp.msg);
    }

    Ok(())
}

async fn sayHelloToEveryOne(greeter: &mut GreeterClient<Channel>) -> Result<(), Box<dyn Error>> {
    let names = vec!["Diogenes", "Zenão", "Marco Aurélio"];
    let x = async_stream::stream! {
        for name in names {
            let resp = HelloRequest {
                name: String::from(name),
                times: 0, // this field value is not used here but needed to be seted
            };
            yield resp;
        }
    };
    let resp_everyone = greeter.say_hello_to_every_one(Request::new(x)).await;
    match resp_everyone {
        Ok(response) => println!("{}", response.into_inner().msg),
        Err(e) => println!("To Every One ERROR: {:?}", e),
    }
}

async fn sayHelloToEachOne(greeter: &mut GreeterClient<Channel>) -> Result<(), Box<dyn Error>> {
    let names = vec!["Diogenes", "Zenão", "Marco Aurélio"];
    let x = async_stream::stream! {
        for name in names {
            let resp = HelloRequest {
                name: String::from(name),
                times: 0, // this field value is not used here but needed to be seted
            };
            yield resp;
        }
    };
    let mut resp_eachone = greeter.say_hello_to_each_one(Request::new(x)).await?.into_inner();
    while let Some(response) = resp_eachone.message().await? {
        println!("{}", response.msg);
    }

    Ok(())
}

#[tokio::main(flavor = "current_thread")]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let addr = "https://[::1]:6000";
    let mut greeter = GreeterClient::connect(addr).await?;

    // unaryUnary
    println!("{}","unaryUnary - SayHello");
    sayHello(&mut greeter).await;

    // N Times - unaryStream
    println!("{}","unamryStream - SayHelloNTimes");
    sayHelloNTimes(&mut greeter).await;

    // To Every One - streamUnary
    println!("{}","streamUnary - SayHelloToEveryOne");
    sayHelloToEveryOne(&mut greeter).await;

    // To Each One - streamStream
    println!("{}","streamStream - SayHelloToEachOne");
    sayHelloToEachOne(&mut greeter).await;
    
    Ok(())
}