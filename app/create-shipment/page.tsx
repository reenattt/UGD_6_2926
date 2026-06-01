"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getClientSession } from "../lib/auth";
import { ITEM_CATEGORIES } from "../lib/definitions";

export default function CreateShipment() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");

  useEffect(() => {
    const currentSession = getClientSession();
    if (!currentSession) {
      router.push("/home?login=true");
      return;
    }
    setSession(currentSession);
    setAuthLoading(false);
  }, [router]);

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
    shipping_status: "Sortation",
    notes: "",
  });

  async function handleSubmit(e: React.FormEvent) {

    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!formData.awb.trim()) newErrors.awb = "AWB is required";
    if (!formData.sender_name.trim()) newErrors.sender_name = "Sender Name is required";
    if (!formData.receiver_name.trim()) newErrors.receiver_name = "Receiver Name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone Number is required";
    if (!formData.origin_city.trim()) newErrors.origin_city = "Origin City is required";
    if (!formData.destination_city.trim()) newErrors.destination_city = "Destination City is required";
    if (!formData.item_type.trim()) newErrors.item_type = "Item Type is required";

    if (!formData.weight.trim()) {
      newErrors.weight = "Weight is required";
    } else {
      const w = Number(formData.weight);
      if (isNaN(w) || w <= 0) {
        newErrors.weight = "Weight must be a positive number";
      }
    }

    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    } else {
      const p = Number(formData.price);
      if (isNaN(p) || p <= 0) {
        newErrors.price = "Price must be a positive number";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setGeneralError("");

    try {
      const response = await fetch("/api/create-shipment", {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(formData),

      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message || "Shipment created successfully");
        router.push("/home");
      } else {
        setGeneralError(result.error || "Failed to create shipment");
      }
    } catch (err: any) {
      setGeneralError(err.message || "Failed to create shipment");
    }

  }

  if (authLoading) {
    return null;
  }

  return (

    <div className="p-8">

      <h1 className="text-2xl font-bold mb-6">

        Create Shipment

      </h1>

      {generalError && (
        <div className="bg-red-50 p-4 rounded-xl text-red-700 font-medium mb-6">
          {generalError}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-1">AWB</label>
          <input
            type="text"
            className={`border p-2 w-full ${errors.awb ? "border-red-500" : ""}`}
            onChange={(e) => {
              setFormData({
                ...formData,
                awb: e.target.value,
              });
              if (errors.awb) {
                setErrors((prev) => {
                  const copy = { ...prev };
                  delete copy.awb;
                  return copy;
                });
              }
            }}
          />
          {errors.awb && (
            <p className="text-red-500 text-xs mt-1 font-medium">{errors.awb}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-1">Sender Name</label>
          <input
            type="text"
            className={`border p-2 w-full ${errors.sender_name ? "border-red-500" : ""}`}
            onChange={(e) => {
              setFormData({
                ...formData,
                sender_name: e.target.value,
              });
              if (errors.sender_name) {
                setErrors((prev) => {
                  const copy = { ...prev };
                  delete copy.sender_name;
                  return copy;
                });
              }
            }}
          />
          {errors.sender_name && (
            <p className="text-red-500 text-xs mt-1 font-medium">{errors.sender_name}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-1">Receiver Name</label>
          <input
            type="text"
            className={`border p-2 w-full ${errors.receiver_name ? "border-red-500" : ""}`}
            onChange={(e) => {
              setFormData({
                ...formData,
                receiver_name: e.target.value,
              });
              if (errors.receiver_name) {
                setErrors((prev) => {
                  const copy = { ...prev };
                  delete copy.receiver_name;
                  return copy;
                });
              }
            }}
          />
          {errors.receiver_name && (
            <p className="text-red-500 text-xs mt-1 font-medium">{errors.receiver_name}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
          <input
            type="text"
            className={`border p-2 w-full ${errors.phone ? "border-red-500" : ""}`}
            onChange={(e) => {
              setFormData({
                ...formData,
                phone: e.target.value,
              });
              if (errors.phone) {
                setErrors((prev) => {
                  const copy = { ...prev };
                  delete copy.phone;
                  return copy;
                });
              }
            }}
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-1">Origin City</label>
          <input
            type="text"
            className={`border p-2 w-full ${errors.origin_city ? "border-red-500" : ""}`}
            onChange={(e) => {
              setFormData({
                ...formData,
                origin_city: e.target.value,
              });
              if (errors.origin_city) {
                setErrors((prev) => {
                  const copy = { ...prev };
                  delete copy.origin_city;
                  return copy;
                });
              }
            }}
          />
          {errors.origin_city && (
            <p className="text-red-500 text-xs mt-1 font-medium">{errors.origin_city}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-1">Destination City</label>
          <input
            type="text"
            className={`border p-2 w-full ${errors.destination_city ? "border-red-500" : ""}`}
            onChange={(e) => {
              setFormData({
                ...formData,
                destination_city: e.target.value,
              });
              if (errors.destination_city) {
                setErrors((prev) => {
                  const copy = { ...prev };
                  delete copy.destination_city;
                  return copy;
                });
              }
            }}
          />
          {errors.destination_city && (
            <p className="text-red-500 text-xs mt-1 font-medium">{errors.destination_city}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-1">Item Type</label>
          <select
            value={formData.item_type}
            className={`border p-2 w-full bg-white text-black rounded outline-none transition focus:ring-2 focus:ring-blue-200 ${
              errors.item_type ? "border-red-500" : "border-gray-300"
            }`}
            onChange={(e) => {
              setFormData({
                ...formData,
                item_type: e.target.value,
              });
              if (errors.item_type) {
                setErrors((prev) => {
                  const copy = { ...prev };
                  delete copy.item_type;
                  return copy;
                });
              }
            }}
          >
            <option value="">Select Item Type</option>
            {Object.entries(ITEM_CATEGORIES).map(([category, items]) => (
              <optgroup key={category} label={category}>
                {items.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          {errors.item_type && (
            <p className="text-red-500 text-xs mt-1 font-medium">{errors.item_type}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-1">Weight</label>
          <input
            type="number"
            className={`border p-2 w-full ${errors.weight ? "border-red-500" : ""}`}
            onChange={(e) => {
              setFormData({
                ...formData,
                weight: e.target.value,
              });
              if (errors.weight) {
                setErrors((prev) => {
                  const copy = { ...prev };
                  delete copy.weight;
                  return copy;
                });
              }
            }}
          />
          {errors.weight && (
            <p className="text-red-500 text-xs mt-1 font-medium">{errors.weight}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-1">Price</label>
          <input
            type="number"
            className={`border p-2 w-full ${errors.price ? "border-red-500" : ""}`}
            onChange={(e) => {
              setFormData({
                ...formData,
                price: e.target.value,
              });
              if (errors.price) {
                setErrors((prev) => {
                  const copy = { ...prev };
                  delete copy.price;
                  return copy;
                });
              }
            }}
          />
          {errors.price && (
            <p className="text-red-500 text-xs mt-1 font-medium">{errors.price}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-1">Shipment Type</label>
          <input
            type="text"
            className="border p-2 w-full"
            onChange={(e) =>
              setFormData({
                ...formData,
                shipping_type: e.target.value,
              })
            }
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-1">Status</label>
          <select
            value={formData.shipping_status}
            className="border p-2 w-full bg-white text-black rounded outline-none transition focus:ring-2 focus:ring-blue-200"
            onChange={(e) =>
              setFormData({
                ...formData,
                shipping_status: e.target.value,
              })
            }
          >
            <option value="Received">Received</option>
            <option value="Sortation">Sortation</option>
            <option value="Loaded">Loaded</option>
            <option value="On Board">On Board</option>
            <option value="Arrived">Arrived</option>
            <option value="Delayed">Delayed</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-1">Notes / Description</label>
          <textarea
            className="border p-2 w-full outline-none"
            onChange={(e) =>
              setFormData({
                ...formData,
                notes: e.target.value,
              })
            }
          />
        </div>

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