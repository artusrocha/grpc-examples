package grpc.experiments.client;

import java.time.Duration;
import java.util.concurrent.CountDownLatch;
import java.util.logging.Logger;

import org.springframework.web.reactive.function.client.WebClient;

import reactor.core.publisher.Mono;

public class RestClient
{

    private static final int PORT = 8080;
    
    private static final String HOST = "localhost";

    private static final String SCHEME = "http";

    private static final Logger logger = Logger.getLogger(RestClient.class.getName());
    
    private static final String BASEURL = SCHEME + "://" + HOST + ":" + PORT ;

    private static WebClient client = WebClient.create(BASEURL);

    public static Mono<TestDTO> testRest(TestDTO request) throws InterruptedException
    {
        logger.info(request.getField1());
        logger.info(BASEURL);
        return client.post()
            .uri("/")
            .body(Mono.just(request), TestDTO.class)
            .retrieve()
            .bodyToMono(TestDTO.class)
            .timeout(Duration.ofMillis(1000L))
            .onErrorReturn(new TestDTO());
    }

    private static void print(String msg) 
    {
        logger.info(msg);
    }

}
