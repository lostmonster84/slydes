import Foundation

/// Analytics event types - matches web implementation
enum AnalyticsEventType: String, Codable {
    case sessionStart = "sessionStart"
    case frameView = "frameView"
    case ctaClick = "ctaClick"
    case shareClick = "shareClick"
    case heartTap = "heartTap"
    case faqOpen = "faqOpen"
}

/// Analytics event payload
struct AnalyticsEvent: Codable {
    let eventType: AnalyticsEventType
    let sessionId: UUID
    let occurredAt: Date
    let slydePublicId: String
    let framePublicId: String?
    let source: String
    let referrer: String?
    let meta: [String: String]

    enum CodingKeys: String, CodingKey {
        case eventType = "event_type"
        case sessionId = "session_id"
        case occurredAt = "occurred_at"
        case slydePublicId = "slyde_public_id"
        case framePublicId = "frame_public_id"
        case source, referrer, meta
    }
}

/// Analytics service with batching and retry
actor AnalyticsService {
    static let shared = AnalyticsService()

    private var eventQueue: [AnalyticsEvent] = []
    private var sessionId: UUID?
    private let batchSize = 50
    private let flushInterval: TimeInterval = 3.0

    private init() {
        // Start periodic flush timer
        Task {
            await startPeriodicFlush()
        }
    }

    // MARK: - Session Management

    /// Start a new analytics session
    func startSession() -> UUID {
        let id = UUID()
        sessionId = id
        return id
    }

    /// Get or create session ID
    private func getSessionId() -> UUID {
        if let sessionId = sessionId {
            return sessionId
        }
        return startSession()
    }

    // MARK: - Event Tracking

    /// Track an analytics event
    func track(
        _ eventType: AnalyticsEventType,
        slydePublicId: String,
        framePublicId: String? = nil,
        meta: [String: String] = [:]
    ) {
        let event = AnalyticsEvent(
            eventType: eventType,
            sessionId: getSessionId(),
            occurredAt: Date(),
            slydePublicId: slydePublicId,
            framePublicId: framePublicId,
            source: "ios_app",
            referrer: nil,
            meta: meta
        )

        eventQueue.append(event)

        if eventQueue.count >= batchSize {
            Task { await flush() }
        }
    }

    /// Track session start
    func trackSessionStart(slydePublicId: String) {
        _ = startSession()
        track(.sessionStart, slydePublicId: slydePublicId)
    }

    /// Track frame view
    func trackFrameView(slydePublicId: String, framePublicId: String, frameIndex: Int) {
        track(
            .frameView,
            slydePublicId: slydePublicId,
            framePublicId: framePublicId,
            meta: ["frame_index": String(frameIndex)]
        )
    }

    /// Track CTA click
    func trackCtaClick(slydePublicId: String, framePublicId: String, ctaType: String) {
        track(
            .ctaClick,
            slydePublicId: slydePublicId,
            framePublicId: framePublicId,
            meta: ["cta_type": ctaType]
        )
    }

    /// Track share click
    func trackShareClick(slydePublicId: String, framePublicId: String? = nil) {
        track(.shareClick, slydePublicId: slydePublicId, framePublicId: framePublicId)
    }

    /// Track heart tap
    func trackHeartTap(slydePublicId: String, framePublicId: String, hearted: Bool) {
        track(
            .heartTap,
            slydePublicId: slydePublicId,
            framePublicId: framePublicId,
            meta: ["hearted": String(hearted)]
        )
    }

    /// Track FAQ open
    func trackFaqOpen(slydePublicId: String, faqId: String) {
        track(
            .faqOpen,
            slydePublicId: slydePublicId,
            meta: ["faq_id": faqId]
        )
    }

    // MARK: - Flushing

    /// Flush events to backend
    func flush() async {
        guard !eventQueue.isEmpty else { return }

        let batch = Array(eventQueue.prefix(batchSize))
        eventQueue.removeFirst(min(batchSize, eventQueue.count))

        do {
            try await sendEvents(batch)
        } catch {
            // Re-queue on failure (best effort)
            eventQueue.insert(contentsOf: batch, at: 0)
            print("Analytics flush failed: \(error)")
        }
    }

    /// Send events to backend API
    private func sendEvents(_ events: [AnalyticsEvent]) async throws {
        // TODO: Implement actual API call to /api/analytics/ingest
        // For now, just log
        print("Would send \(events.count) analytics events")
    }

    /// Start periodic flush timer
    private func startPeriodicFlush() async {
        while true {
            try? await Task.sleep(nanoseconds: UInt64(flushInterval * 1_000_000_000))
            await flush()
        }
    }

    // MARK: - App Lifecycle

    /// Called when app enters background - flush immediately
    func applicationDidEnterBackground() async {
        await flush()
    }
}
