package grpc.experiments.client;

import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.logging.Logger;

import grpc.experiments.TestOuterClass.TestRequest;
import io.grpc.stub.StreamObserver;

public class TestMain
{

    private static final Logger logger = Logger.getLogger(TestMain.class.getName());

    public static void main(String[] args) throws InterruptedException 
    {
        int nTimes = 10000;

        final TestRequest request = TestRequest.newBuilder()
            .setField1("kjshsksuyosiuhskj")
            .setField2("kjhgliuysushkjn,s.m")
            .setField3("kgsdlkgsluystklhslkjshk.")
            .setField4(123456)
            .setField5(32132654986L)
            .setField6(1321321.2132132F)
            .setField7(32132165498.1346576)
            .setField8(true)
            .build();
        
        unaryTest(request, nTimes);
        streamTest(request, nTimes);

        unaryTest(request, nTimes);
        streamTest(request, nTimes);

        unaryTest(request, nTimes);
        streamTest(request, nTimes);

        unaryTest(request, nTimes);
        streamTest(request, nTimes);

    }

    private static void streamTest(TestRequest request, int nTimes) throws InterruptedException
    {
        CountDownLatch latch = new CountDownLatch(nTimes);
        StreamObserver<TestRequest> reqStream = GrpcClient.testStream(latch);
        Instant start = Instant.now();
        for(int i=0; i<nTimes; i++){
            reqStream.onNext(request);
        }
        logger.info("Stream Sending requests: " + Duration.between(start, Instant.now()).toMillis() );
        reqStream.onCompleted();
        latch.await(1, TimeUnit.MINUTES);
        logger.info("Stream Execution time: " + Duration.between(start, Instant.now()).toMillis() );
    }

    private static void unaryTest(TestRequest request, int nTimes) throws InterruptedException
    {
        CountDownLatch latch = new CountDownLatch(nTimes);
        Instant start = Instant.now();
        for(int i=0; i<nTimes; i++){
            GrpcClient.testUnary(request, latch);
        }
        logger.info("Unary Sending requests: " + Duration.between(start, Instant.now()).toMillis() );
        latch.await(1, TimeUnit.MINUTES);
        logger.info("Unary Execution time: " + Duration.between(start, Instant.now()).toMillis() );
    }


}
