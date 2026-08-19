"use client";

import * as Sentry from "@sentry/nextjs";
import NextError from "next/error";
import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
// SENTRY_AUTH_TOKEN=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
