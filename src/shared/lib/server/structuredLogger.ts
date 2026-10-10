interface IStructuredError {
  type: string;
  message: string;
  stack?: string;
  code?: string;
  digest?: string;
}

const MAX_ATTRIBUTE_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 2_000;
const MAX_STACK_LENGTH = 16_000;

function truncate(value: string, maxLength: number): string {
  return value.length <= maxLength ? value : `${value.slice(0, maxLength)}…`;
}

function stringProperty(value: object, property: string): string | undefined {
  const candidate = Reflect.get(value, property);
  return typeof candidate === 'string' ? candidate : undefined;
}

function serializeError(error: unknown): IStructuredError {
  if (typeof error !== 'object' || error === null) {
    return {
      type: 'Error',
      message: typeof error === 'string' ? truncate(error, MAX_MESSAGE_LENGTH) : 'Unknown error',
    };
  }

  const type = stringProperty(error, 'name') ?? 'Error';
  const message = stringProperty(error, 'message') ?? 'Unknown error';
  const stack = stringProperty(error, 'stack');
  const code = stringProperty(error, 'code');
  const digest = stringProperty(error, 'digest');

  return {
    type: truncate(type, MAX_ATTRIBUTE_LENGTH),
    message: truncate(message, MAX_MESSAGE_LENGTH),
    ...(stack ? { stack: truncate(stack, MAX_STACK_LENGTH) } : {}),
    ...(code ? { code: truncate(code, MAX_ATTRIBUTE_LENGTH) } : {}),
    ...(digest ? { digest: truncate(digest, MAX_ATTRIBUTE_LENGTH) } : {}),
  };
}

export function logServerError(message: string, error: unknown): void {
  const entry = {
    timestamp: new Date().toISOString(),
    level: 'error',
    service: 'nextjs',
    environment: process.env.NEXT_PUBLIC_ENVIRONMENT || process.env.NODE_ENV || 'unknown',
    event: 'application.error',
    message: truncate(message, MAX_MESSAGE_LENGTH),
    error: serializeError(error),
  };

  process.stderr.write(`${JSON.stringify(entry)}\n`);
}
