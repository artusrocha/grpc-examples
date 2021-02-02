package grpc.experiments.client;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.logging.Logger;

import grpc.experiments.TestGrpc;
import grpc.experiments.TestGrpc.TestStub;
import grpc.experiments.TestOuterClass.TestRequest;
import grpc.experiments.TestOuterClass.TestResponse;
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
        int nTimes = 10000;
        for(int i=0; i<nTimes; i++){
            testUnary("Zé");
        }
//        testStream();
    }

    private static void testStream() throws InterruptedException
    {
        final TestStub test = TestGrpc.newStub(channel);
        final CountDownLatch finishLatch = new CountDownLatch(1);
        StreamObserver<TestRequest> reqStream = test.testStream(
            new StreamObserver<TestResponse>(){
                    @Override
                    public void onNext(TestResponse resp) {
                        print( resp.getField1() );
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
            TestRequest request = TestRequest.newBuilder().setField1(name).build();
            reqStream.onNext(request);
        }
        reqStream.onCompleted();
        finishLatch.await(1, TimeUnit.MINUTES);
    }


    private static void testUnary(String field1) throws InterruptedException
    {
        final CountDownLatch finishLatch = new CountDownLatch(1);
        final TestStub test = TestGrpc.newStub(channel);
        final TestRequest request = TestRequest.newBuilder().setField1(field1).build();
        test.testUnary(request, new StreamObserver<TestResponse>() {
            @Override
            public void onNext(TestResponse resp) {
                print(resp.getField1());
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
        finishLatch.await(1, TimeUnit.MINUTES);
    }

    private static void print(String msg)
    {
        System.out.println(msg);
    }

}
