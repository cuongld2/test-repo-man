const { OTLPTraceExporter } = require( '@opentelemetry/exporter-trace-otlp-http');
        const { Resource } = require('@opentelemetry/resources');
        const { BatchSpanProcessor } = require( '@opentelemetry/sdk-trace-base');
        const { NodeSDK } = require('@opentelemetry/sdk-node');
        const { SemanticResourceAttributes } = require ('@opentelemetry/semantic-conventions');
        const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');

        const traceExporter = new OTLPTraceExporter({
        url: 'http://localhost:4318/v1/traces',
        });

        const sdk = new NodeSDK({
        resource: new Resource({
            [SemanticResourceAttributes.SERVICE_NAME]: `${process.env.SERVICE_NAME}`,
        }),
        instrumentations: [ getNodeAutoInstrumentations()],
        spanProcessor: new BatchSpanProcessor(traceExporter),
        });

        (async () => {
        try {
            await sdk.start();
            console.log('Tracing started.');
        } catch (error) {
            console.error(error);
        }
        })();

        // For local development to stop the tracing using Control+c
        process.on('SIGINT', async () => {
        try {
            await sdk.shutdown();
            console.log('Tracing finished.');
        } catch (error) {
            console.error(error);
        } finally {
            process.exit(0);
        }
        });
