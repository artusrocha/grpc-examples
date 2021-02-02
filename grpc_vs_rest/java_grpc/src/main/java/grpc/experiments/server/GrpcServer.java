package grpc.experiments.server;

import java.io.IOException;

import io.grpc.Server;
import io.grpc.ServerBuilder;

public class GrpcServer {
    final static private int PORT = 6000;

    public static void main(String[] args) throws IOException, InterruptedException
    {
        System.out.println( "Starting GRPC Hello Server" );
        Server server = ServerBuilder
            .forPort(PORT)
            .addService(new TestServiceImpl())
            .build();

        server.start();
        server.awaitTermination();

    }
}
