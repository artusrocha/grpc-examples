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

    public static StreamObserver<TestRequest> testStream(final CountDownLatch latch) throws InterruptedException
    {
        final TestStub test = TestGrpc.newStub(channel);
        StreamObserver<TestRequest> reqStream = test.testStream(
            new StreamObserver<TestResponse>(){
                    @Override
                    public void onNext(TestResponse resp) {
                        //print( resp.getField1() );
                        latch.countDown();
                    }

                    @Override
                    public void onError(Throwable t) {
                        latch.countDown();
                    }

                    @Override
                    public void onCompleted() {
                        latch.countDown();
                    }
                });
        return reqStream;
    }


    public static void testUnary(TestRequest request, final CountDownLatch latch) throws InterruptedException
    {
        final TestStub test = TestGrpc.newStub(channel);
        test.testUnary(request, new StreamObserver<TestResponse>() {
            @Override
            public void onNext(TestResponse resp) {
                //print(resp.getField1());
            }

            @Override
            public void onError(Throwable t) {
                latch.countDown();
            }

            @Override
            public void onCompleted() {
                latch.countDown();
            }
        });

    }

    private static void print(String msg) {
        logger.info(msg);
    }

}
