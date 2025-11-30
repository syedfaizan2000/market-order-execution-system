import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

export function useLivePrices(apiBaseUrl: string) {
  const [tick, setTick] = useState<any>(null);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${apiBaseUrl}/marketHub`)
      .withAutomaticReconnect()
      .build();

    async function startConnection() {
      try {
        await connection.start();
        console.log("📡 Live feed connected");

        connection.on("priceUpdate", (data) => {
          setTick(data); // real-time tick update
        });

      } catch (error) {
        console.error("❌ SignalR connection failed:", error);
        setTimeout(startConnection, 2000); // retry after 2 sec
      }
    }

    startConnection();

    // 🔥 cleanup WITHOUT async
    return () => {
      connection.stop();
      console.log("🔌 Live feed disconnected");
    };
  }, [apiBaseUrl]);

  return tick;
}
