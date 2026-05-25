"use client";

import { useState } from "react";

export default function CreateShipment() {

  const [formData, setFormData] = useState({

    awb: "",

    sender_name: "",

    receiver_name: "",

    phone: "",

    origin_city: "",

    destination_city: "",

    item_type: "",

    weight: "",

    price: "",

    shipping_type: "",

    shipping_status: "",

    notes: "",

  });

  async function handleSubmit(e: React.FormEvent) {

    e.preventDefault();

    const response = await fetch("/api/create-shipment", {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(formData),

    });

    const result = await response.json();

    alert(result.message);

  }

  return (

    <div className="p-8">

      <h1 className="text-2xl font-bold mb-6">

        Create Shipment

      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        <input
          type="text"
          placeholder="AWB"
          className="border p-2 w-full"
          onChange={(e) =>
            setFormData({
              ...formData,
              awb: e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="Sender Name"
          className="border p-2 w-full"
          onChange={(e) =>
            setFormData({
              ...formData,
              sender_name: e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="Receiver Name"
          className="border p-2 w-full"
          onChange={(e) =>
            setFormData({
              ...formData,
              receiver_name: e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="Phone"
          className="border p-2 w-full"
          onChange={(e) =>
            setFormData({
              ...formData,
              phone: e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="Origin City"
          className="border p-2 w-full"
          onChange={(e) =>
            setFormData({
              ...formData,
              origin_city: e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="Destination City"
          className="border p-2 w-full"
          onChange={(e) =>
            setFormData({
              ...formData,
              destination_city: e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="Item Type"
          className="border p-2 w-full"
          onChange={(e) =>
            setFormData({
              ...formData,
              item_type: e.target.value,
            })
          }
        />

        <input
          type="number"
          placeholder="Weight"
          className="border p-2 w-full"
          onChange={(e) =>
            setFormData({
              ...formData,
              weight: e.target.value,
            })
          }
        />

        <input
          type="number"
          placeholder="Price"
          className="border p-2 w-full"
          onChange={(e) =>
            setFormData({
              ...formData,
              price: e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="Shipping Type"
          className="border p-2 w-full"
          onChange={(e) =>
            setFormData({
              ...formData,
              shipping_type: e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="Shipping Status"
          className="border p-2 w-full"
          onChange={(e) =>
            setFormData({
              ...formData,
              shipping_status: e.target.value,
            })
          }
        />

        <textarea
          placeholder="Notes"
          className="border p-2 w-full"
          onChange={(e) =>
            setFormData({
              ...formData,
              notes: e.target.value,
            })
          }
        />

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Submit
        </button>

      </form>

    </div>

  );
}