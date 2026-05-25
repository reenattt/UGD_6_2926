"use client";

import DashboardLayout from "../ui/layout-dashboard";
import { useState } from "react";

export default function Tracking() {

  const [awb, setAwb] = useState("");

  const [status, setStatus] =
    useState<"idle" | "found" | "notfound">(
      "idle"
    );

  const [shipment, setShipment] =
    useState<any>(null);

  const handleTrack = async () => {

    const response = await fetch(
      `/api/tracking?awb=${awb}`
    );

    const data = await response.json();

    if (data.found) {

      setShipment(data.shipment);

      setStatus("found");

    } else {

      setStatus("notfound");

      setShipment(null);

    }

  };

  const trackingSteps = [

    "Received",

    "Sortation",

    "Loaded",

    "Departed",

    "Arrived",

  ];

  const currentStep =
    trackingSteps.indexOf(
      shipment?.shipping_status
    );

  return (

    <DashboardLayout>

      {/* SEARCH */}

      <div className="bg-white p-6 rounded-xl shadow mb-6 flex gap-4">

        <input

          value={awb}

          onChange={(e) =>
            setAwb(e.target.value)
          }

          placeholder="Enter AWB number"

          className="flex-1 border p-4 rounded-lg outline-blue-500"

        />

        <button

          onClick={handleTrack}

          className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-lg"

        >
          Track
        </button>

      </div>

      {/* IDLE */}

      {status === "idle" && (

        <div className="text-center text-gray-400 mt-20 text-lg">

          Enter AWB to track shipment

        </div>

      )}

      {/* NOT FOUND */}

      {status === "notfound" && (

        <div className="flex justify-center mt-10">

          <div className="bg-white p-10 rounded-xl shadow text-center w-[450px]">

            <div className="text-5xl mb-4">
              ❌
            </div>

            <h2 className="text-2xl font-bold mb-2">

              AWB Not Found

            </h2>

            <p className="text-gray-500">

              Shipment data does not exist.

            </p>

          </div>

        </div>

      )}

      {/* FOUND */}

      {status === "found" && shipment && (

        <div className="space-y-6">

          {/* SHIPMENT INFO */}

          <div className="bg-white p-6 rounded-xl shadow">

            <h2 className="text-2xl font-bold mb-6">

              Shipment Information

            </h2>

            <div className="grid grid-cols-2 gap-4 text-sm">

              <div>
                <span className="font-semibold">
                  AWB:
                </span>{" "}
                {shipment.awb}
              </div>

              <div>
                <span className="font-semibold">
                  Shipping Type:
                </span>{" "}
                {shipment.shipping_type}
              </div>

              <div>
                <span className="font-semibold">
                  Sender:
                </span>{" "}
                {shipment.sender_name}
              </div>

              <div>
                <span className="font-semibold">
                  Receiver:
                </span>{" "}
                {shipment.receiver_name}
              </div>

              <div>
                <span className="font-semibold">
                  Phone:
                </span>{" "}
                {shipment.phone}
              </div>

              <div>
                <span className="font-semibold">
                  Item:
                </span>{" "}
                {shipment.item_type}
              </div>

              <div>
                <span className="font-semibold">
                  Origin:
                </span>{" "}
                {shipment.origin_city}
              </div>

              <div>
                <span className="font-semibold">
                  Destination:
                </span>{" "}
                {shipment.destination_city}
              </div>

              <div>
                <span className="font-semibold">
                  Weight:
                </span>{" "}
                {shipment.weight} kg
              </div>

              <div>
                <span className="font-semibold">
                  Price:
                </span>{" "}
                Rp
                {shipment.price.toLocaleString(
                  "id-ID"
                )}
              </div>

            </div>

          </div>

          {/* TRACKING STATUS */}

          <div className="bg-white p-8 rounded-xl shadow">

            <h2 className="text-2xl font-bold mb-8">

              Tracking Timeline

            </h2>

            <div className="relative ml-4">

              <div className="absolute left-[7px] top-0 h-full w-[3px] bg-gray-200"></div>

              {trackingSteps.map((step, index) => (

                <div
                  key={index}
                  className="flex items-center gap-4 mb-10 relative"
                >

                  <div

                    className={`w-4 h-4 rounded-full z-10

                    ${index <= currentStep

                      ? "bg-green-500"

                      : "bg-gray-300"

                    }

                  `}
                  ></div>

                  <div>

                    <p

                      className={`font-medium

                      ${index === currentStep

                        ? "text-blue-600"

                        : "text-gray-700"

                      }

                    `}
                    >

                      {step}

                    </p>

                    {index === currentStep && (

                      <p className="text-sm text-gray-400">

                        Current shipment status

                      </p>

                    )}

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

      )}

    </DashboardLayout>

  );

}