package grpc.experiments.client;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.logging.Logger;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import reactor.core.Disposable;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
public class TestController {

    private static final Logger logger = Logger.getLogger(TestController.class.getName());

    private TestDTO request;

    private int nTimes = 10000;

    private int concurrency = 10;

    public TestController() {
        request = new TestDTO();
        request.setField1("kjshsksuyosiuhskj");
        request.setField2("kjhgliuysushkjn,s.m");
        request.setField3("kgsdlkgsluystklhslkjshk.");
        request.setField4(123456);
        request.setField5(32132654986L);
        request.setField6(1321321.2132132F);
        request.setField7(32132165498.1346576);
        request.setField8(true);
    }

    @GetMapping
    public Mono<TestDTO> restTest(Integer nTimes, Integer concurrency) throws InterruptedException {
        if (nTimes == null)
            nTimes = this.nTimes;

        if (concurrency == null)
            concurrency = this.concurrency;

        logger.info("nTimes: " + nTimes + ", concurrency: " + concurrency);

        CountDownLatch latch = new CountDownLatch(nTimes);
        Instant start = Instant.now();
        for (int c = 0; c < concurrency; c++) {
            int count = nTimes / concurrency;
            recorentRequests(request, count, latch);
        }
        logger.info("Rest Sending requests: " + Duration.between(start, Instant.now()).toMillis());
        latch.await(60, TimeUnit.SECONDS);
        logger.info("Rest Execution time: " + Duration.between(start, Instant.now()).toMillis());
        return null;
    }

    private void recorentRequests(TestDTO request, int c, CountDownLatch latch) throws InterruptedException {
        final int counter = c - 1;
        RestClient.testRest(request).subscribe(d -> {
            logger.info(d.getField1()+" "+counter);
            latch.countDown();
            if (counter > 0)
                try {
                    recorentRequests(request, counter, latch);
                } catch (InterruptedException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }
        });
    }
}
