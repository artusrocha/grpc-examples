package grpc.experiments.hello.client;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.function.Consumer;
import java.util.logging.Logger;
import java.util.stream.Stream;

import com.sun.tools.javac.util.List;

import grpc.experiments.hello.GreeterGrpc;
import grpc.experiments.hello.GreeterGrpc.GreeterBlockingStub;
import grpc.experiments.hello.GreeterGrpc.GreeterStub;
import grpc.experiments.hello.Hello.HelloRequest;
import grpc.experiments.hello.Hello.HelloResponse;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.grpc.stub.StreamObserver;;

public class GrpcClient
{

    private static final int PORT = 6000;
    
    private static final String HOST = "localhost";

    private static final Logger logger = Logger.getLogger(GrpcClient.class.getName());

    private static final ManagedChannel channel = ManagedChannelBuilder.forAddress(HOST, PORT).usePlaintext().build();

    public static void main(String[] args) throws InterruptedException
    {
        
        sayHello();

        sayHelloNTimes(3);

        sayHelloToEveryOne();

        sayHelloToEachOne();

    }

    private static void sayHelloToEachOne() throws InterruptedException
    {
        final GreeterStub greeter = GreeterGrpc.newStub(channel);
        final CountDownLatch finishLatch = new CountDownLatch(1);
        StreamObserver<HelloRequest> reqStream = greeter
                                                .sayHelloToEachOne(new StreamObserver<HelloResponse>(){

                    @Override
                    public void onNext(HelloResponse value) {
                        print("# streamStream # SayHelloToEachOne # " + value.getMsg());
                    }

                    @Override
                    public void onError(Throwable t) {
                        finishLatch.countDown();
                    }

                    @Override
                    public void onCompleted() {
                        finishLatch.countDown();
                    }
                });
        
        String[] namesArray = {"João", "Tiago", "Marcelo", "Gregório"};
        for( String name : namesArray ) {
            HelloRequest request = HelloRequest.newBuilder().setName(name).build();
            reqStream.onNext(request);
        }
        reqStream.onCompleted();
        finishLatch.await(1, TimeUnit.MINUTES);
    }

    private static void sayHelloToEveryOne() throws InterruptedException
    {
        final GreeterStub greeter = GreeterGrpc.newStub(channel);
        final CountDownLatch finishLatch = new CountDownLatch(1);
        StreamObserver<HelloRequest> reqStream = greeter
                                                .sayHelloToEveryOne(new StreamObserver<HelloResponse>(){

                    @Override
                    public void onNext(HelloResponse value) {
                        print("# streamUnary # SayHelloToEveryOne # " + value.getMsg());
                    }

                    @Override
                    public void onError(Throwable t) {
                        finishLatch.countDown();
                    }

                    @Override
                    public void onCompleted() {
                        finishLatch.countDown();
                    }
                });
        
        String[] namesArray = {"Telma", "Luis", "Maria", "Lourdes"};
        for( String name : namesArray ) {
            HelloRequest request = HelloRequest.newBuilder().setName(name).build();
            reqStream.onNext(request);
        }
        reqStream.onCompleted();
        finishLatch.await(1, TimeUnit.MINUTES);
    }

    private static void sayHelloNTimes(int n)
    {
        final GreeterBlockingStub greeter = GreeterGrpc.newBlockingStub(channel);
        final HelloRequest request = HelloRequest.newBuilder()
                                        .setName("Helio")
                                        .setTimes(n)
                                        .build();
		Iterator<HelloResponse> iterator = greeter.sayHelloNTimes(request);
        /** TODO: Async/NON-Blocking solution */
        while(iterator.hasNext()) {
            HelloResponse resp = iterator.next();
            print("# unaryStream # SayHelloNTimes # " + resp.getMsg());
        }
    }

    private static void sayHello()
    {
        final GreeterBlockingStub greeter = GreeterGrpc.newBlockingStub(channel);
        final HelloRequest request = HelloRequest.newBuilder().setName("Matias").build();
        HelloResponse resp = greeter.sayHello(request);
        print("# unaryUnary # SayHello # " + resp.getMsg());
    }

    private static void print(String msg)
    {
        System.out.println(msg);
    }

}