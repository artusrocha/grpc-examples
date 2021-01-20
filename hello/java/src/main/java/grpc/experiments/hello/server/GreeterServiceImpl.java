package grpc.experiments.hello.server;

import grpc.experiments.hello.GreeterGrpc.GreeterImplBase;
import grpc.experiments.hello.Hello.HelloRequest;
import grpc.experiments.hello.Hello.HelloResponse;
import io.grpc.stub.StreamObserver;

public class GreeterServiceImpl extends GreeterImplBase
{
    @Override
    public void sayHello( HelloRequest request,
                            StreamObserver<HelloResponse> respOb)
    {
        HelloResponse resp = HelloResponse.newBuilder()
                                .setMsg("Hello " + request.getName() )
                                .build();
        respOb.onNext(resp);
        respOb.onCompleted();
    }

    @Override
    public void sayHelloNTimes( HelloRequest request,
                            StreamObserver<HelloResponse> respOb)
    {
        for (int i=0; i<request.getTimes(); i++)
        {
            HelloResponse resp = HelloResponse.newBuilder()
                                    .setMsg("Hello " + request.getName() )
                                    .build();
            respOb.onNext(resp);
        }
        respOb.onCompleted();
    }



}
