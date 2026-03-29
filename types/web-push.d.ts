/** Типы для `web-push` (в npm-пакете своих .d.ts нет). */
declare module "web-push" {
  import type { IncomingMessage } from "http";

  export interface PushSubscription {
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    };
  }

  const webpush: {
    setVapidDetails(
      subject: string,
      publicKey: string,
      privateKey: string,
    ): void;
    sendNotification(
      subscription: PushSubscription,
      payload?: string | Buffer | null,
      options?: Record<string, unknown>,
    ): Promise<IncomingMessage>;
  };

  export default webpush;
}
