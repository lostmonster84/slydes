import SwiftUI
import AVKit

/// Full Slyde viewing experience
/// Displays frames with swipe/tap navigation, action stack, and overlays
struct SlydeView: View {
    let slyde: Slyde
    let business: BusinessInfo?
    let faqs: [FAQItem]

    /// Starting frame index (for deep links)
    var initialFrameIndex: Int = 0

    /// Callback when user wants to go back
    var onBack: (() -> Void)?

    @State private var currentFrameIndex: Int = 0
    @State private var showInfoSheet = false
    @State private var showShareSheet = false
    @State private var showConnectSheet = false
    @State private var showFAQSheet = false
    @State private var showVideoOverlay = false
    @State private var isHearted = false
    @State private var dragOffset: CGFloat = 0

    private let analyticsService = AnalyticsService.shared

    private var frames: [DatabaseFrame] {
        slyde.frames ?? []
    }

    private var currentFrame: DatabaseFrame? {
        guard currentFrameIndex < frames.count else { return nil }
        return frames[currentFrameIndex]
    }

    var body: some View {
        GeometryReader { geometry in
            ZStack {
                // Background layer
                if let frame = currentFrame {
                    FrameBackgroundView(
                        frame: frame,
                        size: geometry.size
                    )
                }

                // Gradient overlay for text readability
                VStack(spacing: 0) {
                    // Top gradient
                    LinearGradient(
                        colors: [.black.opacity(0.6), .clear],
                        startPoint: .top,
                        endPoint: .bottom
                    )
                    .frame(height: 100)

                    Spacer()

                    // Bottom gradient
                    LinearGradient(
                        colors: [.clear, .black.opacity(0.7)],
                        startPoint: .top,
                        endPoint: .bottom
                    )
                    .frame(height: 200)
                }

                // Content overlay
                VStack {
                    // Top bar
                    HStack {
                        // Back button
                        if onBack != nil {
                            Button(action: { onBack?() }) {
                                Image(systemName: "chevron.left")
                                    .font(.title2.weight(.semibold))
                                    .foregroundStyle(.white)
                                    .padding(SlydesSpacing.sm)
                                    .background(.ultraThinMaterial.opacity(0.5))
                                    .clipShape(Circle())
                            }
                        }

                        Spacer()

                        // Badge
                        if let badge = currentFrame?.badge {
                            BadgeView(text: badge)
                        }
                    }
                    .padding(.horizontal, SlydesSpacing.md)
                    .padding(.top, geometry.safeAreaInsets.top + SlydesSpacing.sm)

                    Spacer()

                    // Bottom content
                    HStack(alignment: .bottom) {
                        // Left: Title, subtitle, CTA
                        VStack(alignment: .leading, spacing: SlydesSpacing.xs) {
                            if let title = currentFrame?.title, !title.isEmpty {
                                Text(title)
                                    .font(SlydesTypography.title2)
                                    .foregroundStyle(.white)
                            }

                            if let subtitle = currentFrame?.subtitle, !subtitle.isEmpty {
                                Text(subtitle)
                                    .font(SlydesTypography.subheadline)
                                    .foregroundStyle(.white.opacity(0.8))
                            }

                            if let ctaText = currentFrame?.ctaText {
                                CTAButtonView(
                                    text: ctaText,
                                    type: currentFrame?.ctaType,
                                    action: currentFrame?.ctaAction,
                                    accentColor: currentFrame?.accentColor
                                ) {
                                    handleCTAAction()
                                }
                            }

                            // Swipe indicator
                            SwipeIndicatorView(
                                currentIndex: currentFrameIndex,
                                total: frames.count
                            )
                        }
                        .padding(.leading, SlydesSpacing.md)
                        .padding(.bottom, SlydesSpacing.lg)

                        Spacer()

                        // Right: Action stack
                        SocialActionStackView(
                            heartCount: currentFrame?.heartCount ?? 0,
                            isHearted: isHearted,
                            onHeart: { toggleHeart() },
                            onShare: { showShareSheet = true },
                            onInfo: { showInfoSheet = true },
                            onConnect: { showConnectSheet = true },
                            onVideo: currentFrame?.demoVideoUrl != nil ? { showVideoOverlay = true } : nil
                        )
                        .padding(.trailing, SlydesSpacing.sm)
                        .padding(.bottom, SlydesSpacing.lg)
                    }

                    // Frame indicator (bottom right corner)
                    HStack {
                        Spacer()
                        Text("\(currentFrameIndex + 1)/\(frames.count)")
                            .font(SlydesTypography.caption2)
                            .foregroundStyle(.white.opacity(0.5))
                    }
                    .padding(.horizontal, SlydesSpacing.md)
                    .padding(.bottom, geometry.safeAreaInsets.bottom + SlydesSpacing.sm)
                }
            }
            .offset(y: dragOffset)
            .gesture(
                DragGesture(minimumDistance: 50)
                    .onChanged { value in
                        // Elastic resistance at edges
                        let resistance: CGFloat = 0.5
                        if (currentFrameIndex == 0 && value.translation.height > 0) ||
                           (currentFrameIndex == frames.count - 1 && value.translation.height < 0) {
                            dragOffset = value.translation.height * resistance
                        } else {
                            dragOffset = value.translation.height * 0.3
                        }
                    }
                    .onEnded { value in
                        withAnimation(.spring(response: 0.3, dampingFraction: 0.8)) {
                            dragOffset = 0
                        }

                        if value.translation.height < -50 {
                            nextFrame()
                        } else if value.translation.height > 50 {
                            previousFrame()
                        }
                    }
            )
            .onTapGesture {
                nextFrame()
            }
        }
        .ignoresSafeArea()
        .onAppear {
            currentFrameIndex = min(initialFrameIndex, frames.count - 1)
            trackSessionStart()
        }
        .onChange(of: currentFrameIndex) { _, newIndex in
            trackFrameView(index: newIndex)
        }
        .sheet(isPresented: $showInfoSheet) {
            InfoSheetView(business: business, faqs: faqs)
                .presentationDetents([.medium, .large])
        }
        .sheet(isPresented: $showShareSheet) {
            ShareSheetView(slyde: slyde, frameIndex: currentFrameIndex)
        }
        .sheet(isPresented: $showConnectSheet) {
            ConnectSheetView(social: business?.social)
                .presentationDetents([.medium])
        }
        .fullScreenCover(isPresented: $showVideoOverlay) {
            if let videoUrl = currentFrame?.demoVideoUrl {
                VideoPlayerOverlayView(urlString: videoUrl) {
                    showVideoOverlay = false
                }
            }
        }
    }

    // MARK: - Navigation

    private func nextFrame() {
        guard currentFrameIndex < frames.count - 1 else { return }
        withAnimation(.easeInOut(duration: 0.2)) {
            currentFrameIndex += 1
        }
    }

    private func previousFrame() {
        guard currentFrameIndex > 0 else { return }
        withAnimation(.easeInOut(duration: 0.2)) {
            currentFrameIndex -= 1
        }
    }

    // MARK: - Actions

    private func toggleHeart() {
        isHearted.toggle()
        Task {
            await analyticsService.trackHeartTap(
                slydePublicId: slyde.publicId,
                framePublicId: currentFrame?.publicId ?? "",
                hearted: isHearted
            )
        }
        // TODO: Persist heart state to backend
    }

    private func handleCTAAction() {
        guard let frame = currentFrame else { return }

        Task {
            await analyticsService.trackCtaClick(
                slydePublicId: slyde.publicId,
                framePublicId: frame.publicId,
                ctaType: frame.ctaType?.rawValue ?? "unknown"
            )
        }

        switch frame.ctaType {
        case .call:
            if let phone = frame.ctaAction, let url = URL(string: "tel:\(phone)") {
                UIApplication.shared.open(url)
            }
        case .email:
            if let email = frame.ctaAction, let url = URL(string: "mailto:\(email)") {
                UIApplication.shared.open(url)
            }
        case .link:
            if let urlString = frame.ctaAction, let url = URL(string: urlString) {
                UIApplication.shared.open(url)
            }
        case .directions:
            if let address = frame.ctaAction {
                let encoded = address.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? ""
                if let url = URL(string: "maps://?q=\(encoded)") {
                    UIApplication.shared.open(url)
                }
            }
        case .info:
            showInfoSheet = true
        case .faq:
            showFAQSheet = true
        case .list:
            // TODO: Show list modal
            break
        case .frame:
            if let indexString = frame.ctaAction, let index = Int(indexString) {
                withAnimation {
                    currentFrameIndex = min(index, frames.count - 1)
                }
            }
        case .reviews:
            // TODO: Show reviews sheet
            break
        case .none:
            break
        }
    }

    // MARK: - Analytics

    private func trackSessionStart() {
        Task {
            await analyticsService.trackSessionStart(slydePublicId: slyde.publicId)
        }
    }

    private func trackFrameView(index: Int) {
        guard index < frames.count else { return }
        let frame = frames[index]
        Task {
            await analyticsService.trackFrameView(
                slydePublicId: slyde.publicId,
                framePublicId: frame.publicId,
                frameIndex: index
            )
        }
    }
}


#Preview {
    SlydeView(
        slyde: Slyde(
            id: UUID(),
            organizationId: UUID(),
            publicId: "demo",
            title: "Demo Slyde",
            description: nil,
            icon: nil,
            orderIndex: 0,
            published: true,
            hasInventory: false,
            inventoryCtaText: nil,
            coverBackgroundType: nil,
            coverBackgroundSrc: nil,
            coverVideoFilter: nil,
            coverVideoVignette: nil,
            coverVideoSpeed: nil,
            frames: []
        ),
        business: nil,
        faqs: []
    )
}
