declare module "web-push" {
  type PushSubscription = {
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    };
  };

  type WebPushModule = {
    setVapidDetails: (subject: string, publicKey: string, privateKey: string) => void;
    sendNotification: (
      subscription: PushSubscription,
      payload: string | object
    ) => Promise<unknown>;
  };

  const webpush: WebPushModule;
  export default webpush;
}