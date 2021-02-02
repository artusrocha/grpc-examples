package grpc.experiments;

import java.util.logging.Logger;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import reactor.core.publisher.Mono;

@RestController
public class ApiController
{
	private final static Logger logger = Logger.getLogger(ApiController.class.getName());

	@PostMapping
	public Mono<TestDTO> unary(@RequestBody TestDTO input)
	{
		TestDTO output = mkResponse(input);
		logger.info(output.getField1());
		return Mono.just(output);
	}

	private TestDTO mkResponse(TestDTO input)
	{
		TestDTO output = new TestDTO();
		output.setField1(input.getField1());
		output.setField2(input.getField2());
		output.setField3(input.getField3());
		output.setField4(input.getField4());
		output.setField5(input.getField5());
		output.setField6(input.getField6());
		output.setField7(input.getField7());
		output.setField8(input.getField8());
		return output;
	}
}
