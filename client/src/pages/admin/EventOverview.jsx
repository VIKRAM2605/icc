import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getEventById, reviewEventByAdmin } from "../../../config/api";
import Alert from "../../components/Alert";
import { getAuthToken, getAuthUser } from "../../utils/auth";

const statusBadgeClass = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const renderDetails = (details = {}) => {
  return Object.entries(details)
    .filter(([, value]) => value !== null && value !== undefined && String(value).trim() !== "")
    .map(([key, value]) => (
      <div key={key} className="rounded-md border border-gray-200 p-3">
        <p className="text-xs font-semibold uppercase text-gray-500">{key}</p>
        <p className="mt-1 wrap-break-word text-sm text-gray-800">{typeof value === "object" ? JSON.stringify(value) : String(value)}</p>
      </div>
    ));
};

export default function EventOverview() {
  const { eventId } = useParams();
  const token = useMemo(() => getAuthToken(), []);
  const user = useMemo(() => getAuthUser(), []);
  const isAdmin = user?.roleName === "admin";

  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rejectMessage, setRejectMessage] = useState("");
  const [processingReview, setProcessingReview] = useState(false);
  const [alertState, setAlertState] = useState({ isOpen: false, message: "", severity: "info" });

  const loadEvent = async () => {
    if (!eventId) {
      return;
    }

    setLoading(true);
    try {
      const payload = await getEventById({ token, eventId });
      setEventData(payload.data || null);
      setRejectMessage(payload.data?.rejectionMessage || "");
    } catch (error) {
      setAlertState({
        isOpen: true,
        message: error.message || "Failed to fetch event details.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvent();
  }, [eventId, token]);

  const handleReview = async (action) => {
    if (!isAdmin || !eventId) {
      return;
    }

    setProcessingReview(true);
    try {
      const payload = await reviewEventByAdmin({
        token,
        eventId,
        action,
        rejectionMessage: action === "reject" ? rejectMessage : "",
      });

      setAlertState({
        isOpen: true,
        message: payload.message || "Event updated.",
        severity: "success",
      });

      await loadEvent();
    } catch (error) {
      setAlertState({
        isOpen: true,
        message: error.message || "Failed to update review.",
        severity: "error",
      });
    } finally {
      setProcessingReview(false);
    }
  };

  return (
    <section className="-m-6 min-h-full bg-white px-6 py-5">
      <div className="mb-4 flex items-center justify-between">
        <Link to={isAdmin ? "/admin/review" : "/teacher/dashboard"} className="text-sm font-medium text-primary hover:underline">
          Back
        </Link>
        {eventData?.status && (
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
              statusBadgeClass[eventData.status] || "bg-gray-100 text-gray-700"
            }`}
          >
            {eventData.status}
          </span>
        )}
      </div>

      {loading && <div className="text-sm text-gray-500">Loading...</div>}

      {!loading && eventData && (
        <div className="space-y-6">
          <div className="rounded-md border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900">{eventData.eventName || `Event #${eventData.id}`}</h2>
            <p className="mt-3 text-sm text-gray-700">{eventData.majorReason || "No major reason provided."}</p>

            <div className="mt-4 grid gap-3 text-xs text-gray-700 md:grid-cols-2 xl:grid-cols-4">
              <p><span className="font-semibold">Quarter:</span> {eventData.quarter || "-"}</p>
              <p><span className="font-semibold">Owner:</span> {eventData.ownerName || "-"}</p>
              <p><span className="font-semibold">Email:</span> {eventData.ownerEmail || "-"}</p>
              <p><span className="font-semibold">Rejection Msg:</span> {eventData.rejectionMessage || "-"}</p>
            </div>
          </div>

          {isAdmin && (
            <div className="rounded-md border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-900">Review Action</h3>
              <textarea
                value={rejectMessage}
                onChange={(event) => setRejectMessage(event.target.value)}
                rows={4}
                className="mt-3 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                placeholder="Optional rejection message"
              />
              <div className="mt-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleReview("approve")}
                  disabled={processingReview}
                  className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-70"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => handleReview("reject")}
                  disabled={processingReview}
                  className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-70"
                >
                  Reject
                </button>
              </div>
            </div>
          )}

          <div className="rounded-md border border-gray-200 p-5">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">Minor Details</h3>
            <div className="grid gap-3 md:grid-cols-2">
              {renderDetails(eventData.programDetails)}
              {renderDetails(eventData.durationDetails)}
              {renderDetails(eventData.overview)}
              {renderDetails(eventData.speakerDetails)}
              {renderDetails(eventData.bipPortal)}
              {renderDetails(eventData.faculty)}
            </div>
          </div>
        </div>
      )}

      <Alert
        isOpen={alertState.isOpen}
        onClose={() => setAlertState((previous) => ({ ...previous, isOpen: false }))}
        severity={alertState.severity}
        message={alertState.message}
      />
    </section>
  );
}
