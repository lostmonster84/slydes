import SwiftUI
import AVKit
import NukeUI

/// Background view for a frame (video or image)
struct FrameBackgroundView: View {
    let frame: DatabaseFrame
    let size: CGSize

    var body: some View {
        ZStack {
            switch frame.backgroundType {
            case .video:
                VideoBackgroundView(
                    videoUrl: resolveVideoUrl(),
                    filter: frame.videoFilter,
                    speed: frame.videoSpeed,
                    vignette: frame.videoVignette ?? false,
                    startTime: nil
                )
            case .image, .none:
                ImageBackgroundView(
                    imageUrl: resolveImageUrl(),
                    kenBurns: false
                )
            case .gradient:
                GradientBackgroundView(gradient: frame.backgroundGradient)
            case .color:
                ColorBackgroundView(color: frame.backgroundColor)
            }

            // Vignette overlay
            if frame.videoVignette == true {
                VignetteOverlay()
            }
        }
    }

    // TODO: Resolve actual URLs from media attachments
    private func resolveVideoUrl() -> URL? {
        // Placeholder - will be resolved from media attachments table
        nil
    }

    private func resolveImageUrl() -> URL? {
        nil
    }
}

/// Video background with looping playback
struct VideoBackgroundView: View {
    let videoUrl: URL?
    let filter: VideoFilter?
    let speed: VideoSpeed?
    let vignette: Bool
    let startTime: Double?

    @State private var player: AVPlayer?

    var body: some View {
        GeometryReader { geometry in
            if let url = videoUrl {
                VideoPlayer(player: player)
                    .disabled(true) // No controls
                    .aspectRatio(contentMode: .fill)
                    .frame(width: geometry.size.width, height: geometry.size.height)
                    .clipped()
                    .colorEffect(filterShader)
                    .onAppear {
                        setupPlayer(url: url)
                    }
                    .onDisappear {
                        player?.pause()
                        player = nil
                    }
            } else {
                // Placeholder when no video
                Rectangle()
                    .fill(SlydesColors.futureBlack)
            }
        }
    }

    private func setupPlayer(url: URL) {
        let playerItem = AVPlayerItem(url: url)
        player = AVPlayer(playerItem: playerItem)
        player?.isMuted = true
        player?.actionAtItemEnd = .none

        // Set playback speed
        if let speed = speed {
            player?.rate = speed.rate
        }

        // Seek to start time if specified
        if let startTime = startTime {
            player?.seek(to: CMTime(seconds: startTime, preferredTimescale: 600))
        }

        // Loop video
        NotificationCenter.default.addObserver(
            forName: .AVPlayerItemDidPlayToEndTime,
            object: playerItem,
            queue: .main
        ) { _ in
            player?.seek(to: .zero)
            player?.play()
        }

        player?.play()
    }

    // TODO: Implement Metal shaders for filters
    private var filterShader: Shader {
        // Placeholder - returns identity shader
        // Real implementation would use Metal for:
        // cinematic: contrast(1.1) saturate(0.85) brightness(0.95) sepia(0.05)
        // vintage: sepia(0.25) contrast(1.1) brightness(1.05) saturate(1.2)
        // etc.
        Shader(function: .init(library: .default, name: "passthrough"), arguments: [])
    }
}

/// Image background with optional Ken Burns effect
struct ImageBackgroundView: View {
    let imageUrl: URL?
    let kenBurns: Bool

    @State private var scale: CGFloat = 1.0
    @State private var offset: CGSize = .zero

    var body: some View {
        GeometryReader { geometry in
            if let url = imageUrl {
                LazyImage(url: url) { state in
                    if let image = state.image {
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                            .frame(width: geometry.size.width, height: geometry.size.height)
                            .clipped()
                            .scaleEffect(scale)
                            .offset(offset)
                    } else if state.isLoading {
                        Rectangle()
                            .fill(SlydesColors.futureBlack)
                    } else {
                        Rectangle()
                            .fill(SlydesColors.futureBlack)
                    }
                }
                .onAppear {
                    if kenBurns {
                        startKenBurnsAnimation()
                    }
                }
            } else {
                Rectangle()
                    .fill(SlydesColors.futureBlack)
            }
        }
    }

    private func startKenBurnsAnimation() {
        withAnimation(.easeInOut(duration: 10).repeatForever(autoreverses: true)) {
            scale = 1.1
            offset = CGSize(width: 10, height: 5)
        }
    }
}

/// Gradient background
struct GradientBackgroundView: View {
    let gradient: String?

    var body: some View {
        // Parse gradient string and render
        // Format: "from-blue-600 to-cyan-500" or similar
        LinearGradient(
            colors: [SlydesColors.leaderBlue, SlydesColors.electricCyan],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
    }
}

/// Solid color background
struct ColorBackgroundView: View {
    let color: String?

    var body: some View {
        Rectangle()
            .fill(Color(hex: color ?? "0A0E27"))
    }
}

/// Vignette overlay for cinematic effect
struct VignetteOverlay: View {
    var body: some View {
        RadialGradient(
            gradient: Gradient(stops: [
                .init(color: .clear, location: 0.5),
                .init(color: .black.opacity(0.4), location: 1.0)
            ]),
            center: .center,
            startRadius: 0,
            endRadius: UIScreen.main.bounds.height * 0.7
        )
        .allowsHitTesting(false)
    }
}

#Preview {
    FrameBackgroundView(
        frame: DatabaseFrame(
            id: UUID(),
            organizationId: UUID(),
            slydeId: UUID(),
            publicId: "1",
            frameIndex: 1,
            templateType: nil,
            title: "Demo",
            subtitle: nil,
            badge: nil,
            ctaText: nil,
            ctaAction: nil,
            ctaType: nil,
            ctaIcon: nil,
            backgroundType: .gradient,
            backgroundGradient: nil,
            backgroundColor: nil,
            videoFilter: nil,
            videoVignette: true,
            videoSpeed: nil,
            accentColor: nil,
            demoVideoUrl: nil,
            listId: nil,
            listItemId: nil
        ),
        size: UIScreen.main.bounds.size
    )
}
