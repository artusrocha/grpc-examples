package grpc.experiments.hello.server;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import grpc.experiments.hello.GreeterGrpc.GreeterImplBase;
import grpc.experiments.hello.Hello.HelloRequest;
import grpc.experiments.hello.Hello.HelloResponse;
import io.grpc.stub.StreamObserver;

public class GreeterServiceImpl extends GreeterImplBase
{

    private final Logger logger = Logger.getLogger(GreeterServiceImpl.class.getName());

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

    @Override
    public StreamObserver<HelloRequest> 
                sayHelloToEveryOne(final StreamObserver<HelloResponse> respOb)
    {
        return new StreamObserver<HelloRequest>() {

            List<String> persons = new ArrayList<String>();

            @Override
            public void onNext(HelloRequest req) {
                persons.add(req.getName());
            }

			@Override
			public void onError(Throwable t) {
                logger.log(Level.WARNING, "Error in HelloRequest", t);
			}

			@Override
			public void onCompleted() {
                HelloResponse resp = HelloResponse.newBuilder()
                    .setMsg("Hello " + String.join(", ", persons) )
                    .build();    
                respOb.onNext(resp);
                respOb.onCompleted();
			}
        };
    }

    @Override
    public StreamObserver<HelloRequest> 
                sayHelloToEachOne(final StreamObserver<HelloResponse> respOb)
    {
        return new StreamObserver<HelloRequest>() {

            @Override
            public void onNext(HelloRequest req) {
                HelloResponse resp = HelloResponse.newBuilder()
                    .setMsg("Hello " + req.getName() )
                    .build();
                respOb.onNext(resp);
            }

			@Override
			public void onError(Throwable t) {
                logger.log(Level.WARNING, "Error in HelloRequest", t);
			}

			@Override
			public void onCompleted() {
                respOb.onCompleted();
			}
        };
    }



}
