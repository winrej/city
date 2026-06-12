type ServerErrorContext = {
  area: string;
  route?: string;
  method?: string;
  status?: number;
  details?: Record<string, unknown>;
};

const MAX_MESSAGE_LENGTH = 2_000;
const MAX_STACK_LENGTH = 6_000;

function serializeError(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message.slice(0, MAX_MESSAGE_LENGTH),
      stack: error.stack?.slice(0, MAX_STACK_LENGTH),
    };
  }

  return {
    name: "UnknownError",
    message: String(error).slice(0, MAX_MESSAGE_LENGTH),
  };
}

function getWebhookUrl() {
  return process.env.ERROR_WEBHOOK_URL ?? process.env.MONITORING_WEBHOOK_URL;
}

export async function reportServerError(error: unknown, context: ServerErrorContext) {
  const payload = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV ?? "unknown",
    context,
    error: serializeError(error),
  };

  console.error("[server-error]", payload);

  const webhookUrl = getWebhookUrl();
  if (!webhookUrl) return;

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (reportingError) {
    console.error("[server-error-reporting-failed]", serializeError(reportingError));
  }
}
