export interface SocialSignal {
  platform: "reddit" | "youtube" | "x";
  topic: string;
  velocity: number;
  url: string;
}

export async function fetchSocialSignals(): Promise<SocialSignal[]> {
  return [
    {
      platform: "reddit",
      topic: "Breaking eyewitness footage from severe storm",
      velocity: 87,
      url: "https://reddit.com"
    }
  ];
}
