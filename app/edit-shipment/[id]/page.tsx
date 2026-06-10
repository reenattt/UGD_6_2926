"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getClientSession } from "../../lib/auth";
import { ITEM_CATEGORIES, SHIPMENT_STATUSES } from "@/app/lib/definitions";
import { AIRPORT_MASTER_DATA, resolveAirport } from "@/app/lib/airports";
import { SearchableSelect } from "@/app/ui/searchable-select";
import DashboardLayout from "../../ui/layout-dashboard";

export default function EditShipment() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    id: id,
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
    customer_id: "",
    vehicle_id: "",
  });

  useEffect(() => {
    const currentSession = getClientSession();
    if (!currentSession) {
      router.push("/home?login=true");
      return;
    }
    setSession(currentSession);
    setAuthLoading(false);

    // Fetch customers and vehicles
    fetch("/api/customers").then(res => res.json()).then(data => setCustomers(data)).catch(console.error);
    fetch("/api/vehicles").then(res => res.json()).then(data => setVehicles(data)).catch(console.error);
  }, [router]);

  useEffect(() => {
    if (authLoading) return;
    
    // Fetch shipment data
    fetch(`/api/shipments/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Shipment not found");
        return res.json();
      })
      .then((data) => {
        const originApt = resolveAirport(data.origin_city);
        const destApt = resolveAirport(data.destination_city);

        setFormData({
          id: data.id,
          awb: data.awb || "",
          sender_name: data.sender_name || "",
          receiver_name: data.receiver_name || "",
          phone: data.phone || "",
          origin_city: data.origin_city ? `${originApt.code} - ${originApt.city}` : "",
          destination_city: data.destination_city ? `${destApt.code} - ${destApt.city}` : "",
          item_type: data.item_type || "",
          weight: data.weight?.toString() || "",
          price: data.price?.toString() || "",
          shipping_type: data.shipping_type || "Biasa",
          shipping_status: data.shipping_status || "Received",
          notes: data.notes || "",
          customer_id: data.customer_id?.toString() || "",
          vehicle_id: data.vehicle_id?.toString() || "",
        });
        setIsLoading(false);
      })
      .catch((err) => {
        setGeneralError(err.message);
        setIsLoading(false);
      });
  }, [id, authLoading]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setErrors({});
    setGeneralError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/update-shipment", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        router.push("/dashboard");
      } else {
        setGeneralError(result.error || "Failed to update shipment");
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err: any) {
      setGeneralError(err.message || "Failed to update shipment");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  if (authLoading) return null;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[500px]">
          <p className="text-gray-500 font-medium animate-pulse">Loading shipment records...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Edit Shipment</h1>

        {generalError && (
          <div className="bg-red-50 p-4 rounded-xl text-red-700 font-medium mb-6">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">AWB</label>
            <input
              type="text"
              disabled
              value={formData.awb}
              className="border p-2 w-full bg-gray-100 text-slate-900"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">Sender Name</label>
            <input
              type="text"
              className={`border p-2 w-full bg-white text-slate-900 placeholder:text-slate-400 ${errors.sender_name ? "border-red-500" : ""}`}
              value={formData.sender_name}
              onChange={(e) => handleInputChange("sender_name", e.target.value)}
            />
            {errors.sender_name && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.sender_name}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">Origin City</label>
            <SearchableSelect
              options={Object.values(AIRPORT_MASTER_DATA).map(apt => ({ label: `${apt.code} - ${apt.city}`, value: `${apt.code} - ${apt.city}` }))}
              value={formData.origin_city}
              onChange={(val) => handleInputChange("origin_city", val)}
              placeholder="Select Origin Airport..."
              searchPlaceholder="Search airports..."
              error={!!errors.origin_city}
            />
            {errors.origin_city && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.origin_city}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
            <input
              type="text"
              className={`border p-2 w-full bg-white text-slate-900 placeholder:text-slate-400 ${errors.phone ? "border-red-500" : ""}`}
              value={formData.phone}
              onChange={(e) => {
                const val = e.target.value;
                const numericVal = val.replace(/\D/g, '');
                if (numericVal.length > 12) {
                  setErrors(prev => ({ ...prev, phone: "Phone number cannot exceed 12 digits." }));
                  handleInputChange("phone", numericVal.slice(0, 12));
                } else {
                  handleInputChange("phone", numericVal);
                }
              }}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">Receiver Name</label>
            <input
              type="text"
              className={`border p-2 w-full bg-white text-slate-900 placeholder:text-slate-400 ${errors.receiver_name ? "border-red-500" : ""}`}
              value={formData.receiver_name}
              onChange={(e) => handleInputChange("receiver_name", e.target.value)}
            />
            {errors.receiver_name && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.receiver_name}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">Destination City</label>
            <SearchableSelect
              options={Object.values(AIRPORT_MASTER_DATA).map(apt => ({ label: `${apt.code} - ${apt.city}`, value: `${apt.code} - ${apt.city}` }))}
              value={formData.destination_city}
              onChange={(val) => handleInputChange("destination_city", val)}
              placeholder="Select Destination Airport..."
              searchPlaceholder="Search airports..."
              error={!!errors.destination_city}
            />
            {errors.destination_city && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.destination_city}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">Item Type</label>
            <SearchableSelect
              options={Object.values(ITEM_CATEGORIES).flat().map(item => ({ label: item, value: item }))}
              value={formData.item_type}
              onChange={(val) => handleInputChange("item_type", val)}
              placeholder="Select Item Type"
              searchPlaceholder="Search item type..."
              error={!!errors.item_type}
            />
            {errors.item_type && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.item_type}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">Weight</label>
            <input
              type="number"
              step="any"
              placeholder="Enter weight in kg"
              className={`border p-2 w-full bg-white text-slate-900 placeholder:text-slate-400 ${errors.weight ? "border-red-500" : ""}`}
              value={formData.weight}
              onChange={(e) => handleInputChange("weight", e.target.value)}
            />
            {errors.weight && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.weight}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">Price</label>
            <input
              type="number"
              className={`border p-2 w-full bg-white text-slate-900 placeholder:text-slate-400 ${errors.price ? "border-red-500" : ""}`}
              value={formData.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
            />
            {errors.price && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.price}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">Shipping Service</label>
            <input
              type="text"
              className="border p-2 w-full bg-white text-slate-900 placeholder:text-slate-400"
              value={formData.shipping_type}
              onChange={(e) => handleInputChange("shipping_type", e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">Status</label>
            <SearchableSelect
              options={SHIPMENT_STATUSES.map((status) => ({ label: status, value: status }))}
              value={formData.shipping_status}
              onChange={(val) => handleInputChange("shipping_status", val)}
              placeholder="Select Status"
              searchPlaceholder="Search status..."
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">Notes / Description</label>
            <textarea
              className="border p-2 w-full outline-none bg-white text-slate-900 placeholder:text-slate-400"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">Customer (Optional)</label>
            <SearchableSelect
              options={customers.map(c => ({ label: `${c.name} - ${c.city}`, value: String(c.id) }))}
              value={String(formData.customer_id || "")}
              onChange={(val) => handleInputChange("customer_id", val)}
              placeholder="Select Customer"
              searchPlaceholder="Search customers..."
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">Vehicle (Optional)</label>
            <SearchableSelect
              options={vehicles.map(v => ({ label: `${v.vehicle_name} (${v.plate_number}) - ${v.vehicle_status}`, value: String(v.id) }))}
              value={String(formData.vehicle_id || "")}
              onChange={(val) => handleInputChange("vehicle_id", val)}
              placeholder="Select Vehicle"
              searchPlaceholder="Search vehicles..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Update"}
            </button>
          </div>

        </form>
      </div>
    </DashboardLayout>
  );
}
