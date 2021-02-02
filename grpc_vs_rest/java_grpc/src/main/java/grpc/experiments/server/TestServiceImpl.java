package grpc.experiments.server;

import java.util.logging.Level;
import java.util.logging.Logger;

import grpc.experiments.TestGrpc.TestImplBase;
import grpc.experiments.TestOuterClass.TestRequest;
import grpc.experiments.TestOuterClass.TestResponse;
import io.grpc.stub.StreamObserver;

public class TestServiceImpl extends TestImplBase
{

    private final Logger logger = Logger.getLogger(TestServiceImpl.class.getName());

    @Override
    public void testUnary( TestRequest request,
                            StreamObserver<TestResponse> respOb)
    {
        TestResponse resp = TestResponse.newBuilder()
            .setField1(request.getField1() )
            .setField2(request.getField2() )
            .setField3(request.getField3() )
            .setField4(request.getField4() )
            .setField5(request.getField5() )
            .setField6(request.getField6() )
            .setField7(request.getField7() )
            .setField8(request.getField8() )
            .build();
        respOb.onNext(resp);
        respOb.onCompleted();
    }

    @Override
    public StreamObserver<TestRequest> 
                testStream(final StreamObserver<TestResponse> respOb)
    {
        return new StreamObserver<TestRequest>() {

            @Override
            public void onNext(TestRequest request) {
                TestResponse resp = TestResponse.newBuilder()
                    .setField1(request.getField1() )
                    .setField2(request.getField2() )
                    .setField3(request.getField3() )
                    .setField4(request.getField4() )
                    .setField5(request.getField5() )
                    .setField6(request.getField6() )
                    .setField7(request.getField7() )
                    .setField8(request.getField8() )
                    .build();
                respOb.onNext(resp);
            }

			@Override
			public void onError(Throwable t) {
                logger.log(Level.WARNING, "Error in TestRequest", t);
			}

			@Override
			public void onCompleted() {
                respOb.onCompleted();
			}
        };
    }



}
