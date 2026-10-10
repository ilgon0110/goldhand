'use strict';

const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-proto');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { UndiciInstrumentation } = require('@opentelemetry/instrumentation-undici');
const { NodeSDK } = require('@opentelemetry/sdk-node');

const healthPath = '/api/health';

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter(),
  instrumentations: [
    new HttpInstrumentation({
      ignoreIncomingRequestHook(request) {
        return request.url?.split('?')[0] === healthPath;
      },
    }),
    new UndiciInstrumentation(),
  ],
});

sdk.start();

async function shutdown() {
  try {
    await sdk.shutdown();
    process.exit(0);
  } catch (error) {
    process.stderr.write(
      `${JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'error',
        service: 'nextjs',
        environment: process.env.NODE_ENV || 'unknown',
        event: 'opentelemetry.shutdown.error',
        message: error instanceof Error ? error.message : 'Unknown OpenTelemetry shutdown error',
      })}\n`,
    );
    process.exit(1);
  }
}

process.once('SIGTERM', () => void shutdown());
process.once('SIGINT', () => void shutdown());
